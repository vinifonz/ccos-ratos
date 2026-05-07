---
name: revisar-peca
description: >
  Revisa peça pronta (arte/imagem/vídeo) entregue por designer ou editor de vídeo
  da equipe Murupi antes da Jaquelinne aprovar e mandar pro cliente. Avalia
  fidelidade ao texto/copy aprovada, ortografia, ritmo, ID visual, legibilidade,
  cumprimento do objetivo e estética geral. Pra arte estática, gera mockup HTML
  de ajuste sugerido quando útil. Pra vídeo, devolve sugestões textuais
  detalhadas pro editor.
  Use quando a Jaquelinne disser "revisa essa peça", "olha essa arte que voltou",
  "revisa esse vídeo", "tá pronta pra mandar pro cliente?", "avalia esse design",
  "review desse carrossel", "essa peça tá legal?".
  NÃO usar pra revisar copy escrita (usar `/revisar-copy`).
---

# /revisar-peca — Review de Peça Pronta (Arte / Vídeo)

## Contexto e dependências

- **Briefing original da peça:** `clientes/[cliente]/briefings-peca/` — pra cruzar entrega com pedido
- **Briefing do cliente:** `clientes/[cliente]/briefing.md` — posicionamento, público, objetivo (engajamento? conversão? autoridade?)
- **Regras de tom Murupi:** `_contexto/preferencias.md`
- **Pasta de saída:** `clientes/[cliente]/revisoes/`

A skill é o caminho **contrário** da `/briefing-peca`. Briefing-peca **sai** pra equipe pedindo a peça. Revisar-peca é quando a peça **volta** pronta pra aprovação.

---

## Workflow

### Passo 1 — Coletar inputs

Em uma única mensagem:

> "Pra revisar com critério, me passa:
>
> 1. **Cliente** — qual?
> 2. **Tipo de peça** — carrossel? post estático? story? banner? reels? vídeo longo?
> 3. **Briefing original** — qual o briefing dessa peça? (caminho do arquivo em `briefings-peca/`, ou cola o link, ou diz 'sem briefing salvo')
> 4. **A peça** — três caminhos possíveis:
>    - **(a)** Arquivo PNG/JPG anexado direto no chat (eu leio direto)
>    - **(b)** Carrossel inteiro: ou baixa do Drive e me diz a pasta, ou anexa print de cada slide no chat numerados (slide-01.png, slide-02.png, ...)
>    - **(c)** Vídeo: me passa transcrição (gerada pela skill `/transcribe` ou colada) + prints dos momentos-chave + uma frase do que tu acha que não tá batendo (se já notou)"

**Identificar o tipo de input pra escolher o fluxo correto** (Passo 3).

### Passo 2 — Carregar contexto

Ler:
1. Briefing original da peça (se existir) — pra checar fidelidade ao pedido
2. `clientes/[cliente]/briefing.md` — posicionamento, dor, público, objetivo da comunicação
3. `_contexto/preferencias.md` — regras de tom universais Murupi
4. Listar `clientes/[cliente]/revisoes/` (últimas 2-3) — pra ver problemas recorrentes da equipe pra esse cliente

Se não houver briefing salvo, perguntar:

> "Não achei briefing dessa peça em `briefings-peca/`. Quer me passar o briefing agora (cola aqui ou descreve em uma frase), ou avalio só pelo que tá entregue?"

### Passo 3 — Análise (por tipo de input)

Avaliar a peça em **7 critérios**:

#### 1. Fidelidade ao texto/copy aprovada
A copy da peça bate com o que foi aprovado no briefing? **Tolerância:** designer/editor tem liberdade pra adaptar (cortar palavra pra caber, inverter ordem pra fluir melhor) — isso é OK. **NÃO é OK:** mudar sentido, cortar partes essenciais, adicionar coisa não combinada, errar nome/dado.

#### 2. Ortografia e gramática
Erros tipográficos, palavras escritas errado, vírgula errada, pontuação faltando. Apontar com citação direta do trecho.

#### 3. Ritmo
A peça tem fluência? Carrossel tem curiosity gap entre slides? Vídeo tem ritmo conversado, não arrastado nem acelerado demais? Story tem timing certo? Apontar onde trava.

#### 4. ID visual / consistência
A peça respeita a identidade visual do cliente (cores, tipografia, layouts característicos)? Bate com o estilo das peças anteriores aprovadas?
- **Pra clientes da Murupi:** consultar `marca/design-guide.md` (paleta `#D98A06`, `#A63B05`, `#656D43`, `#F4F2EF`, `#242424`; Jost + Buffalo)
- **Pra clientes externos:** confiar no que a designer entregou (Murupi não tem ID visual de cada cliente arquivada aqui — designer usa as próprias pastas de ID). Apontar SE houver inconsistência óbvia (cor que parece fora da paleta, fonte trocada no meio, logo deformado)

#### 5. Legibilidade
Texto pequeno demais? Contraste insuficiente? Texto sobre imagem com baixa legibilidade? Hierarquia confusa (não sabe o que ler primeiro)?

#### 6. Cumprimento do objetivo
A peça cumpre o objetivo declarado no briefing/posicionamento do cliente?
- **Engajamento:** tem hook forte? convida pra interagir (comentário, salvar, compartilhar)?
- **Conversão:** CTA claro e específico? prova social posicionada? leva pra ação concreta?
- **Autoridade:** dado/argumento sólido? voz de quem sabe?
- **Conexão/bastidor:** soa humano, real, não publicitário?

#### 7. Estética geral
Peça bonita? Combinação de elementos funciona? Se postar no feed, vai parecer profissional ou vai destoar?

### Passo 4 — Output do review

Salvar em `clientes/[cliente]/revisoes/[YYYY-MM-DD]-[tipo]-[tema-slug].md`. Formato:

```markdown
# Review de peça — [Tipo] — [Cliente]
*Revisado em [DD/MM/YYYY] — Briefing original: `[caminho ou "sem briefing"]`*

## Diagnóstico geral
[1-2 frases: aprovar como está / aprovar com ajustes pequenos / devolver pra ajuste / refazer]

## O que tá bom
[Lista do que NÃO mexer — pra designer/editor saber o que continuar fazendo]

## Ajustes sugeridos
**[Localização — ex: "Slide 3" ou "Frame em 0:12" ou "Header da arte"]:**
**Problema:** [diagnóstico curto]
**Sugestão:** [ajuste concreto — não "melhore", mas "trocar X por Y", "mover Z pra cima", "aumentar fonte do título pra 56px"]

[repetir pra cada ajuste — agrupar por critério se ajudar]

## Bandeiras vermelhas
[Erros críticos: ortografia, copy errada, ID visual quebrada, ilegibilidade — listar com citação direta e localização]

## Recomendação final
- [ ] Aprovar como está
- [ ] Aprovar com ajustes pontuais (devolver com este review pro [designer/editor])
- [ ] Pedir ajustes maiores antes de aprovar
- [ ] Refazer (briefing precisa ser revisado também)
```

### Passo 5 — Mockup HTML (opcional, só pra arte estática)

**Quando gerar mockup:** apenas se o ajuste é estrutural/visual e descrever em texto fica vago. Ex: "mover o título mais pra cima, aumentar fonte do destaque" — gera mockup mostrando como ficaria.
**Quando NÃO gerar:** ajustes simples (typo, troca de cor pontual, mover 1 elemento) — descrever em texto basta.

Se gerar:
1. Criar HTML em `clientes/[cliente]/revisoes/[YYYY-MM-DD]-[tipo]-[tema-slug]-mockup.html` aplicando o ajuste
2. Renderizar via Playwright (formato igual ao da peça original):
   ```bash
   npx playwright screenshot --viewport-size=1080,1350 --full-page "file:///caminho/mockup.html" "clientes/[cliente]/revisoes/[YYYY-MM-DD]-[tipo]-[tema-slug]-mockup.png"
   ```
3. Adicionar no review markdown:

```markdown
## Mockup do ajuste sugerido
Renderizei como ficaria a versão com os ajustes principais aplicados:

![Mockup do ajuste](./[YYYY-MM-DD]-[tipo]-[tema-slug]-mockup.png)

A designer pode usar esse mockup como referência pra replicar o ajuste no Figma/Photoshop.
```

### Passo 6 — Mensagem final

> "Review pronto e salvo em `[caminho]`.
>
> [review inteiro]
>
> [se houver mockup: "Mockup gerado em `[caminho]` — abre pra ver"]
>
> O que vai fazer: aprovar / devolver com este review / pedir refazer?"

---

## Regras

- **Tom do feedback:** direto, técnico, construtivo. Designer/editor são profissionais — não precisa de afago. Sem "ficou linda!", sem "amei a vibe!". Apontar o que tá bom porque é informação útil pra eles
- **Sugestão sempre concreta** — "trocar #FFF por #F4F2EF", "aumentar fonte do título de 48 pra 56px", "mover o logo do canto inferior direito pro inferior esquerdo". Nunca "melhore essa parte"
- **Tolerância pra adaptação criativa** na copy — designer pode reformular pra caber/fluir melhor. Não é OK mudar sentido, omitir parte essencial, adicionar coisa não combinada
- **Ortografia é crítica** — qualquer erro vai pra "Bandeiras vermelhas", não pra "Ajustes pontuais"
- **Mockup só quando ajuda** — não gerar mockup pra ajuste pequeno (descrição em texto basta) nem pra ajuste subjetivo demais (cor de marca, decisão de estilo do designer). Mockup é pra ajuste estrutural difícil de descrever
- **Pra vídeo, NÃO tentar gerar mockup visual** — só sugestões textuais detalhadas (corte aqui, segura essa cena, troca a trilha por X tipo de música, fade in mais lento, etc.)
- **Pra carrossel via Drive:** se a Jaquelinne mandar link do Drive, avisar que não consigo acessar e oferecer alternativas (download local OU prints anexados)
- **Pra vídeo:** sem transcrição + prints, NÃO inventar conteúdo do vídeo. Pedir os inputs primeiro, dar review honesto baseado no que foi entregue
- Se a peça for da Murupi (não de cliente), salvar em `conteudo/revisoes-pecas/[YYYY-MM-DD]-[tipo]-[tema-slug].md`
- **Output salvo** mesmo se for "aprovar como está" — histórico de reviews ajuda a ver evolução da equipe ao longo do tempo
