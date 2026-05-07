---
name: deep-research-cliente
description: >
  Executa pesquisa profunda pra um cliente novo da Murupi — pesquisa de mercado
  do nicho, análise de concorrentes diretos e análise da situação atual do
  cliente (presença digital, posicionamento atual, gaps). Output usado como
  base pra montar o posicionamento estratégico do cliente.
  Modo iterativo — entrega seção por seção (mercado → concorrente → situação)
  e pede aprovação antes de avançar pra próxima.
  Use quando a Jaquelinne disser "deep research da [cliente]", "pesquisa de
  mercado pra [cliente]", "analisa os concorrentes da [cliente]", "estuda o
  mercado da [cliente]", "vamos pesquisar o nicho da [cliente]".
---

# /deep-research-cliente — Deep Research de Cliente Novo

## Contexto e dependências

- **Briefing do cliente:** `clientes/[cliente]/briefing.md` — base do que pesquisar (nicho, produto, público)
- **Tom de voz:** `_contexto/preferencias.md`
- **Pasta de saída:** `clientes/[cliente]/pesquisa/`

Faz parte do **Macro 2 (onboarding de cliente novo)**. Geralmente chamada após `/processar-reuniao` (que preenche o briefing.md a partir da reunião gravada). Output dessa skill alimenta a construção do posicionamento (deferida pra fluxo posterior).

---

## Workflow

### Passo 0 — Cliente e checagem de briefing

Perguntar (se não veio no comando):

> "Deep research pra qual cliente?"

Validar `clientes/[cliente]/` existe. Ler `briefing.md`.

**Campos críticos pra pesquisa:**
- Setor / nicho
- O que vende (produto/serviço)
- Cliente do cliente (quem compra)
- Site, Instagram

Se algum estiver vazio, perguntar antes de prosseguir:

> "Pra fazer pesquisa decente preciso desses pontos do briefing que ainda tão vazios: [lista]. Posso preencher na hora ou paramos aqui pra rodar `/processar-reuniao` primeiro?"

### Passo 1 — Concorrentes (lista de input)

Perguntar:

> "Quem são os concorrentes diretos? Tu já sabe ou quer que eu descubra?
>
> 1. **Eu te passo a lista** — manda 3-5 nomes/sites/perfis
> 2. **Descobre tu** — eu busco via WebSearch a partir do nicho do briefing
> 3. **Misto** — tu manda alguns + eu completo"

Salvar lista de concorrentes pra usar na seção de análise.

### Passo 2 — Modo iterativo (3 seções)

A skill faz **uma seção por vez**, mostra pra Jaquelinne, espera aprovação, salva, avança. Permite ela cortar ("essa parte tá OK, pula"), aprofundar ("vai mais fundo nisso"), ou pular seção inteira.

#### Seção A — Pesquisa de mercado

Buscar com WebSearch + WebFetch + Jina Reader (fallback pra artigos longos):

- **Tamanho do mercado** (BR e/ou regional, conforme alcance do cliente)
- **Crescimento e tendências** (últimos 2-3 anos)
- **Comportamento do consumidor** do nicho (dores, decisão de compra, jornada)
- **Sazonalidade** (quando vende mais, quando vende menos)
- **Plataformas/canais dominantes** (onde o público desse nicho consome conteúdo)
- **Mudanças recentes/regulatórias** (se relevante — ex: corretora tem CRECI, biomédica tem CRBM)

**Regras de pesquisa:**
- Sempre citar fonte + ano (Statista 2024, Sebrae 2025, IBGE 2023, etc.)
- Se não achar dado verificável, **dizer "dado não encontrado"** em vez de inventar número
- Pra Instagram de concorrente: WebFetch não funciona. Pedir pra Jaquelinne mandar print/resumo OU listar @s pra ela mesma checar
- Pra YouTube: se ela quiser análise de canal, ativar `/yt-transcript` ou `/transcribe` pra puxar conteúdo

Apresentar a seção em rascunho, perguntar:

> "Seção 'Pesquisa de Mercado' pronta. Aprovar e seguir pra concorrentes? Ajustar algo? Aprofundar algum ponto?"

Após aprovação, salvar parcial e ir pra próxima.

#### Seção B — Análise de concorrentes

Pra cada concorrente da lista do Passo 1:

- **O que oferece** (serviço/produto, escopo, ticket se descobrível)
- **Posicionamento aparente** (o que ele defende, big idea)
- **Comunicação digital** (site, Instagram — *avisar limitação se for IG*)
- **Diferenciais declarados** (o que ele diz que é único)
- **Gaps observados** (o que ele NÃO faz, NÃO comunica, NÃO atende)

Ferramentas:
- WebFetch (site)
- Jina Reader (artigos sobre)
- WebSearch (notícias, reviews, reclame aqui)

**Síntese cruzada:** após analisar todos, identificar:
- **Saturação:** o que TODOS dizem (terreno saturado, não diferencia)
- **Vácuos:** o que NINGUÉM diz/faz (oportunidades de posicionamento)
- **Padrões de tom:** todo mundo é formal? técnico? emocional?

Apresentar e perguntar:

> "Análise de concorrentes pronta. Aprovar e seguir pra situação atual da [Cliente]? Quer aprofundar algum concorrente?"

#### Seção C — Situação atual do cliente

Analisar o cliente em si:

- **Presença digital atual** — site (se existir, fazer WebFetch), Instagram (avisar limitação, pedir contexto), outras redes
- **Posicionamento que comunica hoje** — o que ele tá dizendo nas peças/posts que mostrou no briefing ou que tu vê no perfil dele
- **O que faz bem** — pontos fortes da operação atual
- **Gaps** — o que ele NÃO comunica, NÃO faz, NÃO oferece (cruzar com vácuos da Seção B)
- **SWOT light** — Forças, Fraquezas, Oportunidades (do mercado/vácuos), Ameaças (concorrência forte/regulação)
- **Recomendações iniciais de direção** — sem definir o posicionamento ainda (isso é fluxo posterior), mas apontar 2-3 direções estratégicas que o deep research sugere

Apresentar:

> "Análise de situação atual da [Cliente] pronta. Esse é o material base pra construir o posicionamento.
>
> Aprovar e fechar a pesquisa? Ou quer aprofundar algo?"

### Passo 3 — Output final consolidado

Salvar em `clientes/[cliente]/pesquisa/deep-research-[YYYY-MM-DD].md`. Estrutura:

```markdown
# Deep Research — [Cliente]
*Pesquisa em [DD/MM/YYYY] | Setor: [nicho] | Próximo passo: construção do posicionamento*

## Resumo executivo
[3-5 bullets com os achados mais críticos pra direção estratégica]

---

## 1. Pesquisa de mercado
[Conteúdo da Seção A com fontes citadas]

## 2. Análise de concorrentes
[Conteúdo da Seção B — um bloco por concorrente + síntese cruzada (saturação, vácuos, padrões)]

## 3. Situação atual da [Cliente]
[Conteúdo da Seção C — presença digital, posicionamento atual, SWOT light, direções iniciais]

---

## Inputs pra próxima fase (construção do posicionamento)
[2-3 direções estratégicas que a pesquisa sugere — pra alimentar o fluxo de posicionamento posterior]

## Limitações desta pesquisa
[O que NÃO deu pra cobrir — ex: "Instagram dos concorrentes não foi acessado direto, baseado em prints fornecidos pela Jaquelinne", "dados de mercado regional não encontrados, usado nacional"]
```

Mostrar resumo executivo no chat (não o documento inteiro — fica longo) e oferecer:

> "Deep research salvo em `[caminho]`. Resumo executivo:
>
> [resumo]
>
> Próximo passo do onboarding seria construção do posicionamento (deferido). Quer rodar `/onboarding-cliente` pra ver o que falta no Macro 2 ou parar aqui?"

---

## Regras

- **Tom direto, técnico** — segue `_contexto/preferencias.md`. Pesquisa é trabalho de analista, não de copy
- **Sempre citar fonte** (nome + ano). Sem fonte = não escrever
- **Não inventar dado** — "dado não encontrado" é melhor que número falso
- **Avisar limitações honestamente** — Instagram WebFetch não funciona; mercados muito locais podem não ter dados; ferramentas pagas (DataForSEO) não estão ativas por padrão
- **Modo iterativo** é mandatório — pesquisa longa cega no escuro vira lixo. Mostrar e validar entre seções
- **Concorrente desconhecido pela Jaquelinne** é OK — usar WebSearch pra descobrir os top players do nicho na região do cliente
- **Pra clientes B2B com nicho regional** (ex: corretora em cidade específica), focar a pesquisa de mercado **na região** quando possível (Sebrae estadual, sindicato local, dados municipais)
- **Cruzar sempre o output da Seção B (vácuos)** com a Seção C (gaps do cliente) — a interseção é onde o posicionamento futuro vai morar
- **NÃO definir posicionamento aqui** — pesquisa é insumo. Posicionamento é decisão estratégica feita depois, em fluxo separado (deferido por agora)
