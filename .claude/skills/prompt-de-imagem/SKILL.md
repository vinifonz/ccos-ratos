---
name: prompt-de-imagem
description: >
  Cria prompt rico pra gerar uma imagem nova (em DALL-E, ChatGPT, Sora, Nano Banana,
  Gemini, Imagen) a partir de uma ou mais referências visuais. Decompõe cada referência
  em camadas (cores, tipografia, composição, mood, estilo, iluminação, background) e
  pergunta quais camadas aproveitar de cada uma — quebra-cabeça, não cópia.
  Use quando a Jaquelinne disser "monta prompt baseado nessa ref", "cria prompt pra
  gerar arte tipo essa", "tenho essa referência, faz um prompt", "remixa essas refs
  num prompt", "quero gerar uma imagem parecida com isso", "prompt pra IA gerar imagem",
  ou simplesmente mandar imagens pedindo pra criar arte parecida sem citar "prompt".
  NÃO usar pra editar/revisar peça pronta (usar /revisar-peca) nem pra criar slide em
  HTML (usar /slide ou /carrossel).
---

# /prompt-de-imagem — Prompt de imagem por referência (modo quebra-cabeça)

## Contexto e dependências

- **Tom de voz:** `_contexto/preferencias.md`
- **Identidade visual da Murupi:** `marca/design-guide.md`
- **Identidade do cliente:** `clientes/[cliente]/marca/design-guide.md` (se existir, sobrepõe a da Murupi pra esse projeto)
- **Pasta de saída:**
  - Cliente: `clientes/[cliente]/prompts-imagem/`
  - Murupi orgânico: `conteudo/prompts-imagem/`
  - Infoproduto: `infoproduto/prompts-imagem/`

A skill mira geradores de **linguagem natural** (DALL-E, ChatGPT, Sora, Nano Banana, Gemini, Imagen). Prompts saem em parágrafos descritivos, não em tags + parâmetros estilo Midjourney. Se a Jaquelinne pedir pra Midjourney, avisar que essa skill não cobre e adaptar o output pra formato MJ.

---

## Princípio

A Jaquelinne manda uma ou mais referências e pede pra criar arte parecida. **A skill nunca copia a referência inteira.** Separa cada referência em camadas (cores, tipografia, composição, mood, etc.), pergunta quais camadas aproveitar de cada referência, e remixa num prompt novo. Quebra-cabeça, não Xerox.

---

## Workflow

### Passo 1 — Receber referências e contexto

Quando ela abrir o pedido, vai mandar pelo menos uma referência (imagem, link, descrição). Captar tudo numa única mensagem, perguntando só o que faltar:

1. **As referências** — quantas e como vieram (imagem local, screenshot no chat, link de Pinterest/Behance/Dribbble, descrição em texto)
2. **Pra que cliente** — cliente específico, Murupi orgânico, ou infoproduto
3. **Tipo de peça** — post de feed, story, banner de anúncio, capa de carrossel, thumb de YouTube, header de proposta, etc.
4. **Formato** — 1:1, 4:5, 9:16, 16:9, ou pixel exato
5. **Tema / mensagem central** — o que essa arte tem que comunicar

**Tratamento de cada tipo de referência:**

- **Imagem local ou screenshot colado no chat:** ler/ver direto, dá pra analisar normal
- **Link Pinterest / Behance / Dribbble:** tentar WebFetch. Se não trouxer a imagem, pedir screenshot
- **Link Instagram:** WebFetch não funciona no Insta. Pedir screenshot direto
- **Descrição em texto:** trabalhar a partir da descrição; se faltar dimensão (ex: paleta), perguntar

### Passo 2 — Decompor cada referência em camadas

Pra cada referência, gerar uma análise estruturada em bullets curtos. Não escrever parágrafo. As **dimensões de análise** (sempre nessa ordem):

1. **Sujeito / cena principal** — o que tá em primeiro plano (pessoa, objeto, paisagem, abstração)
2. **Estilo visual** — fotorrealismo, ilustração flat, 3D render, colagem, editorial, brutalista, minimalista, vintage, etc.
3. **Paleta de cores** — cores dominantes (nome + hex aproximado quando der), saturação, contraste, tom (quente/frio/desbotado)
4. **Tipografia** (se houver texto) — serif/sans-serif, peso, hierarquia
5. **Composição / framing** — onde fica o foco, simetria/assimetria, espaço negativo, regra dos terços
6. **Iluminação** — natural soft, dura direta, golden hour, neon, alto contraste, etc.
7. **Background / cenário** — sólido, gradiente, textura, ambiente
8. **Mood / atmosfera** — formal, descontraído, tenso, etéreo, urbano, orgânico, nostálgico
9. **Elementos gráficos extras** — bordas, máscaras, ícones, padrões, framings, sobreposições

Apresentar pra Jaquelinne assim:

> "Analisei a(s) referência(s):
>
> **Ref 1 — [descrição curta do que é a imagem]**
> - Sujeito: [...]
> - Estilo: [...]
> - Cores: [...]
> - Composição: [...]
> - Iluminação: [...]
> - Mood: [...]
> - [demais dimensões aplicáveis]
>
> **Ref 2 — [...]**
> - [...]
>
> Agora me diz o quebra-cabeça: de qual referência você quer puxar **cada camada** da arte nova? Pode tirar tudo de uma só, pode misturar. Pode também trocar uma camada por uma diretriz nova (ex: 'cor da ref 1, mas troca o sujeito por X'). Camadas que você não mencionar, eu deixo a marca decidir."

### Passo 3 — Receber escolhas e cruzar com a marca

A Jaquelinne diz o que pegar de onde. Antes de montar o prompt, **cruzar com o design-guide aplicável:**

1. **Carregar o design-guide certo:**
   - Cliente → primeiro `clientes/[cliente]/marca/design-guide.md`. Se não existir, usar `marca/design-guide.md` da Murupi como fallback **com aviso** ("não achei design-guide do [cliente], tô usando o da Murupi como base — confirma?")
   - Murupi orgânico ou infoproduto → `marca/design-guide.md` direto
2. **Detectar conflitos antes de gerar prompt:**
   - Se uma camada escolhida (ex: paleta da ref 1) bate com regra proibida da marca (ex: "cor proibida: azul" e a ref 1 é azul), levantar:
     > "A paleta da ref 1 é azul-dominante, mas o design-guide do [cliente / Murupi] proíbe azul. Posso (a) trocar pra paleta da marca mantendo a temperatura fria da ref, (b) usar a paleta da ref mesmo assim assumindo que é exceção, ou (c) sugerir uma cor da marca que mantém o contraste — qual?"
   - Se ela escolheu um mood que conflita com o tom da marca (ex: design-guide pede "limpo, organizado, infográfico" e a ref é "caótica grunge"), levantar antes de gerar
3. **Camadas não mencionadas:** preencher com diretrizes do design-guide. Ex: se ela só falou de "estilo da ref 2", as cores e tipografia vão automático da marca.

### Passo 4 — Montar o prompt em linguagem natural

Estrutura do prompt (parágrafos densos, não bullets):

```
[Sujeito e cena principal numa frase clara e específica]. [Estilo visual e mood numa
frase, com referência a movimento/era se aplicável]. [Composição, framing e proporção
do sujeito no quadro]. [Iluminação — direção, qualidade, temperatura]. [Paleta de cores
específica, com nomes + hex quando vem do design-guide]. [Background / cenário detalhado].
[Elementos gráficos extras, se houver]. [Tipografia, se houver texto na arte]. [Proporção
e formato técnico no final].
```

**Regras de redação do prompt:**

- Linguagem natural rica, frases conectadas — não lista de tags
- Específico, nunca genérico ("luz natural soft entrando pela esquerda como final de tarde" > "boa iluminação")
- Cores nomeadas **e** hex quando vier do design-guide ("laranja-ocre #D98A06, off-white #F4F2EF")
- Mood no meio do prompt, não jogado no fim — ele orienta o gerador melhor quando vem cedo
- Evitar adjetivos vazios ("bonito", "incrível", "moderno", "marcante") — sempre preferir descrição concreta
- Sem clichê visual ("etéreo", "mágico", "épico") a menos que ela explicitamente queira
- Sem travessão (regra do `_contexto/preferencias.md` vale aqui também)
- Se a referência tiver pessoas, descrever de forma genérica (etnia/tom de pele, faixa etária, expressão, vestimenta) — geradores recusam prompts de pessoas reais identificáveis
- Se a referência tiver elementos copyrighted (personagens de filme/jogo, mascotes de marca), substituir por equivalente genérico que pega o vibe
- Se houver texto na arte, descrever conteúdo + estilo da tipografia, mas **avisar a Jaquelinne** que geradores cometem erro de tipografia: "geradores de imagem erram texto com frequência — recomendo gerar sem texto e adicionar tipografia depois no editor"
- Proporção/formato no final como instrução técnica direta ("Vertical 4:5, alta resolução")

### Passo 5 — Entregar pra Jaquelinne

1. Slugificar o tema (lowercase, hifens, sem acento, max 40 caracteres)
2. Montar o caminho conforme o destino do projeto
3. Criar a pasta se não existir
4. Salvar o arquivo com este template:

```markdown
# Prompt de imagem — [tema curto]

**Data:** YYYY-MM-DD
**Pra qual peça:** [tipo + cliente/projeto]
**Formato:** [1:1 / 4:5 / 9:16 / etc.]

## Referências usadas
- Ref 1: [descrição curta + caminho/link se aplicável]
- Ref 2: [...]

## Quebra-cabeça aplicado
- Sujeito: [da ref X / definido como Y]
- Estilo: [da ref X]
- Cores: [da ref X / da marca]
- Composição: [da ref X]
- Iluminação: [da ref X]
- Mood: [da ref X]
- [demais camadas]

## Prompt final
[Prompt completo em PT-BR]
```

5. **Mostrar o prompt inteiro no chat** pra ela copiar direto. Não basta salvar:

> "Prompt salvo em `[caminho]`.
>
> Pra copiar e jogar no [DALL-E / Sora / Nano Banana / Gemini]:
>
> ---
> [PROMPT]
> ---
>
> Quer testar e iterar (você gera, me mostra, eu refino o prompt), quer versão em inglês também (alguns geradores respondem melhor em EN), ou tá fechado?"

---

## Regras

- Skill é pra geradores de **linguagem natural**. Pra Midjourney, avisar que o formato é outro e adaptar (curto + parâmetros tipo `--ar 1:1 --style raw`)
- Sempre decompor a referência **antes** de montar prompt. Não pular o quebra-cabeça mesmo que ela diga "copia essa ref aí" — explicar que selecionar camadas dá resultado mais coerente com a marca
- Cruzar com design-guide **antes** de gerar prompt final. Conflito de marca pego depois é retrabalho
- Linguagem do prompt: PT-BR por padrão. Oferecer versão EN no fim se ela quiser, ou se o resultado do gerador vier ruim na primeira tentativa
- Não inventar conteúdo da arte. Se ela não disse o tema, perguntar
- Prompt pronto **sempre é mostrado inteiro no chat** pra cópia rápida — não basta só salvar
- Se ela quiser apenas o prompt sem salvar arquivo (one-off), aceitar — só perguntar no fim "quer que eu salve esse prompt em arquivo ou só usa do chat mesmo?"
- Pra peça com texto: avisar sobre erro de tipografia dos geradores e sugerir gerar sem texto + adicionar depois no editor
- Se a Jaquelinne mostrar a imagem gerada e quiser refinar, manter o histórico do quebra-cabeça e ajustar só as camadas que ela apontar (não regenerar prompt do zero)
