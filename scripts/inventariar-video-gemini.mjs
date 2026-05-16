#!/usr/bin/env node
// Inventaria vídeos brutos via Gemini API (análise curta pra briefing).
// Uso: node scripts/inventariar-video-gemini.mjs <video1> [video2] [video3] ...
// Saída: JSON com inventário, um item por vídeo.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  const txt = fs.readFileSync(envPath, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

async function uploadVideo(videoPath) {
  const sizeBytes = fs.statSync(videoPath).size;
  const displayName = path.basename(videoPath);
  const startRes = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "X-Goog-Upload-Protocol": "resumable",
        "X-Goog-Upload-Command": "start",
        "X-Goog-Upload-Header-Content-Length": String(sizeBytes),
        "X-Goog-Upload-Header-Content-Type": "video/quicktime",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file: { display_name: displayName } }),
    }
  );
  const uploadUrl = startRes.headers.get("x-goog-upload-url");
  const buf = fs.readFileSync(videoPath);
  const upRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Length": String(sizeBytes),
      "X-Goog-Upload-Offset": "0",
      "X-Goog-Upload-Command": "upload, finalize",
    },
    body: buf,
  });
  const json = await upRes.json();
  return json.file;
}

async function waitActive(fileName) {
  let state = "PROCESSING";
  while (state === "PROCESSING") {
    await new Promise((r) => setTimeout(r, 2000));
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${API_KEY}`
    );
    const j = await r.json();
    state = j.state;
  }
  return state;
}

const PROMPT = `Analise esse clipe (de uma pasta de material bruto de aulas de yoga em um centro de treinamento). Devolva JSON puro, sem markdown, sem cercas, EXATAMENTE assim:

{
  "cena": "1 frase curta descrevendo o que acontece visualmente",
  "ambiente": "estúdio | sala | exterior | piscina | outro",
  "pessoas": "quantas + perfil aparente (ex: '1 mulher adulta', '3 adultas + 1 idosa')",
  "postura_ou_acao": "nome da postura/ação principal (ex: 'savasana', 'gato-vaca', 'tadasana', 'respiração sentada', 'alongamento', 'em movimento')",
  "enquadramento": "close | meio | plano aberto | aéreo",
  "qualidade_luz": "natural / artificial / mista, descrever rapidamente",
  "tom_visual": "calmo | dinâmico | dramático | neutro",
  "tem_postura_extrema": true/false,
  "mostra_pes": true/false,
  "mostra_maos_em_close": true/false,
  "diversidade_aparente": true/false,
  "util_para_hook_respiracao": true/false,
  "util_para_equilibrio": true/false,
  "util_para_foco": true/false,
  "util_para_sintese_corpo_solto": true/false,
  "util_para_inclusao": true/false,
  "util_para_plano_aberto_sala": true/false,
  "util_para_bridge_saindo": true/false,
  "observacoes": "qualquer coisa relevante que não cabe acima, como: música no áudio, fala de alguém, qualidade técnica, problemas (tremor, foco), etc"
}`;

async function analyze(file) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { file_data: { mime_type: "video/quicktime", file_uri: file.uri } },
              { text: PROMPT },
            ],
          },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048, responseMimeType: "application/json" },
      }),
    }
  );
  const j = await r.json();
  if (!r.ok || j.error) {
    process.stderr.write(`\nERRO HTTP ${r.status}: ${JSON.stringify(j).slice(0, 600)}\n`);
  }
  const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  const usage = j.usageMetadata || {};
  return { text, usage, raw: j };
}

async function deleteFile(fileName) {
  try {
    await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${API_KEY}`,
      { method: "DELETE" }
    );
  } catch {}
}

const videos = process.argv.slice(2);
if (!videos.length) {
  console.error("Uso: node scripts/inventariar-video-gemini.mjs <vid1> [vid2] ...");
  process.exit(1);
}

const results = [];
let totalIn = 0;
let totalOut = 0;

for (const v of videos) {
  const name = path.basename(v);
  process.stderr.write(`[${name}] upload...`);
  const file = await uploadVideo(v);
  await waitActive(file.name);
  process.stderr.write(" analisando...");
  let parsed = null;
  let raw = "";
  try {
    const { text, usage } = await analyze(file);
    raw = text;
    totalIn += usage.promptTokenCount || 0;
    totalOut += usage.candidatesTokenCount || 0;
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    parsed = { error: "parse failed", raw };
  }
  results.push({ arquivo: name, ...parsed });
  process.stderr.write(" ok\n");
  await deleteFile(file.name);
  // throttling leve pro free tier
  await new Promise((r) => setTimeout(r, 1500));
}

const usd = (totalIn / 1_000_000) * 0.3 + (totalOut / 1_000_000) * 2.5;
const brl = usd * 5.6;
process.stderr.write(`\n🔸 custo: US$${usd.toFixed(4)} (~R$${brl.toFixed(3)})\n`);

console.log(JSON.stringify(results, null, 2));
