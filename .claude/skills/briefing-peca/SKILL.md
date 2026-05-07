---
name: briefing-peca
description: >
  Gera briefing detalhado de uma peça de conteúdo pra designer ou editor de vídeo
  da equipe Murupi, no formato pronto pra colar no card do ClickUp.
  Use quando a Jaquelinne disser "faz briefing pra designer", "briefing pro editor",
  "briefing de carrossel pro [cliente]", "briefing de vídeo pro [cliente]",
  "preciso passar uma demanda pro [designer/editor]", "demanda nova de design/vídeo",
  "novo briefing de peça", ou pedir pra estruturar uma demanda de criativo.
  NÃO use pra calendário mensal de social media (usar /calendario-editorial)
  nem pra roteiro de conteúdo bruto (usar /roteiro-post).
---

# /briefing-peca — Briefing pra Designer ou Editor de Vídeo

## Contexto e dependências

- **Contexto do negócio:** `_contexto/empresa.md` (clientes da Murupi, equipe interna)
- **Tom de voz:** `_contexto/preferencias.md` (texto direto, sem clichê, sem cara de IA)
- **Identidade visual:** ler `marca/design-guide.md` apenas se a peça for da Murupi (não de cliente)
- **Pasta de saída:** `clientes/[cliente]/briefings-peca/`

A equipe interna da Murupi tem **designer**, **editor de vídeo** e **social media**. Esta skill cobre os dois primeiros. Pra demandas pra social media (calendário mensal), usar `/calendario-editorial`.

---

## Workflow

### Passo 1 — Pra quem é o briefing

Perguntar (se a Jaquelinne não tiver dito ainda):

> "Esse briefing é pro **designer** ou pro **editor de vídeo**?"

Se ela disser ambos ("manda pros dois") ou se a peça envolver os dois (ex: vídeo com card de abertura desenhado pelo designer), gerar **dois briefings separados** — um por profissional. Cada um vai num arquivo próprio.

### Passo 2 — Coletar os campos comuns

Apresentar os campos em **uma única mensagem** (não pergunta por pergunta), aceitando resposta livre. Se ela já disse alguns campos no comando inicial, listar só os que faltam.

> "Beleza, briefing pra [designer / editor]. Me passa:
>
> 1. **Cliente** — qual? (se for conteúdo da Murupi, fala "Murupi")
> 2. **Tipo de peça** — carrossel, post estático, story, banner, reels, vídeo longo, etc.
> 3. **Formato** — 1080x1350 (carrossel/feed), 1080x1080 (quadrado), 1080x1920 (story/reels), 1920x1080 (banner), outro
> 4. **Tema / mensagem central** — em uma frase
> 5. **Referência** — link de outro perfil, post anterior do próprio cliente, ou print. Se for print, joga em `clientes/[cliente]/briefings-peca/refs/` e me diz o nome do arquivo
> 6. **Copy** — o texto da peça (pode colar inteiro). Se ainda não tem, falo "copy: pendente — escrever depois"
> 7. **Urgência** — normal / alta / urgente (furafila), e/ou data limite (DD/MM)
> 8. **Observações** — tudo que precisa saber (logo onde, logo de patrocínio, marcações, qualquer detalhe técnico)
>
> Pode mandar tudo junto ou ir respondendo. Se faltar info, eu pergunto."

**Regras de processamento:**
- Se a Jaquelinne escrever de forma corrida ("carrossel pra Eletronova sobre dia das mães urgente, manda"), **extrair o que der dos campos** e perguntar só os que ficaram em branco
- Se o campo "Copy" vier longo, manter inteiro no briefing (não cortar)
- Se a referência for um link do Instagram, lembrar que WebFetch não funciona lá — anotar o link mesmo assim, designer/editor abre direto
- Validar que o cliente mencionado existe em `clientes/`. Se não existir, perguntar: "É cliente novo? Crio a pasta agora ou já existe com outro nome?"

### Passo 2.5 — Se for editor de vídeo, coletar campos extras

Após os campos comuns, perguntar (em uma mensagem):

> "Como é vídeo, preciso de mais duas coisas:
>
> 9. **Roteiro detalhado** — cola aqui o roteiro com descrições/sugestões de cena por parte. Se já tá pronto num arquivo, me passa o caminho
> 10. **Pasta de material bruto** — onde estão os vídeos, áudios, imagens que ele tem que usar nessa edição? Joga em `clientes/[cliente]/briefings-peca/material-bruto-[YYYY-MM-DD]-[tema-slug]/` ou me passa o caminho de onde já estão"

Se o roteiro estiver em arquivo separado, referenciar o caminho no briefing. Se vier inline, incluir inteiro.

### Passo 3 — Gerar o briefing em markdown

Montar o briefing seguindo este template, **sem inventar campos vazios** (se o usuário não passou Copy ainda, escrever literalmente "Pendente — escrever antes de mandar pro [designer/editor]"):

```markdown
# Briefing — [Tipo de peça] pro [designer / editor]

**Cliente:** [Cliente]
**Data do briefing:** [DD/MM/YYYY]
**Urgência:** [normal / alta / urgente] — [data limite: DD/MM, se houver]

---

## Tipo e formato
- **Tipo de peça:** [carrossel / post / story / banner / reels / vídeo longo / etc]
- **Formato:** [1080x1350 / 1080x1080 / 1080x1920 / outro]
- **Quantidade de slides/cortes:** [se aplicável]

## Tema
[Tema / mensagem central, em uma frase]

## Referência
[Link OU caminho do arquivo em refs/. Pode ter mais de uma referência]

## Copy
[Copy inteira aqui. Se for carrossel, indicar slide a slide quando aplicável.]

## Observações
[Tudo que precisa saber — logo onde, marcações, hashtags na peça, restrições, detalhes técnicos]
```

**Pra editor de vídeo, adicionar duas seções no final:**

```markdown
## Roteiro detalhado
[Roteiro com descrições/sugestões de cena, ou referência ao arquivo]

## Material bruto
**Pasta:** [caminho completo da pasta com vídeos/áudios/imagens]
[Lista dos arquivos principais, se quiser dar dica do que usar onde]
```

### Passo 4 — Salvar e mostrar pra Jaquelinne copiar

1. Slugificar o tema (lowercase, hifens, sem acento). Ex: "Dia das Mães" → "dia-das-maes"
2. Montar o caminho: `clientes/[cliente]/briefings-peca/[YYYY-MM-DD]-[tipo]-[tema-slug].md`
3. Criar a pasta `clientes/[cliente]/briefings-peca/` se não existir
4. Salvar o briefing
5. **Mostrar o briefing inteiro no chat** pra ela copiar e colar no ClickUp (não só salvar e dizer "pronto")

Mensagem final:

> "Briefing salvo em `[caminho]`.
>
> Cola isso no card do ClickUp:
>
> ---
> [briefing inteiro]
> ---
>
> Quer gerar mais um briefing pra essa peça (ex: o briefing pro outro profissional) ou tá fechado?"

---

## Regras

- Tom direto, sem formalidade — segue `_contexto/preferencias.md` (sem clichê, sem travessão, sem cara de IA)
- Aceitar resposta livre da Jaquelinne; nunca fazer pergunta por pergunta se ela já mandou tudo de uma vez
- Nunca inventar conteúdo de copy ou roteiro. Se ela não passou, escrever "Pendente — escrever antes de mandar pro [designer/editor]"
- Slugificar nome do arquivo sempre (lowercase, hifens, sem acento, max 40 caracteres)
- Se o cliente não existe em `clientes/`, perguntar antes de criar pasta nova
- Se for briefing pra "Murupi" (conteúdo orgânico da agência), usar `clientes/murupi/briefings-peca/` (criar se não existir) — assim Murupi vira "cliente de si mesma" pra fins de organização
- Pra urgência "urgente / furafila", incluir essa palavra **em destaque no topo do briefing** pra designer/editor não passar batido
- Briefing pronto **sempre é mostrado inteiro no chat** pra cópia rápida — não basta salvar
- Se a Jaquelinne pedir pra integrar com ClickUp via API algum dia, o roadmap está em `tarefas.md`. Por enquanto a skill só gera markdown
