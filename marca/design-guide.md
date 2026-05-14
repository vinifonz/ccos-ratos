# Guia de Design — Agência Murupi

> Você pode editar esse arquivo a qualquer momento.
> As skills de carrossel, proposta e slide leem este arquivo antes de criar qualquer visual.

---

## Cores

- **Fundo principal:** `#F4F2EF` (off-white)
- **Cor de destaque / CTA:** `#D98A06` (laranja-ocre / mostarda — cor principal do logotipo)
- **Cor secundária:** `#A63B05` (terracota / laranja queimado — pra acentos fortes ou estados de alerta)
- **Texto principal sobre fundo claro:** `#242424` (preto suave)
- **Texto principal sobre fundo escuro:** `#F4F2EF` (off-white)
- **Texto secundário / complementar:** `#656D43` (verde-musgo)
- **Fundo escuro alternativo:** `#242424` (usar com `logo-fundo-escuro.png`)
- **Cor proibida:** azul, rosa choque, qualquer cor fora da paleta acima

Paleta visual de referência em `marca/paleta.png`.

---

## Tipografia

- **Títulos e destaques:** **Buffalo** (display, usar com moderação — apenas headlines curtas)
- **Corpo, subtítulos e botões:** **Jost** (sans-serif limpa, geométrica)
- **Peso do título:** Buffalo regular (já é pesada por natureza); Jost em **600** (semibold) pra subtítulos e CTAs
- **Peso do corpo:** Jost em **400** (regular)
- **Tracking:** levemente aberto em peças menores (~0.02em)

---

## Estilo geral
- Estética **limpa, organizada, com cara de infográfico**.
- Sofisticada e funcional — sem excesso de elementos.
- Visual **neutro de base**, com destaque **estratégico** das cores quentes (`#D98A06` e `#A63B05`).
- Quando usar imagens, preferir **referências da vida real** — não estética genérica de banco de imagem nem ilustração corporativa.
- Respiração entre elementos é prioridade. Nada apertado.

---

## Elementos-chave
- **Bordas:** sutis, em `#656D43` ou em `#242424` a 10–15% de opacidade. Nunca borda preta sólida pesada.
- **Border-radius dos cards:** 12–16px (suave, mas não exageradamente arredondado).
- **Botões:** fundo `#D98A06`, texto `#F4F2EF`, raio 8px, padding generoso. Hover: escurece 8%.
- **Sombras:** sutis e baixas (`0 2px 8px rgba(36, 36, 36, 0.06)`). Evitar sombras pesadas.
- **Linhas / divisores:** 1px em `#656D43` a 30% de opacidade.

---

## O que NUNCA fazer
- Usar **azul, rosa choque** ou qualquer cor fora da paleta.
- Aplicar gradientes saturados ou efeitos "glow" em volta de elementos.
- Empilhar muitos elementos sem respiro — visual carregado contraria a marca.
- Usar imagens "stock corporativo" — sempre vida real ou peça gráfica autoral.
- Usar travessão `—` em copy de peça visual (mesma regra do tom de voz).

---

## Logo

- **Arquivo (fundo claro):** `marca/logo-fundo-claro.png` — versão padrão. "AGÊNCIA" em verde-musgo + "murupi" em ocre, sobre off-white.
- **Versão pra fundo escuro:** `marca/logo-fundo-escuro.png` — texto em off-white, pimenta mantém o ocre. Usar sobre `#242424`.
- **Onde usar:** slide final do carrossel (CTA), header de propostas, slides de apresentação, assinatura visual em peças orgânicas.
- **Tamanho sugerido:** largura entre 120–200px nos HTMLs.

---

## Perfil do autor

> Usado no estilo "tweet" do carrossel.

- **Nome:** Jaquelinne
- **Handle:** @murupiagencia
- **Foto:** *(adicionar arquivo em `marca/foto-perfil.jpg` quando tiver)*
- **Badge verificado:** sim

---

## Legenda em vídeo (subtitle queimada)

Estilo aplicado quando a Murupi produz vídeo orgânico (Reel, story de vídeo, post com vídeo) com legenda queimada dentro da peça. Não confundir com a **caption** do post no feed — essa é regida por outra regra (a caption complementa o áudio, nunca repete).

- **Tipografia:** **Poppins Regular** (Google Fonts — OFL). Arquivo: `marca/fonts/Poppins-Regular.ttf`.
- **Tamanho:** 35pt (referência CapCut/Premiere). Em renderizadores ASS/libass, equivale a `FontSize=35` no force_style.
- **Cor do texto:** `#F4F2EF` (off-white da paleta) — lê sobre fundo claro e escuro.
- **Tratamento de leitura:** outline `#242424` (preto suave da paleta) com espessura fina (~1.5px ASS). Sem shadow, sem caixa de fundo.
- **Posição:** centro horizontal + centro vertical (meio da tela). Alignment ASS = `5`.
- **Animação:** **estática**. Frase aparece inteira de uma vez e some quando a próxima começa. Sem fade, sem pop, sem slide.
- **Quebra de cue:** **por sentença linguística** — cada legenda corresponde a uma sentença completa que termina em `.` `?` ou `!`. Vírgula e dois-pontos não quebram. Libass quebra automático em múltiplas linhas quando a sentença é longa (WrapStyle padrão).

---

## Observações adicionais
- Conteúdo orgânico da Murupi puxa **vida real** — fotos de bastidor, do dia a dia, da Jaquelinne mesmo. A estética visual acompanha esse princípio.
- Em peças com texto longo, priorizar Jost. Reservar Buffalo pra abertura/destaque.
- A pimenta do logo é elemento decorativo opcional em outras peças (selo, ornamento de canto).
