---
name: revisar-copy
description: >
  Revisa copy entregue pela copywriter da equipe Murupi antes da Jaquelinne
  aprovar e mandar pra frente. Modo híbrido — pergunta no início se é "só review"
  (devolve análise pra educar a copywriter) ou "review + reescrita" (devolve
  versão ajustada pronta pra usar). Cruza a copy com briefing do cliente,
  preferências de tom da Murupi e nível de consciência do público.
  Use quando a Jaquelinne disser "revisa essa copy", "review dessa copy",
  "olha essa copy que a copywriter mandou", "essa copy tá boa?",
  "tá no tom?", "preciso aprovar essa copy".
  NÃO usar pra revisar peça pronta de design/vídeo (usar `/revisar-peca`).
---

# /revisar-copy — Review de Copy da Copywriter

## Contexto e dependências

- **Regras de tom Murupi:** `_contexto/preferencias.md` (sem clichê, sem travessão, sem cara de IA, sem tom vendedor forçado)
- **Briefing do cliente:** `clientes/[cliente]/briefing.md` — posicionamento, dor do público, nível de consciência (Schwartz), sofisticação do mercado, tom exigido pelo cliente
- **Copies anteriores aprovadas:** `clientes/[cliente]/copy/` — referência de tom já validada pra esse cliente (pra calibrar o review e não brigar com decisões já tomadas)
- **Pasta de saída:** `clientes/[cliente]/copy/`

A skill é o caminho **contrário** da `/briefing-peca`. Briefing-peca **sai** pra equipe com copy pronta dentro. Revisar-copy é quando a **copywriter entrega** copy e a Jaquelinne precisa revisar antes de aprovar.

---

## Workflow

### Passo 1 — Contexto da copy

Coletar (em uma única mensagem, aceitando resposta livre):

> "Pra eu revisar com critério, me passa:
>
> 1. **Cliente** — pra qual cliente é essa copy? (se for da Murupi, fala 'Murupi')
> 2. **Tipo de peça** — ad Meta? landing page? carrossel? email? post orgânico? roteiro de vídeo?
> 3. **A copy** — cola aqui (ou me passa o caminho do arquivo)
> 4. **Briefing original que a copywriter recebeu** (opcional) — se tiver, ajuda a checar se ela entregou o que foi pedido. Pode mandar o link do card, colar o briefing, ou só dizer 'sem briefing, foi conversa solta'
>
> Pode mandar tudo junto."

### Passo 2 — Modo de operação (híbrido)

Após receber a copy, perguntar:

> "Modo do review:
>
> 1. **Só review** — devolvo análise + sugestões. Tu decide o que fazer (bom pra educar a copywriter, dar feedback construtivo)
> 2. **Review + reescrita** — devolvo a versão ajustada pronta pra aprovar. Mais rápido pra fechar
>
> Qual?"

Se ela já indicou no comando ("revisa e me dá a versão final"), pular essa pergunta.

### Passo 3 — Carregar contexto

Ler nesta ordem:
1. `_contexto/preferencias.md` — regras de tom da Murupi (proibições)
2. `clientes/[cliente]/briefing.md` — posicionamento, dor do público, nível de consciência (Schwartz), sofisticação do mercado, tom do cliente, restrições, concorrentes que NÃO podem aparecer
3. Listar `clientes/[cliente]/copy/` (últimos 3-5 arquivos) e ler 1-2 copies aprovadas anteriores pra calibrar tom já validado pra esse cliente

Se o briefing do cliente estiver vazio em campos críticos (posicionamento, público, nível de consciência), avisar:

> "O briefing da [Cliente] tá com [campo] vazio. Vou revisar com base no que tenho, mas o review fica mais afiado se tu preencher esse campo. Posso seguir mesmo assim?"

### Passo 4 — Análise da copy

Avaliar a copy em **6 dimensões**:

#### 1. Aderência ao briefing
A copy entregou o que o briefing pediu? Tema, ângulo, tipo de peça, formato — tudo bate?

#### 2. Tom Murupi (regras universais)
Cruzar com `_contexto/preferencias.md`. Marcar tudo que viola:
- **Travessão `—`** (proibido — apontar e sugerir substituição)
- **Clichês de copy:** "não é sobre isso, é sobre aquilo", "mergulhe de cabeça", "no fim das contas", "a pergunta que fica", "em um mundo onde", "cada vez mais", "simplesmente", "basicamente", "é preciso", "vai muito além de"
- **Estrutura quebrada / frase a frase artificial** (parágrafos que viraram listas disfarçadas)
- **Cara de IA:** texto genérico, replicável, óbvio. Se trocar o tema por outro qualquer e funcionar igual, é genérico
- **Tom vendedor forçado** quando o objetivo é conexão
- **Excesso de explicação óbvia** ou didatismo demais
- **Exageros emocionais genéricos**
- **Estruturas binárias batidas:** "X diminui, Y acelera"
- **Aberturas genéricas:** "hoje vamos falar sobre", "muitas pessoas perguntam"

#### 3. Tom do cliente
Bate com o tom **exigido pelo cliente** (do briefing dele)? Cliente formal não pode receber copy gírica e vice-versa.

#### 4. Nível de consciência do público (Schwartz)
A copy está calibrada pro nível certo? Se o público é **inconsciente do problema**, não pode abrir falando da solução. Se o público é **consciente do produto**, não pode perder tempo educando.

Níveis (referência rápida):
1. **Inconsciente** — ainda não sabe que tem o problema. Abrir provocando reconhecimento.
2. **Consciente do problema** — sente a dor, não sabe que existe solução. Abrir nomeando a dor.
3. **Consciente da solução** — sabe que existem soluções, não conhece a sua. Abrir mostrando categoria.
4. **Consciente do produto** — conhece o produto, está comparando. Abrir com diferencial específico.
5. **Mais consciente** — pronto pra comprar, só falta o gatilho. Abrir com oferta.

#### 5. Sofisticação do mercado (Schwartz)
Mercado mais sofisticado já viu todos os argumentos básicos — copy precisa de mecanismo único, prova nova, ou virada não óbvia. Mercado novo aguenta promessa direta. A copy tá no nível certo pra esse mercado?

#### 6. Estrutura específica do tipo de peça
- **Ad Meta/Google:** hook nos 3 primeiros segundos? gancho emocional/lógico claro? CTA específico?
- **Landing page:** AIDA ou PAS? prova social posicionada? escaneabilidade?
- **Carrossel:** capa cria tensão? slides têm curiosity gap? slide final tem CTA com ponte (não solto)?
- **Email:** linha de assunto + pré-header testáveis? abertura puxa pra leitura?
- **Post orgânico:** hook nas primeiras 2 linhas (antes do "ver mais")?
- **Roteiro de vídeo:** ritmo conversado? loop emocional/narrativo claro?

### Passo 5 — Output do review

#### Modo "Só review" (modo 1)

Devolver no formato:

```markdown
# Review de copy — [Tipo de peça] — [Cliente]
*Revisado em [DD/MM/YYYY]*

## Diagnóstico geral
[1-2 frases sobre o estado da copy: aprovar como tá / aprovar com ajustes pequenos / devolver pra reescrita / problema sério]

## O que tá bom
[Lista do que NÃO mexer — pra copywriter saber o que continuar fazendo]

## Ajustes sugeridos
**[Trecho original]:**
> [trecho da copy]

**Problema:** [diagnóstico curto]
**Sugestão:** [reescrita concreta — não "melhore essa parte", mas o texto novo possível]

[repetir pra cada ajuste]

## Bandeiras vermelhas
[Clichês detectados, travessões, frases com cara de IA, qualquer coisa fora do tom Murupi ou do tom do cliente — listar com citação direta do trecho]

## Recomendação final
- [ ] Aprovar como está
- [ ] Aprovar com ajustes pontuais (listados acima)
- [ ] Devolver pra copywriter reescrever (com este review)
- [ ] Reescrever do zero (briefing precisa ser revisado também)
```

#### Modo "Review + reescrita" (modo 2)

Tudo do modo 1, **MAIS uma seção no final**:

```markdown
---

## Versão final ajustada

[Copy reescrita aplicando todos os ajustes — pronta pra aprovar e mandar pra frente]
```

### Passo 6 — Salvar e mostrar

Salvar em `clientes/[cliente]/copy/[YYYY-MM-DD]-revisao-[tipo]-[tema-slug].md`. Criar pasta `clientes/[cliente]/copy/` se não existir.

Mostrar o review inteiro no chat e perguntar:

> "Review pronto e salvo em `[caminho]`.
>
> [review inteiro]
>
> O que vai fazer com essa copy: aprovar / devolver / reescrever?"

Se ela escolher "aprovar" no modo 2, salvar a versão final aprovada também em `clientes/[cliente]/copy/[YYYY-MM-DD]-aprovada-[tipo]-[tema-slug].md` pra histórico.

---

## Regras

- **Tom do feedback:** direto, construtivo, técnico. A copywriter é profissional — não precisa de afago. Sem "ótimo trabalho!", sem "boa pegada!". Apontar o que tá bom porque é informação útil pra ela, não pra agradar
- **Sugestão sempre concreta** — nunca "melhore essa parte" ou "fica mais natural". Sempre escrever o trecho novo possível, mesmo no modo "só review"
- **Não inventar conteúdo** — se a copywriter omitiu informação que o briefing pedia, apontar a omissão. Não preencher sozinho com algo plausível
- **Não brigar com decisão já validada do cliente** — se a copy anterior aprovada usa um tom específico, manter a consistência mesmo que pessoalmente não seria a primeira escolha
- **Tom Murupi (preferencias.md) é piso, não teto** — copy do cliente pode ser MAIS formal ou MAIS informal que a Murupi, dependendo do tom do cliente. Mas as regras universais (sem travessão, sem clichê, sem cara de IA) valem sempre
- **Schwartz é referência, não dogma** — se a copy desafia o nível e o resultado é forte, apontar mas não rejeitar
- **Output salvo** mesmo no modo 1 (review-only) — histórico de revisões serve pra ver evolução da copywriter ao longo do tempo
- Se a copy for da Murupi (não de cliente), salvar em `conteudo/copy-revisada/[YYYY-MM-DD]-[tema-slug].md` (criar pasta se não existir)
