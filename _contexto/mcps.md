# MCPs — Filosofia e Ativação Sob Demanda

## Filosofia
**API direto antes de MCP.** MCPs consomem tokens só pra ficar disponíveis no contexto, mesmo quando não estão em uso. Por padrão **todos os MCPs ficam desativados** — ativa só quando a tarefa exigir, desativa ao terminar.

Pra ver quais MCPs estão ativos agora:
```bash
claude mcp list
```

---

## MCPs prontos pra ativar (não instalados por padrão)

### Notion — base de clientes e tarefas
**Quando ativar:** se a Jaquelinne quiser que o Claude leia briefings, base de clientes ou roadmap que more no Notion.
**Pré-requisito:** API key em [notion.so/my-integrations](https://notion.so/my-integrations).
**Ativar:**
```bash
claude mcp add notion -- npx -y @notionhq/notion-mcp-server
```
**Desativar ao terminar:**
```bash
claude mcp remove notion
```

---

### Trello — board de fluxo de cliente
**Quando ativar:** se a agência usar Trello como backlog/board de cliente.
**Pré-requisito:** Trello API key + token, salvos como `TRELLO_KEY` e `TRELLO_TOKEN` no `.env`.
**Ativar:**
```bash
claude mcp add trello -- npx -y trello-mcp-server
```
**Desativar:**
```bash
claude mcp remove trello
```

---

### Google Drive — ler arquivos do Drive direto do Claude
**Quando ativar:** quando precisar ler briefings, decks ou planilhas que vivem no Drive sem baixar e jogar em `dados/`.
**Pré-requisito:** OAuth Google.
**Ativar:**
```bash
claude mcp add gdrive -- npx -y @modelcontextprotocol/server-gdrive
```
**Desativar:**
```bash
claude mcp remove gdrive
```

---

### Gmail — rascunhar email pra cliente
**Quando ativar:** quando for usar `/email-profissional` direto pra rascunhar email pra cliente sem copiar/colar.
**Pré-requisito:** OAuth Google.
**Ativar:**
```bash
claude mcp add gmail -- npx -y @gongrzhe/server-gmail-autoauth-mcp
```
**Desativar:**
```bash
claude mcp remove gmail
```

---

### context7 — documentação atualizada de bibliotecas
**Quando ativar:** quando estiver mexendo com código (GTM, dataLayer, tracking server-side, etc) e precisar de doc atualizada de biblioteca/framework.
**Pré-requisito:** nenhum.
**Ativar:**
```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp
```
**Desativar:**
```bash
claude mcp remove context7
```

---

## CLIs e APIs que NÃO são MCP (não precisam ativar/desativar)

Esses são alternativas em formato de API/CLI direto. Não consomem token enquanto não estão em uso. Configurar `.env` quando chegar a hora de usar.

### Cloudflare Pages — publicar propostas e LPs com link
**Quando usar:** ao rodar `/proposta-comercial` ou `/publicar-site` e precisar de link compartilhável.
**Pré-requisito:** conta Cloudflare (grátis) + `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` no `.env`.
**Comando:** `npx wrangler pages deploy .` na pasta da proposta.

### Post for Me — publicar carrossel/reels Instagram automatizado
**Quando usar:** se quiser automatizar publicação de carrossel/reels via `/carrossel`.
**Pré-requisito:** criar conta em [postforme.dev](https://postforme.dev) + salvar `POSTFORME_API_KEY` no `.env`.

### Gemini API — Nano Banana Pro (imagem) + Gemini 2.5/3 (texto)
**Quando usar:** chamar API direto pra **editar imagem via JSON** (skill `/editar-imagem`) ou rodar prompts em texto. **Geração de imagem do zero NÃO usa API** — fica no GUI do AI Studio (decisão estratégica, ver memória `imagem-workflow-split`). Configurada e validada.
**Pré-requisito:** chave em `.env.local` como `GEMINI_API_KEY` (vinculada ao project GCP `murupi-gws`).
**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` com header `x-goog-api-key`.
**Modelo padrão imagem:** `gemini-3-pro-image-preview` (Nano Banana Pro) — único default da Murupi.
**Modelo padrão texto:** `gemini-2.5-flash` pra validação/calls rápidos; `gemini-3-pro` quando precisar raciocínio pesado.
**Atenção Windows:** usar `Invoke-RestMethod`, não `curl.exe` (que mangulia aspas duplas do JSON). Ver memória `gemini-api` pro padrão de chamada.

### Google Workspace CLI — Drive/Gmail/Calendar/Docs/Sheets/Slides
**Quando usar:** ler/escrever no Workspace da agência via terminal. Instalado e autenticado em `contato@agenciamurupi.com`.
**Comando base:** `gws auth status` / `gws drive files list` / `gws --help`. Ver memória `gws-cli`.

---

## Como adicionar novos MCPs aqui
Sempre que avaliar um MCP novo, adicionar nesse arquivo no formato:

```
### Nome do MCP — descrição curta
**Quando ativar:** [...]
**Pré-requisito:** [...]
**Ativar:** comando de install
**Desativar:** comando de remove
```

Assim a configuração fica num lugar só, fácil de ativar e desativar.
