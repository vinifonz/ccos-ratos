#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const stateDir = path.join(__dirname, "state");
const stateFile = path.join(stateDir, "ycsa-leads-last-run.txt");
const notifyScript = path.join(__dirname, "notify-whatsapp.mjs");

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1CkAofrl48xiPHw0P9_w6Tw36Mh2TeUF2O0EuwNRy7Lc/export?format=csv";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}
loadEnv(path.join(repoRoot, ".env.local"));
loadEnv(path.join(repoRoot, ".env"));

function readLastRun() {
  if (!fs.existsSync(stateFile)) {
    const fallback = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return { ts: fallback, isFirstRun: true };
  }
  const raw = fs.readFileSync(stateFile, "utf8").trim();
  return { ts: new Date(raw), isFirstRun: false };
}

function writeLastRun(date) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(stateFile, date.toISOString(), "utf8");
}

function parseCSV(text) {
  const rows = [];
  let cur = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        cur.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else {
        field += c;
      }
    }
  }
  if (field.length || cur.length) {
    cur.push(field);
    rows.push(cur);
  }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0].trim() !== ""));
}

function parseBrDateTime(s) {
  // Format: DD/MM/YYYY HH:MM (assumed America/Sao_Paulo local)
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const [, d, mo, y, h, mi, se] = m;
  // Treat as -03:00 (Brasília) — fixed offset; good enough for weekly aggregation
  const iso = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${h.padStart(2, "0")}:${mi}:${se || "00"}-03:00`;
  const date = new Date(iso);
  return isNaN(date.getTime()) ? null : date;
}

function formatBrDate(d) {
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function topEntries(map, n = 3) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

async function fetchSheet() {
  const res = await fetch(SHEET_CSV_URL, { redirect: "follow" });
  if (!res.ok) throw new Error(`Falha ao baixar planilha: HTTP ${res.status}`);
  return await res.text();
}

function buildMessage({ leads, since, now, isFirstRun }) {
  const periodStart = formatBrDate(since);
  const periodEnd = formatBrDate(now);
  const header = `Leads YCSA Escola de Vela — semana de ${periodStart} a ${periodEnd}`;

  if (leads.length === 0) {
    const detail = isFirstRun
      ? "(primeira execução — janela considerada: últimos 7 dias)"
      : "(janela desde a última execução bem-sucedida)";
    return `${header}\n\nNenhum lead novo desde a última atualização.\n${detail}`;
  }

  const byStatus = new Map();
  const byTurma = new Map();
  const byOrigem = new Map();
  const byAd = new Map();

  for (const l of leads) {
    byStatus.set(l.status, (byStatus.get(l.status) || 0) + 1);
    byTurma.set(l.turma, (byTurma.get(l.turma) || 0) + 1);
    byOrigem.set(l.origem, (byOrigem.get(l.origem) || 0) + 1);
    if (l.anuncio) byAd.set(l.anuncio, (byAd.get(l.anuncio) || 0) + 1);
  }

  const lines = [];
  lines.push(header);
  lines.push("");
  lines.push(`Total novos: ${leads.length}`);
  lines.push("");
  lines.push("Por status:");
  for (const [k, v] of topEntries(byStatus, 10)) lines.push(`- ${k || "(vazio)"}: ${v}`);
  lines.push("");
  lines.push("Por turma:");
  for (const [k, v] of topEntries(byTurma, 6)) lines.push(`- ${k || "(vazio)"}: ${v}`);
  lines.push("");
  lines.push("Por origem:");
  for (const [k, v] of topEntries(byOrigem, 6)) lines.push(`- ${k || "(vazio)"}: ${v}`);
  if (byAd.size > 0) {
    lines.push("");
    const [topAd, count] = topEntries(byAd, 1)[0];
    lines.push(`Anúncio com mais leads: "${topAd}" (${count})`);
  }
  lines.push("");
  lines.push(`Planilha completa: https://docs.google.com/spreadsheets/d/1CkAofrl48xiPHw0P9_w6Tw36Mh2TeUF2O0EuwNRy7Lc/edit`);

  return lines.join("\n");
}

function sendWhatsApp(text) {
  const result = spawnSync(process.execPath, [notifyScript, "--text", text], {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      `notify-whatsapp.mjs falhou (exit ${result.status}): ${result.stderr || result.stdout}`
    );
  }
  return result.stdout;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const { ts: lastRun, isFirstRun } = readLastRun();
  const now = new Date();

  console.log(`[ycsa-leads-weekly] Última execução: ${lastRun.toISOString()} ${isFirstRun ? "(default 7d)" : ""}`);
  console.log(`[ycsa-leads-weekly] Agora: ${now.toISOString()}`);

  const csv = await fetchSheet();
  const rows = parseCSV(csv);
  if (rows.length === 0) throw new Error("Planilha vazia ou sem cabeçalho");

  const headers = rows[0].map((h) => h.trim());
  const idx = (name) => headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());

  const colData = idx("Data/Hora da Inscrição");
  const colNome = idx("Nome do Responsável");
  const colSobrenome = idx("Sobrenome");
  const colTurma = idx("Turma");
  const colStatus = idx("Status");
  const colOrigem = idx("Origem");
  const colMidia = idx("Mídia");
  const colCampanha = idx("Campanha");
  const colAnuncio = idx("Anúncio");

  if (colData < 0) throw new Error("Coluna 'Data/Hora da Inscrição' não encontrada");

  const leads = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const d = parseBrDateTime(r[colData] || "");
    if (!d) continue;
    if (d <= lastRun) continue;
    leads.push({
      data: d,
      nome: `${r[colNome] || ""} ${r[colSobrenome] || ""}`.trim(),
      turma: r[colTurma] || "",
      status: r[colStatus] || "",
      origem: r[colOrigem] || "",
      midia: r[colMidia] || "",
      campanha: r[colCampanha] || "",
      anuncio: r[colAnuncio] || "",
    });
  }

  console.log(`[ycsa-leads-weekly] Leads novos: ${leads.length}`);

  const message = buildMessage({ leads, since: lastRun, now, isFirstRun });
  console.log("\n--- MENSAGEM ---\n" + message + "\n----------------\n");

  if (dryRun) {
    console.log("[ycsa-leads-weekly] --dry-run: não enviando WhatsApp e não atualizando estado.");
    return;
  }

  sendWhatsApp(message);
  writeLastRun(now);
  console.log(`[ycsa-leads-weekly] Mensagem enviada. Estado atualizado para ${now.toISOString()}`);
}

main().catch((err) => {
  console.error(`[ycsa-leads-weekly] ERRO: ${err.message}`);
  process.exit(1);
});
