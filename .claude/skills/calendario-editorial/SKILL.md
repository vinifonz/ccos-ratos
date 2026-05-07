---
name: calendario-editorial
description: >
  Gera calendário editorial mensal pra social media de um cliente da Murupi.
  Modo híbrido: pergunta se a Jaquelinne quer sugestões geradas (a partir de
  briefing, posicionamento, datas comemorativas do mês e do nicho) ou se ela
  já tem as ideias e só quer formatar.
  Use quando ela disser "monta calendário pra [cliente]", "calendário do mês",
  "calendário editorial pra [cliente]", "sugestões de pauta pra social".
  NÃO usar pra briefing de uma peça única (usar `/briefing-peca`).
---

# /calendario-editorial — Calendário Editorial Mensal

## Contexto e dependências

- **Briefing do cliente:** `clientes/[cliente]/briefing.md` — campos críticos: **Volume mensal de posts**, **Datas comemorativas relevantes do nicho**, posicionamento, dor, público
- **Histórico de posts:** `clientes/[cliente]/conteudo/`, `clientes/[cliente]/briefings-peca/` — pra não repetir tema dos últimos 60 dias
- **Tom de voz:** `_contexto/preferencias.md`

A skill cobre o caso da social media (Murupi tem social media interna autônoma — recebe sugestão de calendário e ela mesma faz os briefings detalhados pro designer/editor/copywriter). Pra peça única, usar `/briefing-peca`.

---

## Workflow

### Passo 1 — Cliente e mês

Perguntar (se não veio no comando inicial):

> "Calendário pra qual cliente e qual mês? (ex: Lara Garcia / junho 2026)"

Validar que `clientes/[cliente-slug]/` existe. Se não:

> "Não achei `clientes/[cliente-slug]/`. É cliente novo (cria agora) ou tá com slug diferente?"

### Passo 2 — Ler briefing do cliente

Ler `clientes/[cliente]/briefing.md`. Verificar dois campos críticos:

1. **Volume mensal de posts** (na seção "Pacote contratado e calendário")
2. **Datas comemorativas relevantes do nicho** (mesma seção)

**Se algum dos dois estiver em branco ou em placeholder:**

> "Antes de montar o calendário, preciso de duas infos do briefing da [Cliente] que ainda não estão preenchidas:
>
> 1. **Volume mensal de posts** — quantos posts/carrosseis/vídeos/stories por mês esse cliente contratou? (ex: '8 carrosseis + 4 vídeos + 12 stories')
> 2. **Datas comemorativas do nicho** — quais datas fazem sentido pra esse nicho específico? (ex: corretora → Dia do Corretor 24/08, Dia da Família 15/05. Personal/biomédica → Dia da Saúde 7/04, Dia do Educador Físico 1/9)
>
> Me responde e eu salvo no briefing pra próxima vez não precisar perguntar."

Após receber as respostas, **atualizar o briefing do cliente** preenchendo os campos correspondentes (sem reformatar o resto do arquivo).

### Passo 3 — Modo de operação (híbrido)

Perguntar:

> "Tu já tem ideias dos temas pra esse mês ou quer que eu sugira a partir do briefing + datas + posicionamento da [Cliente]?
>
> 1. **Eu já tenho** — tu manda os temas em texto solto e eu organizo no formato
> 2. **Sugere pra mim** — eu proponho a partir do contexto, tu revisa e aprova
> 3. **Misto** — tu manda algumas ideias e eu completo o resto até bater o volume"

### Passo 4 — Carregar contexto pra sugestão (modos 2 e 3)

Carregar:
- **Briefing do cliente** completo (posicionamento, dor, público, diferencial, ticket)
- **Datas comemorativas genéricas** do mês (ver tabela abaixo)
- **Datas comemorativas do nicho** (do briefing do cliente)
- **Posts dos últimos 60 dias** — listar arquivos em `clientes/[cliente]/conteudo/` e `clientes/[cliente]/briefings-peca/` ordenados por data, ler temas pra não repetir
- **Pra datas móveis** (Páscoa, Carnaval, Dia das Mães, Dia dos Pais, Black Friday): calcular a data exata do ano em vez de assumir

Propor pautas considerando:
- **Volume contratado** (não passar do que tá no pacote)
- **Mix de tipos:** carrossel pra autoridade/educacional, vídeo curto pra alcance/conexão, story pra rotina/bastidor
- **Datas relevantes do mês** (genéricas + nicho), com antecedência adequada (pautas emocionais tipo Dia das Mães precisam de 2 semanas de produção; bastidor pode ser último minuto)
- **Pontos de dor e posicionamento** do briefing
- **Conteúdo evergreen** do nicho (educativo, mitos, como escolher, etc)
- **Não repetir tema** dos últimos 60 dias

Apresentar a lista de propostas em **rascunho** pra ela revisar antes de gerar o output final:

> "Antes de salvar, dá uma olhada nas propostas:
>
> [lista enumerada das pautas, formato curto: "Post 1 — Carrossel — [tema] — [ângulo]"]
>
> Aprova tudo, ajusta algumas, troca algumas? Pode falar 'ok', ou 'troca a 3 por X', ou 'tira a 5'."

### Passo 5 — Modo "Eu já tenho" (4B alternativo)

> "Manda os temas que tu tem. Pode ser texto solto, lista numerada, do jeito que vier. Eu encaixo no formato."

Receber, organizar, gerar output.

### Passo 6 — Output (lista cronológica simples, sem data fixa)

Salvar em `clientes/[cliente]/calendarios/[YYYY-MM]-calendario.md`. Formato:

```markdown
# Calendário editorial — [Cliente] — [Mês de YYYY]

**Volume contratado:** [resumo do pacote, ex: "8 carrosseis + 4 vídeos + 12 stories"]
**Datas relevantes do mês:**
- [DD/MM — Nome (genérica ou nicho)]
- ...

---

## Pautas

### Post 1 — [Tipo: carrossel / post / story / reels / vídeo longo]
**Tema:** [tema em uma frase]
**Ângulo:** [opinião/posição que a peça defende — não descritivo]
**Detalhes:** [marcações @, pasta de fotos sugerida, sugestão de copy curta, qualquer coisa relevante pra social media trabalhar]

### Post 2 — [Tipo]
**Tema:** ...
**Ângulo:** ...
**Detalhes:** ...

[... até atingir o volume contratado]

---

## Datas pra ficar de olho no próximo mês
[Lista das datas relevantes do mês seguinte que precisam de antecedência. Ex: "Dia dos Pais — 2º domingo de agosto. Pauta emocional, começar a produção até dia 25/07"]
```

### Passo 7 — Mensagem final

> "Calendário salvo em `[caminho]`.
>
> Cola isso pra Social Media:
>
> ---
> [calendário inteiro]
> ---
>
> Quer ajustar algo no calendário, ou tá fechado? Quando uma pauta dessas virar peça concreta, é só rodar `/briefing-peca` que eu monto o briefing pro designer/editor."

---

## Datas comemorativas genéricas (todos os clientes)

Datas que valem pra qualquer nicho — sempre considerar quando montar o calendário:

| Mês | Data | Nome | Tipo |
|---|---|---|---|
| Janeiro | 1 | Ano Novo | Fixa |
| Fevereiro | móvel | Carnaval | Móvel |
| Março | 8 | Dia Internacional da Mulher | Fixa |
| Março | 15 | Dia do Consumidor | Fixa |
| Abril | móvel | Páscoa | Móvel |
| Abril | 21 | Tiradentes | Fixa |
| Maio | 1 | Dia do Trabalho | Fixa |
| Maio | 2º dom | Dia das Mães | Móvel |
| Junho | 12 | Dia dos Namorados | Fixa |
| Junho | mês | Festas Juninas | Período |
| Junho | 24 | São João | Fixa |
| Julho | 20 | Dia do Amigo | Fixa |
| Agosto | 2º dom | Dia dos Pais | Móvel |
| Setembro | 7 | Independência | Fixa |
| Setembro | **15** | **Dia do Cliente** | Fixa |
| Setembro | 23 | Primavera | Fixa |
| Outubro | 12 | Dia das Crianças | Fixa |
| Outubro | 31 | Halloween | Fixa |
| Novembro | 4ª sex | Black Friday | Móvel |
| Novembro | 20 | Consciência Negra | Fixa |
| Dezembro | 25 | Natal | Fixa |
| Dezembro | 31 | Réveillon | Fixa |

**Datas específicas do nicho do cliente** vivem no briefing dele (`clientes/[cliente]/briefing.md`, campo "Datas comemorativas relevantes do nicho").

**Pra datas móveis no ano corrente, calcular antes de montar o calendário** (não assumir a do ano passado):
- **Páscoa:** primeiro domingo após a primeira lua cheia depois do equinócio de outono no hemisfério norte (varia março–abril)
- **Carnaval:** terça-feira que antecede a Quarta de Cinzas (47 dias antes da Páscoa)
- **Dia das Mães:** segundo domingo de maio
- **Dia dos Pais:** segundo domingo de agosto
- **Black Friday:** quarta sexta-feira de novembro

---

## Regras

- Tom direto — segue `_contexto/preferencias.md` (sem clichê, sem cara de IA, sem travessão)
- **Volume sempre conforme o pacote contratado do cliente** — não sugerir 12 posts se ele contratou 8. Se ela pedir mais do que o pacote, perguntar antes
- **Não repetir tema dos últimos 60 dias** (verificar histórico)
- Se a Jaquelinne pedir "calendário pra Murupi", usar `clientes/murupi/briefing.md` (cria se não existir, perguntando volume + datas)
- Pra datas móveis, calcular a data exata do ano corrente
- Calendário fica enxuto — cada post 3-5 linhas no máximo. Detalhes finos da peça vão depois pelo `/briefing-peca` quando a peça for produzida
- Output mostrado **inteiro no chat** pra cópia rápida pra social media
- **Sempre atualizar o briefing do cliente** se a Jaquelinne preencher Volume ou Datas do nicho durante o fluxo (pra não perguntar de novo)
- Pautas precisam ter **ângulo**, não descrição. "Por que comprar imóvel agora apesar do juros" funciona; "5 dicas pra comprar imóvel" não
