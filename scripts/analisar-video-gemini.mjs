#!/usr/bin/env node
// Analisa um vídeo (Reels/anúncio) via Gemini API.
// Uso: node scripts/analisar-video-gemini.mjs <caminho-do-video> [contexto-curto]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) throw new Error(".env.local não encontrado");
  const txt = fs.readFileSync(envPath, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error("GEMINI_API_KEY ausente em .env.local");

const videoPath = process.argv[2];
const contexto = process.argv[3] || "";
if (!videoPath || !fs.existsSync(videoPath)) {
  console.error("Caminho inválido: " + videoPath);
  process.exit(1);
}

const MODEL = process.env.GEMINI_VIDEO_MODEL || "gemini-2.5-flash";
const stats = fs.statSync(videoPath);
const sizeBytes = stats.size;
const displayName = path.basename(videoPath);

console.log(`📼 ${displayName}  (${(sizeBytes / 1_048_576).toFixed(1)} MB)`);

// 1) Iniciar upload resumable
const startRes = await fetch(
  `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${API_KEY}`,
  {
    method: "POST",
    headers: {
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(sizeBytes),
      "X-Goog-Upload-Header-Content-Type": "video/mp4",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: { display_name: displayName } }),
  }
);
if (!startRes.ok) {
  console.error("Falha ao iniciar upload:", startRes.status, await startRes.text());
  process.exit(1);
}
const uploadUrl = startRes.headers.get("x-goog-upload-url");
if (!uploadUrl) {
  console.error("Sem upload URL no header. Headers:", [...startRes.headers.entries()]);
  process.exit(1);
}

// 2) Subir os bytes
console.log("⬆️  uploading...");
const buf = fs.readFileSync(videoPath);
const uploadRes = await fetch(uploadUrl, {
  method: "POST",
  headers: {
    "Content-Length": String(sizeBytes),
    "X-Goog-Upload-Offset": "0",
    "X-Goog-Upload-Command": "upload, finalize",
  },
  body: buf,
});
if (!uploadRes.ok) {
  console.error("Falha no upload:", uploadRes.status, await uploadRes.text());
  process.exit(1);
}
const uploadJson = await uploadRes.json();
const fileUri = uploadJson.file.uri;
const fileName = uploadJson.file.name;
console.log("✅ uploaded:", fileName);

// 3) Aguardar processamento
let state = uploadJson.file.state;
while (state === "PROCESSING") {
  await new Promise((r) => setTimeout(r, 2000));
  const poll = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${API_KEY}`
  );
  const pj = await poll.json();
  state = pj.state;
  process.stdout.write(".");
}
console.log("\n🎬 state:", state);
if (state !== "ACTIVE") {
  console.error("Arquivo não ficou ACTIVE");
  process.exit(1);
}

// 4) Análise estrutural
const prompt = `Você é estrategista de mídia paga e direção criativa. Analise esse vídeo de anúncio (Reels 9:16) com olhar técnico e prático.

${contexto ? `Contexto extra: ${contexto}\n` : ""}

Devolva em markdown EXATAMENTE nessas seções:

## 1. Ficha técnica
- Duração total
- Formato (Reels, story, feed)
- Idioma do áudio
- Tem narração? Música? Som ambiente?
- Tem texto queimado em tela? Onde fica?

## 2. Transcrição completa
Áudio (se tiver) + todo texto que aparece em tela, com timestamps aproximados em segundos. Formato:
\`[0:00–0:03]\` áudio: "..." | tela: "..."

## 3. Estrutura narrativa
Identifique e descreva:
- **Hook (0-3s)** — o que faz parar o scroll?
- **Desenvolvimento** — como a ideia se desenvolve?
- **Prova / demonstração** — o que mostra que funciona?
- **CTA** — qual é, onde aparece, como é apresentado?

## 4. Linguagem visual
- Cenas (lista do que é mostrado, em ordem)
- Ritmo de cortes (rápido, médio, lento — estime cortes por segundo)
- Pessoas em cena (quantas, perfil aparente)
- Ambiente
- Paleta dominante e estética geral

## 5. Copy
- Tom de voz (descrever em 3-5 adjetivos)
- Tipo de copy (educativa, emocional, demonstrativa, social proof, urgência…)
- Vocabulário recorrente

## 6. Por que provavelmente rodou bem
3-5 hipóteses concretas baseadas no que você viu (não inventar números, só raciocínio).

## 7. Padrões replicáveis
Liste 5-7 elementos estruturais que valem replicar pra outras modalidades do mesmo centro de treinamento. Seja específico (não "ter um bom hook" — diga COMO o hook foi feito).`;

console.log("🤖 pedindo análise...");
const genRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { file_data: { mime_type: "video/mp4", file_uri: fileUri } },
            { text: prompt },
          ],
        },
      ],
      generationConfig: { temperature: 0.4, maxOutputTokens: 8192 },
    }),
  }
);
if (!genRes.ok) {
  console.error("Falha na análise:", genRes.status, await genRes.text());
  process.exit(1);
}
const genJson = await genRes.json();
const text = genJson.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || "";
const usage = genJson.usageMetadata || {};

console.log("\n========== ANÁLISE ==========\n");
console.log(text);
console.log("\n========== USAGE ==========");
console.log(JSON.stringify(usage, null, 2));

// 5) Custo aproximado (preços pagos: 2.5 Pro $1.25/$5 ≤200k tokens; 2.5 Flash $0.30/$2.50)
const inTokens = usage.promptTokenCount || 0;
const outTokens = usage.candidatesTokenCount || 0;
const isFlash = MODEL.includes("flash");
const inRate = isFlash ? 0.3 : 1.25;
const outRate = isFlash ? 2.5 : 5;
const usd = (inTokens / 1_000_000) * inRate + (outTokens / 1_000_000) * outRate;
const brl = usd * 5.6;
console.log(`\n🔸 custo aproximado: US$${usd.toFixed(4)} (~R$${brl.toFixed(3)})`);

// 6) Limpar arquivo no servidor (manda só apagar, ignora erro)
try {
  await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${API_KEY}`,
    { method: "DELETE" }
  );
} catch {}
