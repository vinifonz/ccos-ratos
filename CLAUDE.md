# Agência Murupi — Claude Code OS

## O que é esse workspace
Workspace de operações da Agência Murupi. Aqui ficam clientes (B2B), conteúdo orgânico da Murupi, briefings, propostas, análises e o terreno do próximo infoproduto da Jaquelinne.

**Estrutura de pastas:**
- `_contexto/` — memória do sistema (não apagar)
- `clientes/` — uma subpasta por cliente. **Toda pasta de cliente tem um `CLAUDE.md` próprio** (contexto específico da cliente que se soma ao raiz). Conteúdo padrão: `briefing.md`, `proposta.html`, `campanhas/`, `copy/`, `relatorios/`, `dados/`. Subpastas extras são abertas sob demanda.
- `briefings/` — drop zone de briefings novos antes de virarem cliente fechado
- `propostas/` — propostas em andamento e enviadas (também ficam por cliente quando fechado)
- `conteudo/` — produção orgânica da Murupi (`carrosseis/`, `roteiros/`, `posts/`)
- `infoproduto/` — terreno do próximo lançamento (`pesquisa/`, `estrutura/`, `copy/`)
- `dados/` — drop zone temporário pra análise pontual ou dados que **não pertencem a um cliente específico** (Murupi orgânico, infoproduto, pesquisa de mercado). Dados de cliente vão direto pra `clientes/[cliente]/dados/`.
- `marca/` — identidade visual (paleta, logos, design-guide)
- `templates/` — templates do kit Ratos (não editar manualmente)
- `tarefas.md` — to-do corrente

## Sobre o negócio
Agência de marketing digital focada em **tráfego pago e consultoria estratégica** pra pequenos e médios negócios B2B. A régua é dado, não percepção. Atende empresas e profissionais autônomos que vendem serviços ou produtos. **Não atende B2C.**

## O que mais fazemos aqui
- Campanhas de tráfego pago (Meta Ads principalmente, Google Ads em expansão)
- Estratégia de posicionamento
- Copy (ads, landing pages, redes sociais, roteiros)
- Estruturação de funis e ofertas com base em neuromarketing
- Análise de dados e otimização contínua
- Conteúdo orgânico pra Instagram e vídeos curtos da Murupi

## Clientes e contexto
B2B — empresas e profissionais autônomos. Pequena equipe interna (social media, designer, editor de vídeo). Jaquelinne fica na estratégia, copy e direção criativa.

## Tom de voz
Humano, direto, conversado. Autoridade sem arrogância. Didático sem ser professoral. Texto deve soar como conversa real, não como peça publicitária. Consistência, clareza e intenção por trás de cada palavra.

**Evitar sempre:**
- Clichês ("não é sobre isso, é sobre aquilo", "mergulhe de cabeça")
- Travessão `—`
- Estrutura quebrada / frase a frase artificial
- Texto com cara de IA, genérico ou replicável
- Tom excessivamente vendedor quando o objetivo é conexão
- Excesso de explicação óbvia ou didatismo demais
- Exageros emocionais genéricos

## Ferramentas conectadas
- **Meta Ads** — skill global `/meta-ads-ratos`
- **Google Ads** — skill global `/google-ads-ratos`
- **Google Analytics 4** — skill global `/ga4-ratos`
- **Google Workspace** — CLI `gws` (`@googleworkspace/cli`) autenticada em `contato@agenciamurupi.com`; cobre Drive, Gmail, Calendar, Docs, Sheets, Slides, Tasks. Credenciais cifradas em `~/.config/gws/`. Ver memória `gws-cli` pra detalhes.
- **Gemini API** — chave em `.env.local` como `GEMINI_API_KEY` (vinculada ao project GCP `murupi-gws`). Padrão Murupi: **Nano Banana Pro** (`gemini-3-pro-image-preview`) pra qualquer imagem; Gemini 2.5/3 pra texto. **Workflow:** geração nova fica no GUI do AI Studio; só edição via JSON usa API direto (eventualmente). Ver memórias `gemini-api` e `imagem-workflow-split`.
- **VS Code** — ambiente técnico pra GTM e tracking server-side via Stape
- **Instagram** — publicação manual por enquanto (Post for Me deferido em `tarefas.md`)

MCPs configurados pra ativar sob demanda: ver `_contexto/mcps.md`.

---

## Filosofia: API antes de MCP

Sempre que possível, **usar APIs e endpoints diretos em vez de MCPs** pra economizar tokens. MCPs ficam **desativados por padrão**. Só ativar um MCP quando a tarefa em curso realmente exigir, e **desativar de novo ao terminar**.

Comandos de ativar/desativar prontos em `_contexto/mcps.md`.

---

## Custo e gasto — sempre avisar antes

Toda ação que **gasta dinheiro real** (chamada de API paga em volume, ativação de billing, upgrade de plano, geração de imagem por API, etc.) precisa de **aviso explícito antes de rodar**. Mostrar o custo estimado e esperar confirmação. Jaquelinne controla orçamento apertado e quer cada gasto como decisão consciente.

**Preferência permanente:** quando existir alternativa flat-rate (GUI de assinatura já paga: AI Studio free tier, ChatGPT Plus, Gemini Advanced), **priorizar a GUI** em vez de chamada de API paga por uso. Só usar API paga quando o ganho em automação compensar (ex.: edits cirúrgicos com versionamento automático, em volume baixo).

**O que NÃO precisa de aviso:** APIs já configuradas e baratas (Gemini text < R$0,01/call), comandos read-only (gws, ga4, etc.), ações dentro do GUI de uma assinatura que já existe.

Ver memória `cost-vigilance` pra detalhes.

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos:

1. `_contexto/empresa.md` — quem é Jaquelinne, o que a Murupi faz, como funciona o negócio
2. `_contexto/preferencias.md` — tom de voz, estilo, o que evitar
3. `_contexto/estrategia.md` — foco atual, prioridades

Pra qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar `marca/design-guide.md` antes.

Não listar o que foi lido — apenas usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/skills/`, `.claude/commands/` ou no `~/.claude/skills/` global (onde estão `/meta-ads-ratos`, `/google-ads-ratos`, `/ga4-ratos`).
Se encontrar, seguir as instruções da skill.
Se não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível, perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais.

---

## Aprender com correções

Quando a Jaquelinne corrigir algo, melhorar uma resposta ou dar uma instrução que parece permanente ("na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar o destino:
- **Sobre o negócio** (clientes, serviços, mercado, equipe) → `_contexto/empresa.md`
- **Sobre preferências e estilo** (tom, formato, o que evitar) → `_contexto/preferencias.md`
- **Sobre prioridades e foco** (projetos, metas, prazos) → `_contexto/estrategia.md`
- **Regra de comportamento** (onde salvar, como nomear, fluxos) → este `CLAUDE.md`
- **Mudança visual** (cores, fontes, logo) → `marca/design-guide.md`

Salvar com uma linha nova clara, sem reformatar o arquivo. Confirmar mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato. Só quando tiver valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante (novo cliente, nova skill, mudança de foco, novo processo, ferramenta instalada, estrutura alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize os arquivos de memória?"

Se sim, identificar o destino certo (mesma lista acima) e mostrar o que vai mudar antes de salvar.

**Quando NÃO perguntar:** tarefas pontuais sem mudança de contexto, perguntas simples, mudanças já capturadas pela seção "Aprender com correções".

**Dica:** rodar `/atualizar` faz uma varredura completa.

---

## Criação de skills

Quando a Jaquelinne pedir pra criar uma skill nova:

1. Verificar se existe um template em `templates/skills/`. Se existir, usar como base.
2. Perguntar: "Essa skill é específica desse projeto ou vai ser útil em qualquer projeto?"
   - Específica → `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Genérica → `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_contexto/empresa.md` e `_contexto/preferencias.md` pra calibrar o conteúdo.
4. Se a skill precisar de arquivos de apoio (templates, exemplos), criar dentro da pasta da skill.
5. Seguir o fluxo da skill-creator nativa.
