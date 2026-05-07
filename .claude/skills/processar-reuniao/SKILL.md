---
name: processar-reuniao
description: >
  Pega a transcrição de uma reunião de briefing com cliente novo (gravada e
  transcrita previamente em outra ferramenta) e organiza o conteúdo no
  template de briefing.md do cliente. Identifica campos preenchidos vs
  campos em aberto e pergunta o que faltou.
  Use quando a Jaquelinne disser "processa essa reunião do [cliente]",
  "transforma essa transcrição em briefing", "tenho a transcrição da reunião
  de briefing da [cliente]", "monta briefing a partir dessa reunião".
---

# /processar-reuniao — Transcrição de Reunião → Briefing Organizado

## Contexto e dependências

- **Template de briefing:** `clientes/_modelo-cliente/briefing.md`
- **Briefing do cliente:** `clientes/[cliente]/briefing.md` (alvo de update)
- **Tom de voz:** `_contexto/preferencias.md`

Faz parte do **Macro 2 (onboarding de cliente novo)**. Roda **depois** da reunião de briefing acontecer e da transcrição estar pronta. Sub-skill comum da `/onboarding-cliente`.

---

## Workflow

### Passo 1 — Cliente e fonte da transcrição

Perguntar:

> "Reunião de qual cliente? E como tu tem a transcrição?
>
> 1. **Cola aqui** — colar o texto direto no chat
> 2. **Arquivo** — joga em `dados/` ou `clientes/[cliente]/pesquisa/` e me passa o caminho
> 3. **Não tenho ainda** — me passa o áudio/vídeo (joga em `dados/`) e te passo as opções de transcrição"

### Passo 2 — Se não tem transcrição, oferecer caminhos

Se ela escolher opção 3:

> "Pra transcrever, três caminhos:
>
> **(a) Mais rápido:** transcreve em outra ferramenta — Otter.ai, Granola, Riverside, Zoom/Meet têm transcript nativo, ou ChatGPT Pro com upload de áudio. Cola aqui depois.
>
> **(b) Local gratuito:** instalo whisper.cpp aqui (demora 1-2 min de setup, transcrição é mais lenta). Privado, roda offline.
>
> **(c) API paga:** OpenAI Whisper API (~R$0.03/min, super rápido) — precisa salvar `OPENAI_API_KEY` no `.env`. Ou AssemblyAI (free tier generoso, free pra reuniões curtas).
>
> Qual?"

**Em auto mode, default = (a)** — recomendar e parar até a transcrição chegar.

Se ela escolher (b) ou (c), executar setup conforme catálogo `templates/ferramentas/catalogo.md` e anotar a configuração em `_contexto/mcps.md` (caminho da skill, env vars usadas).

### Passo 3 — Carregar contexto

1. Ler `clientes/_modelo-cliente/briefing.md` pra ter o template em memória
2. Ler `clientes/[cliente]/briefing.md` pra saber o que já tá preenchido (não sobrescrever info anterior sem aviso)

### Passo 4 — Processar a transcrição

Ler a transcrição inteira (independente do tamanho). Mapear conteúdo nos campos do briefing:

**Sobre o cliente** → Empresa, Setor/nicho, Site, Instagram, Tamanho da operação, Tipo (B2B)
**Produto / serviço** → O que vende, Ticket médio, Margem, Diferencial real
**Cliente do cliente** → Quem compra, Dor principal, Nível de consciência, Sofisticação do mercado, Onde está hoje
**Histórico de mídia** → Já rodou tráfego pago, Plataformas, Investimento mensal, Resultados anteriores, O que funcionou
**Tracking** → GA4, GTM, Server-side, Pixel, Eventos críticos
**Objetivo da Murupi pra esse cliente** → Resultado em 30/60/90 dias, KPIs principais
**Pacote contratado e calendário** → Volume mensal de posts, Frequência preferida, Datas comemorativas do nicho
**Restrições e observações** → Concorrentes que NÃO podem aparecer, Tom/posicionamento exigido, Aprovações

**Regras de extração:**
- **Não inventar.** Se a transcrição não menciona X, deixar X em branco (será listado depois pra Jaquelinne preencher manualmente)
- **Citação literal quando possível.** Pra "Dor principal", se o cliente disse uma frase forte, usar ela mesma entre aspas em vez de parafrasear
- **Inferência marcada.** Quando inferir algo (ex: público é "classe média alta" mas o cliente não disse explicitamente), marcar com `[inferido]` pra revisão
- **Campos com info parcial:** preencher o que dá e marcar `[completar]` se faltar detalhe importante

### Passo 5 — Atualizar briefing do cliente

Editar `clientes/[cliente]/briefing.md` com o conteúdo extraído. Manter a estrutura do template intacta. Se um campo já tinha info E a transcrição traz info nova/diferente, **NÃO sobrescrever silenciosamente** — anotar conflito pra Jaquelinne resolver:

```
**Dor principal:** [info nova da transcrição]
> ⚠️ Conflito: havia "[info antiga]" salvo. Confirmar qual fica.
```

### Passo 6 — Reportar e listar lacunas

Mostrar:

> "Briefing da [Cliente] atualizado em `clientes/[cliente]/briefing.md`.
>
> **Resumo do que veio da reunião:**
> [3-5 bullets com os achados mais importantes]
>
> **Campos preenchidos da transcrição:** [lista]
>
> **Campos que ficaram em branco** (a transcrição não cobriu):
> - [campo 1]
> - [campo 2]
> - ...
>
> **Inferências marcadas como `[inferido]`** (revisar):
> - [campo X]: [valor inferido]
> - ...
>
> **Conflitos** (info nova ≠ info antiga):
> - [se houver]
>
> Quer preencher os campos em branco agora ou deixa pra revisar manualmente depois?
>
> Próximo passo do onboarding: rodar `/deep-research-cliente` pra montar pesquisa de mercado + concorrentes + situação atual em cima desse briefing."

---

## Regras

- **Não inventar.** "Em branco" é resposta válida quando a transcrição não cobriu
- **Citação literal preferida** sobre paráfrase quando o cliente fala algo significativo
- **Inferências sempre marcadas** com `[inferido]` pra Jaquelinne revisar
- **Não sobrescrever info anterior silenciosamente** — sinalizar conflito
- **Independente do tamanho da transcrição**, processar inteiro (reuniões de briefing geralmente passam de 30 min)
- **Tom da extração é literal/técnico** — não embelezar o que o cliente disse com tom Murupi. O briefing reflete o cliente, não a Murupi
- **Se a transcrição vier com timestamps**, ignorar (manter só o conteúdo)
- **Áudios de baixa qualidade** podem gerar transcrição com erros — apontar palavras que parecem suspeitas pra Jaquelinne checar contra a gravação original
