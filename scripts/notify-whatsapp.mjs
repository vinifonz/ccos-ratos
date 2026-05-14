#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

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

const BASE = process.env.UAZAPI_BASE_URL;
const TOKEN = process.env.UAZAPI_TOKEN;
const DEFAULT_NUMBER = process.env.UAZAPI_NOTIFY_NUMBER;

if (!BASE || !TOKEN) {
  console.error("Faltando UAZAPI_BASE_URL ou UAZAPI_TOKEN em .env.local");
  process.exit(1);
}

function readStdinSync() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function parseArgs(argv) {
  const args = { number: DEFAULT_NUMBER, text: null, stdinJson: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--number" || a === "-n") args.number = argv[++i];
    else if (a === "--text" || a === "-t") args.text = argv[++i];
    else if (a === "--stdin-json") args.stdinJson = true;
    else if (!args.text) args.text = a;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

const stdinRaw = !process.stdin.isTTY ? readStdinSync().trim() : "";

if (args.stdinJson || (stdinRaw.startsWith("{") && stdinRaw.endsWith("}"))) {
  try {
    const payload = JSON.parse(stdinRaw);
    const event = payload.hook_event_name || "Notification";
    const msg = payload.message || payload.transcript_path || "(sem mensagem)";
    if (!args.text) args.text = `[Claude Code · ${event}]\n${msg}`;
  } catch {
    if (!args.text && stdinRaw) args.text = stdinRaw;
  }
} else if (!args.text && stdinRaw) {
  args.text = stdinRaw;
}

if (!args.text) {
  console.error("Uso: node scripts/notify-whatsapp.mjs \"mensagem\"  |  echo \"msg\" | node scripts/notify-whatsapp.mjs");
  process.exit(1);
}

if (!args.number) {
  console.error("Faltando número de destino (UAZAPI_NOTIFY_NUMBER ou --number).");
  process.exit(1);
}

const url = `${BASE.replace(/\/$/, "")}/send/text`;
const body = { number: args.number, text: args.text };

try {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN,
    },
    body: JSON.stringify(body),
  });
  const txt = await res.text();
  if (!res.ok) {
    console.error(`Falha HTTP ${res.status}: ${txt}`);
    process.exit(1);
  }
  console.log(txt);
} catch (err) {
  console.error(`Erro de rede: ${err.message}`);
  process.exit(1);
}
