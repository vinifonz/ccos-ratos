---
name: editar-imagem
description: >
  Edita partes específicas de uma imagem existente usando JSON estruturado no Nano Banana Pro
  (Gemini 3 Pro Image), em vez de regerar a imagem inteira. Decompõe a imagem em camadas
  num JSON (sujeito, iluminação, câmera, background, mood, paleta, materiais, etc.),
  identifica qual campo precisa mudar e modifica só esse campo, mantendo todos os outros
  congelados. O modelo preserva o resto e ajusta só o que mudou. Funciona pra trocar fundo,
  mudar roupa, ajustar iluminação, mudar pose, trocar objeto na cena, mudar paleta, mudar
  textura. Use quando a Jaquelinne disser "edita essa imagem", "muda só o fundo dessa arte",
  "troca a roupa nessa foto", "muda a iluminação dessa peça", "ajusta esse detalhe sem
  refazer tudo", "edita pontual essa imagem", "tirei essa foto mas quero mudar o cenário",
  "preciso editar essa peça mantendo tudo igual menos X", "muda só X nessa imagem",
  "JSON edit dessa imagem", "edita no nano banana". NÃO usar pra criar imagem do zero a
  partir de referências (usar `/prompt-de-imagem`) nem pra revisar peça pronta da equipe
  antes de aprovar (usar `/revisar-peca`).
---

# /editar-imagem — Edição pontual via JSON (Nano Banana Pro / Gemini 3 Pro Image)

## Contexto e dependências

- **Tom de voz:** `_contexto/preferencias.md`
- **Identidade visual da Murupi:** `marca/design-guide.md`
- **Identidade do cliente:** `clientes/[cliente]/marca/design-guide.md` (se existir, sobrepõe a da Murupi)
- **Pasta de saída:**
  - Cliente: `clientes/[cliente]/prompts-imagem/edits/`
  - Murupi orgânico: `conteudo/prompts-imagem/edits/`
  - Infoproduto: `infoproduto/prompts-imagem/edits/`

A skill mira o **Nano Banana Pro** (Gemini 3 Pro Image, model ID `gemini-3-pro-image-preview`), que é o modelo default da Murupi pra qualquer trabalho de imagem. Processa JSON estruturado com precisão alta. Se a Jaquelinne pedir Midjourney ou Stable Diffusion, avisar que esses modelos não respondem bem a JSON e oferecer adaptação pra prosa.

---

## Princípio

Gerador de imagem por prompt em prosa quase sempre **regera a imagem inteira** quando você pede uma mudança. Você fica refém da "loteria da IA": tenta ajustar a iluminação e o modelo entrega outra pessoa.

A técnica do JSON estruturado quebra isso. Você descreve a imagem em campos discretos (subject, lighting, camera, background, mood, etc.) e, pra editar, modifica **só o campo daquele aspecto**. O modelo recebe a imagem original como anexo + o JSON completo, mas só com o campo alvo alterado. Resultado: ele entende que precisa preservar o resto e mexer só ali.

A skill faz três coisas:

1. **Decompõe** a imagem original em JSON estruturado (extrai os campos a partir do que ela mostra).
2. **Modifica** só o(s) campo(s) que a Jaquelinne pediu pra mudar.
3. **Entrega** o JSON pronto + a frase de comando pra colar no Nano Banana Pro junto com a imagem original.

---

## Workflow

### Passo 1 — Receber a imagem original e o pedido de edição

A Jaquelinne vai mandar:
1. **A imagem original** (anexo no chat ou caminho local no workspace)
2. **O que mudar** (texto livre, ex: "muda o fundo pra um escritório iluminado", "troca a camisa preta por uma camisa social branca", "deixa a iluminação mais dramática, lateral", "muda o ângulo pra cima, low-angle")

Captar numa mensagem só. Perguntar só o que faltar:

1. **Cliente / projeto** — pra qual cliente, Murupi orgânico ou infoproduto (define a pasta de saída e o design-guide)
2. **Tipo de peça** — feed, story, banner, capa, header
3. **Quantos edits** — uma mudança ou várias ao mesmo tempo (se forem várias, listar item por item)
4. **Restrições visuais** — algo que **não pode mudar** (rosto da pessoa, logo na peça, cor específica)

Se a imagem não veio anexada e ela só descreveu, pedir: "Cola a imagem aqui ou me passa o caminho local. Sem ela como referência, o JSON sai chutado e a edição vira regeneração."

### Passo 2 — Decompor a imagem em JSON

Olhar a imagem com atenção e preencher o schema abaixo, campo por campo. **Cada campo é uma string descritiva em inglês**, específica e curta. Não inventar o que não dá pra ver, mas descrever com precisão o que está visível.

```json
{
  "subject": "main subject in one line — who/what is in the foreground",
  "subject_details": {
    "physical": "age range, ethnicity, build, skin tone, hair (color, length, style), distinguishing features",
    "clothing": "every visible garment with color, material, fit, condition",
    "expression": "facial expression, gaze direction",
    "pose": "body position, hand placement, gesture"
  },
  "background": "scene behind the subject — location, depth, key elements",
  "background_objects": ["specific item 1", "specific item 2"],
  "lighting": "source, direction, hardness, color temperature, time of day (e.g. 'soft window light from camera-left, late afternoon, warm 4500K, gentle falloff')",
  "camera": {
    "lens": "focal length and aperture (e.g. '85mm f/1.8')",
    "angle": "eye-level, low-angle, high-angle, overhead, dutch",
    "framing": "close-up, medium shot, wide, full body",
    "depth_of_field": "shallow, medium, deep — what's in focus"
  },
  "color_palette": "dominant colors with names and hex when known (e.g. 'burnt ochre #D98A06, warm off-white #F4F2EF, deep charcoal #2A2A2A')",
  "materials_textures": "specific surface qualities (e.g. 'matte cotton, brushed steel, raw concrete, glossy ceramic')",
  "style": "photographic style or aesthetic (e.g. 'editorial portrait, direct flash, documentary, studio product, cinematic')",
  "mood": "emotional atmosphere (e.g. 'calm and contemplative', 'tense and high-energy')",
  "post_processing": "any visible treatment (e.g. 'film grain, slight teal-orange grade, no retouching')",
  "format": "aspect ratio and orientation (e.g. '4:5 vertical')",
  "extras": "anything else worth locking in (props, signage, typography in scene, particles, weather)"
}
```

**Regras de extração:**

- Não preencher campo que não dá pra ver com clareza. Deixar como string vazia `""` ou omitir o campo. Inventar campo cria conflito na regeneração.
- Detalhar o sujeito principal a fundo. É a parte mais vulnerável a "loteria da IA" e detalhe denso ancora a consistência.
- Câmera é o campo onde Nano Banana Pro mais respeita. Lente + ângulo + DoF bem descritos seguram a composição.
- Cor com hex sempre que vier do design-guide do cliente ou da Murupi.

Mostrar pra Jaquelinne o JSON extraído:

> "Decompus a imagem assim. Confere os campos antes de eu aplicar a edição — se algo tá errado na leitura, conserta agora pra não bagunçar a regeneração:
>
> ```json
> [JSON COMPLETO]
> ```"

### Passo 3 — Aplicar a edição no(s) campo(s) certo(s)

A Jaquelinne valida ou ajusta. Quando ela aprovar a leitura, identificar **qual campo (ou subcampo) cada edição pedida toca:**

| Pedido típico | Campo a modificar |
|---|---|
| "muda o fundo pra X" | `background` (+ `background_objects` se aplicável) |
| "troca a roupa" | `subject_details.clothing` |
| "muda a expressão / o olhar" | `subject_details.expression` |
| "muda a pose" | `subject_details.pose` |
| "muda a iluminação" | `lighting` |
| "muda o ângulo / a lente" | `camera` (subcampo específico) |
| "tira o objeto X / coloca o objeto Y" | `background_objects` |
| "muda a paleta de cor" | `color_palette` |
| "deixa mais dramático / mais leve" | `mood` (e às vezes `lighting`) |
| "tira o grão / muda o filtro" | `post_processing` |
| "muda a textura de X" | `materials_textures` |

**Critério rígido:** mexer **somente** no campo que o pedido toca. Resistir à tentação de "aproveitar e melhorar" outros campos. A consistência da edição depende disso.

Se a Jaquelinne pediu duas ou mais mudanças, modificar cada campo correspondente — mas listar pra ela ver:

> "Vou tocar nesses campos: `lighting` e `background_objects`. Os demais ficam idênticos ao original. Confirma?"

Se um pedido for ambíguo ou mexer em mais de um campo (ex: "deixa mais profissional"), parar e pedir pra ela especificar qual aspecto exatamente — senão o JSON modificado vira um prompt vago e cai na regeneração inteira.

### Passo 4 — Cruzar com a marca antes de fechar

Antes de entregar o JSON final:

1. **Carregar o design-guide certo:**
   - Cliente → primeiro `clientes/[cliente]/marca/design-guide.md`. Se não existir, usar `marca/design-guide.md` da Murupi como fallback **com aviso**.
   - Murupi orgânico ou infoproduto → `marca/design-guide.md` direto.
2. **Conferir conflito:** se a mudança que ela pediu fere regra da marca (ex: paleta proibida, mood que conflita), levantar antes de entregar. Não corrigir silenciosamente.

### Passo 5 — Entregar o JSON final + comando de uso

Apresentar dois blocos no chat:

**Bloco 1 — O JSON modificado completo** (não diff, JSON inteiro com o campo alterado dentro):

```json
[JSON COMPLETO COM O(S) CAMPO(S) MODIFICADO(S)]
```

**Bloco 2 — A frase de comando** pra ela colar no Nano Banana Pro junto com a imagem original e o JSON:

```
Edit the attached image using the JSON specification below. Apply ONLY the changes implied by the JSON fields — preserve every other element of the source image exactly: same person, same composition, same camera setup, same color palette, same lighting (unless explicitly changed in the JSON). Do not regenerate or reinterpret elements that are not edited. Match the source image pixel-by-pixel for all unchanged fields.

[JSON COMPLETO]
```

A frase de comando é o que segura o modelo no modo "edit" em vez de "regenerate". Sem ela, o Nano Banana Pro às vezes ignora o JSON e regera tudo do zero.

### Passo 6 — Salvar o arquivo

1. Slugificar a edição (lowercase, hifens, sem acento, max 50 chars). Exemplo: `troca-fundo-escritorio-2026-05-14.md`
2. Caminho conforme o destino do projeto (ver "Pasta de saída" no topo)
3. Criar a pasta se não existir
4. Template do arquivo:

```markdown
# Edit de imagem — [descrição curta da mudança]

**Data:** YYYY-MM-DD
**Pra qual peça:** [tipo + cliente/projeto]
**Imagem original:** [caminho local ou descrição]
**O que mudou:** [campo(s) modificado(s) — ex: `background`, `subject_details.clothing`]

## JSON original (decomposição)
```json
[JSON ANTES DA EDIÇÃO]
```

## JSON modificado (pra colar)
```json
[JSON DEPOIS DA EDIÇÃO]
```

## Diff dos campos
- `[campo modificado]`: `[valor antigo]` → `[valor novo]`

## Comando completo pra colar no Nano Banana Pro
[Bloco 2 do Passo 5]
```

5. **Mostrar o JSON modificado e o comando completo no chat** pra ela copiar direto. Não basta salvar.

### Passo 7 — Iteração

Se o resultado voltar bom mas faltar algo, manter o JSON em memória de conversa e ajustar **só o campo afetado** na próxima rodada. Não recomeçar a decomposição do zero. Se o resultado voltar muito diferente do esperado, suspeitar de duas coisas:

1. Algum campo do JSON estava chutado (decomposição imprecisa)
2. A frase de comando não foi colada junto

Pra cada nova rodada, salvar versão `v2`, `v3` etc. no mesmo arquivo, em seções separadas.

---

## Regras

- **JSON sempre em inglês.** Nano Banana Pro / Gemini 3 Pro Image processam JSON estruturado em inglês com muito mais precisão que em português.
- **Mexer só no campo pedido.** Resistir a "melhorar de passagem" outros campos. Quebra a consistência da edição.
- **A frase de comando é obrigatória.** Sem ela, o modelo regera. Não entregar JSON sem o comando colado embaixo.
- **A imagem original tem que ser anexada junto com o JSON na hora de mandar pro Nano Banana Pro.** Avisar isso explicitamente no fim.
- **Detalhe denso no sujeito principal.** É o campo onde o modelo mais perde consistência. Vale a pena descrever rosto, cabelo, expressão, vestimenta com precisão.
- **Cores em hex quando vem do design-guide.** Reduz drift cromático na regeneração.
- **Não preencher campo que não dá pra ler na imagem.** String vazia é melhor que palpite — palpite cria conflito.
- **Pedido ambíguo, perguntar antes.** "Mais profissional" ou "mais bonito" não mapeia direto pra um campo do JSON. Pedir pra ela apontar exatamente o que muda (iluminação? roupa? fundo? mood?).
- **Conflito de marca, levantar antes.** Não corrigir silenciosamente.
- **Edição múltipla, listar os campos antes de aplicar.** Transparência sobre o que vai mudar.
- **Salvar sempre o JSON original e o modificado lado a lado** no arquivo de saída. Permite voltar atrás ou reaproveitar em outra edição.
- **Se ela quiser só o JSON sem salvar arquivo** (one-off rápido), aceitar — perguntar no fim "quer que eu salve esse edit em arquivo ou só usa do chat mesmo?"
- **Pra Midjourney / SD,** avisar que o método não se aplica e oferecer adaptação pra prosa (essa parte cai pra `/prompt-de-imagem` ou prompt manual).
