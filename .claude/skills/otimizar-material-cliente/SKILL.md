---
name: otimizar-material-cliente
description: >
  Otimiza materiais que o CLIENTE da Murupi usa no processo comercial dele
  (proposta comercial pro consumidor final, folder, banner, apresentação,
  one-pager, slides de venda). Diferente de `/proposta-comercial`, que cria
  proposta da Murupi pra fechar cliente. Aqui é trabalho de consultoria —
  pegar o material existente do cliente e melhorar.
  Modo híbrido: análise + sugestões (pra educar o cliente / time dele) ou
  análise + reescrita pronta (devolve versão otimizada em texto).
  Use quando a Jaquelinne disser "otimiza essa proposta da [cliente]",
  "melhora esse folder do [cliente]", "review do material comercial do
  [cliente]", "essa apresentação do cliente tá fraca, melhora", "ajusta
  esse banner do [cliente]".
  NÃO usar pra criar proposta da Murupi (usar `/proposta-comercial`) nem pra
  revisar peça da equipe Murupi (usar `/revisar-peca`).
---

# /otimizar-material-cliente — Otimização de Material Comercial do Cliente

## Contexto e dependências

- **Briefing do cliente:** `clientes/[cliente]/briefing.md` — público, dor, posicionamento, tom exigido
- **Deep research (se existir):** `clientes/[cliente]/pesquisa/` — contexto de mercado, concorrentes, vácuos
- **Tom de voz Murupi:** `_contexto/preferencias.md` — regras universais (sem clichê, sem cara de IA)
- **Pasta de saída:** `clientes/[cliente]/material-otimizado/`

Este é trabalho de **consultoria estratégica** — a Murupi assessora o cliente a comunicar melhor pro consumidor final dele. NÃO confundir:
- **`/proposta-comercial`:** Murupi cria proposta pra fechar cliente novo (sentido: agência → cliente)
- **`/otimizar-material-cliente`:** Murupi melhora material que o cliente usa pra vender pro consumidor dele (sentido: cliente → consumidor final)
- **`/revisar-peca`:** Murupi revisa peça que a equipe interna entregou (designer/editor) antes de mandar pro cliente

---

## Workflow

### Passo 1 — Coletar inputs

Em uma única mensagem:

> "Pra otimizar com critério, me passa:
>
> 1. **Cliente** — qual?
> 2. **Tipo de material** — proposta comercial / folder / banner / apresentação / one-pager / slides de venda / outro
> 3. **O material atual** — três caminhos:
>    - **(a)** Cola o texto direto (pra material textual: proposta, one-pager)
>    - **(b)** Anexa o arquivo (PDF, DOCX, PNG, JPG)
>    - **(c)** Joga em `clientes/[cliente]/material-otimizado/originais/` e me diz o nome
> 4. **O que tu quer melhorar** (opcional, mas ajuda) — clareza? persuasão? estrutura? hierarquia visual? funil? algum problema específico tu já identificou?"

Pra cada formato:
- **PDF:** ativar a skill nativa `/pdf` se necessário pra extrair texto
- **DOCX:** ativar a skill nativa `/docx`
- **PNG/JPG (folder/banner):** ler como imagem
- **Texto colado:** processar direto

### Passo 2 — Modo de operação

> "Modo:
>
> 1. **Análise + sugestões** — devolvo crítica detalhada e sugestões. Tu (ou o cliente) aplica. Bom pra educar o cliente sobre as decisões.
> 2. **Análise + reescrita pronta** — devolvo versão otimizada em texto, pronta pra entregar/passar pro designer aplicar visualmente. Mais rápido pra fechar.
>
> Pra material visual (folder/banner com layout), modo 2 fica limitado: posso reescrever copy mas não recrio o layout — sugiro descrição visual detalhada que o designer aplique.
>
> Qual modo?"

### Passo 3 — Carregar contexto

1. `clientes/[cliente]/briefing.md` — público, dor, nível de consciência, tom exigido pelo cliente
2. `clientes/[cliente]/pesquisa/` — se houver deep research, ler resumo executivo (contexto de concorrentes e vácuos do nicho)
3. `_contexto/preferencias.md` — regras universais Murupi (não tom do cliente)

Se briefing tá vazio em campos críticos:

> "Pra otimizar com força, preciso saber: público, dor principal, tom exigido pelo cliente. Tá tudo vazio no briefing — quer preencher rápido ou avalio com o que tenho?"

### Passo 4 — Análise por tipo de material

#### Proposta comercial / one-pager / slides de venda

Avaliar em **8 critérios**:

1. **Estrutura** — tem header? destinatário? problema? solução? escopo? prazo? investimento? prova? CTA? Falta alguma seção crítica?
2. **Hierarquia da abertura** — abre falando do cliente ou da empresa do cliente? (Fala do cliente é forte, fala de si é fraca)
3. **Articulação do problema** — o problema é articulado na perspectiva do consumidor (com palavras que ele usaria)? Ou está em jargão da empresa?
4. **Mecanismo da solução** — explica POR QUE a solução resolve o problema? Ou só lista features?
5. **Prova** — tem prova social, dados, casos? Posicionada antes ou depois do investimento?
6. **Objeções antecipadas** — antecipa "tá caro", "vou pensar", "preciso comparar", ou ignora?
7. **CTA** — específico (próximo passo claro com data/ação) ou genérico ("entre em contato")?
8. **Tom** — bate com o tom exigido pelo cliente? Cara de template corporativo ou de pessoa real falando?

#### Folder / banner / material visual

Avaliar:

1. **Hierarquia visual** — o olho sabe pra onde ir primeiro? O destaque destaca o certo?
2. **Headline** — para o scroll/atenção em 3s? Ou genérica?
3. **Copy curta** — fala do consumidor (benefício) ou da empresa (feature)?
4. **CTA visual** — botão/destaque claro? Onde olhar pra agir?
5. **ID visual** — combina com o resto da identidade do cliente?
6. **Densidade** — tem respiro ou tá empilhado?

### Passo 5 — Output

Salvar em `clientes/[cliente]/material-otimizado/[YYYY-MM-DD]-[tipo]-[descricao-slug].md`. Formato:

```markdown
# Otimização — [Tipo de material] da [Cliente]
*Otimizado em [DD/MM/YYYY]*

## Diagnóstico geral
[2-3 frases sobre o estado atual: pequenos ajustes / reestruturação parcial / refazer do zero / problema é estratégico antes de ser de execução]

## O que tá funcionando
[Listar o que NÃO mexer pra o cliente saber o que manter]

## Pontos críticos pra ajustar

### 1. [Nome do problema, ex: "Abertura fala da empresa, não do consumidor"]
**Trecho atual:**
> [citação do material original]

**Problema:** [diagnóstico — por que isso enfraquece]
**Sugestão:** [versão reescrita ou descrição visual concreta. Nunca "melhore", sempre o trecho novo]

### 2. ...

## Recomendações estratégicas
[Recomendações que vão além do material — ex: "esse folder tá tentando vender pra 3 públicos diferentes — sugiro fazer 3 versões separadas, cada uma pra um público"]

## Recomendação final
- [ ] Ajustes pontuais (cliente aplica)
- [ ] Reestruturação parcial (criar nova versão com base nessa, vou aplicar agora se modo 2)
- [ ] Refazer do zero (briefing precisa ser revisitado também)
```

#### Se modo 2 (reescrita pronta) e for material textual

Adicionar seção no final:

```markdown
---

## Versão otimizada

[Material reescrito por inteiro aplicando todas as sugestões — pronto pra entregar pro cliente ou passar pro designer/copy do cliente aplicar]
```

#### Se modo 2 e for material visual

Adicionar:

```markdown
---

## Briefing visual pra refazer

[Descrição detalhada das mudanças visuais sugeridas — "header em fundo escuro com headline em 56px, copy de 8 palavras...", etc. O designer (do cliente ou da Murupi) usa isso como brief pra refazer]
```

### Passo 6 — Mensagem final

> "Otimização salva em `[caminho]`.
>
> [resumo executivo — o diagnóstico geral + 3 ajustes mais críticos]
>
> Quer que eu mande o material inteiro pro chat (cópia rápida), entregue só pra ti revisar, ou já preparo um email/recado pro cliente explicando as mudanças?"

---

## Regras

- **Tom da otimização** segue `_contexto/preferencias.md` — sem clichê, sem cara de IA. **Tom do material reescrito** segue o tom EXIGIDO PELO CLIENTE (do briefing) — pode ser mais formal ou mais informal que a Murupi
- **Sugestão sempre concreta** — "trocar X por Y" e o trecho novo, nunca "melhore"
- **Não inventar dado** — se o material atual tem números/casos/depoimentos, manter. Se sugerir adicionar prova social, marcar `[adicionar dado real aqui]` em vez de inventar
- **Respeitar decisões do cliente** — se o cliente exigiu algo no briefing (ex: "não pode mencionar concorrente X"), respeitar ferreamente
- **Pra material visual:** ser realista — sem layout software, posso só descrever o que mudaria. Mockup HTML simples é possível pra elementos digitais (botão, banner web), mas não pra peças impressas com camadas
- **Pra PDFs longos** (proposta de 20+ páginas): processar inteiro mas no diagnóstico focar em **5-7 ajustes mais críticos**, não listar 50 problemas pequenos. Cliente perde foco
- **Salvar em `material-otimizado/`** sempre. Originais (se ela jogou na pasta) ficam em `material-otimizado/originais/` (criar se não existir)
- **Tom de feedback estratégico** — não é só copy, é estratégia comercial. Se o problema é mais profundo (ex: oferta confusa, público mal definido), apontar isso primeiro. Material é sintoma, posicionamento é causa
