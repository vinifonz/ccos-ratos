---
name: onboarding-cliente
description: >
  Orquestra o processo completo de onboarding de cliente novo da Murupi
  (recorrente da agência ou consultoria pontual). Cria estrutura de pasta,
  gera formulário de briefing pra mandar pro cliente, dá checklist de
  pré-reunião, e shepherd ela através de `/processar-reuniao` e
  `/deep-research-cliente` conforme cada etapa avança. Construção do
  posicionamento fica deferida (a Jaquelinne quer detalhar separado).
  Use quando ela disser "novo cliente: [nome]", "fechei a [cliente]",
  "começa o onboarding da [cliente]", "iniciar [cliente] no sistema",
  "estruturar [cliente]".
---

# /onboarding-cliente — Orquestrador do Macro 2

## Contexto e dependências

- **Template de cliente:** `clientes/_modelo-cliente/`
- **Briefing template:** `clientes/_modelo-cliente/briefing.md`
- **Skills sub:** `/processar-reuniao`, `/deep-research-cliente`
- **Tom de voz:** `_contexto/preferencias.md`

Skill **conversacional** — não dispara as sub-skills automaticamente. Em cada estágio, oferece chamar a próxima e a Jaquelinne decide se segue ou pausa.

---

## Workflow

### Passo 1 — Identificar o cliente e tipo

Perguntar (se não veio no comando):

> "Qual o nome do cliente? E é cliente recorrente da agência (tráfego pago + conteúdo + consultoria contínua) ou consultoria pontual (escopo fechado, sem mensalidade longa)?"

### Passo 2 — Criar estrutura

Slugificar o nome (lowercase, hifens, sem acento). Ex: "Lara Garcia" → `lara-garcia`.

Se `clientes/[slug]/` **já existe:**

> "Já tem uma pasta `clientes/[slug]/`. É continuidade desse onboarding ou é cliente diferente com nome parecido? (Se for diferente, posso usar slug `[slug]-2` ou outro nome)"

Se **não existe**, criar:

```bash
cp -r clientes/_modelo-cliente clientes/[slug]
```

Reportar:

```
Criei clientes/[slug]/ com a estrutura padrão:
- briefing.md (template, vazio)
- briefings-peca/ (futuros briefings de peça)
- calendarios/ (calendários editoriais)
- campanhas/ (campanhas de tráfego)
- copy/ (copies aprovadas e revisões)
- pesquisa/ (deep research)
- proposta.html (placeholder pra /proposta-comercial)
- relatorios/ (relatórios de campanha)
- revisoes/ (reviews de peça)
```

### Passo 3 — Formulário de briefing pra mandar pro cliente

Gerar formulário com os campos que o cliente precisa responder (mais leve que o briefing interno — só o que vem do cliente, não o que vem da reunião com Jaquelinne):

Salvar em `clientes/[slug]/formulario-briefing.md` e mostrar pra ela copiar e enviar (Google Form, email, WhatsApp — ela escolhe canal):

```markdown
# Briefing — [Cliente]
*Esse formulário ajuda a Murupi entender teu negócio em profundidade pra estruturar a estratégia certa pra ti.*

## 1. Sobre você e o negócio
- Nome da empresa / marca:
- Site:
- Instagram / outras redes:
- Quanto tempo no mercado:
- Tamanho da operação (pessoas, faturamento aproximado):

## 2. Produto / serviço
- O que você vende (em uma frase):
- Ticket médio:
- Margem aproximada:
- O que torna você diferente da concorrência (na sua opinião):

## 3. Quem compra
- Quem é o seu cliente (perfil, idade, profissão, momento de vida):
- Qual a dor principal que ele resolve com você:
- Como ele te encontra hoje (indicação? Instagram? Google?):
- Quanto tempo da primeira conversa até a venda em média:

## 4. Histórico de marketing
- Já investiu em tráfego pago? Onde, quanto, qual resultado:
- O que funcionou bem:
- O que não funcionou:
- Tem alguma campanha rodando agora:

## 5. Tracking e mensuração
- Tem Google Analytics instalado:
- Tem Pixel do Facebook / Conversion API:
- Tem GTM ou tracking server-side:
- Quais eventos / conversões você acompanha hoje:

## 6. Objetivo
- O que você espera dos próximos 30 dias:
- Próximos 90 dias:
- Indicador principal pra você medir sucesso (faturamento, leads, agendamentos, vendas):

## 7. Restrições
- Concorrentes que NÃO podem aparecer em comparações:
- Tom obrigatório (formal, informal, técnico, afetivo):
- Quem aprova material publicado (você sozinha, sócio, equipe):

## 8. Materiais
- Tem identidade visual definida (manda link):
- Tem fotos profissionais (manda link):
- Tem materiais antigos (apresentação, folder, vídeos):
```

> "Formulário salvo em `clientes/[slug]/formulario-briefing.md`. Cola e manda pro cliente pelo canal que preferir.
>
> Próximo passo é a **reunião de briefing** com o cliente — lembra de gravar (Zoom/Meet têm transcript nativo, ou usa Otter.ai/Granola). Quando terminar, me chama de volta com a transcrição."

### Passo 4 — Pós-reunião: chamar `/processar-reuniao`

Quando a Jaquelinne voltar com a transcrição (ou disser "reunião feita"):

> "Beleza. Vou rodar `/processar-reuniao` pra organizar o que veio da reunião no `briefing.md` da [Cliente]. Cola a transcrição ou me passa o caminho do arquivo."

[Invocar `/processar-reuniao` no fluxo, ou orientar Jaquelinne a chamar `/processar-reuniao [cliente]` se preferir comando explícito]

Após `/processar-reuniao` rodar, voltar pra cá e seguir.

### Passo 5 — Pós-briefing organizado: chamar `/deep-research-cliente`

> "Briefing da [Cliente] organizado. Próximo passo do Macro 2 é a **pesquisa profunda** (mercado + concorrentes + situação atual da [Cliente]) que vai virar a base pro posicionamento.
>
> Quer rodar `/deep-research-cliente` agora ou pausar?"

Se sim, invocar / orientar a chamar.

### Passo 6 — Pós-pesquisa: posicionamento (deferido)

> "Deep research da [Cliente] pronto. O próximo passo seria **construção do posicionamento** — mas esse fluxo a Jaquelinne quer detalhar separado, então deixei deferido por enquanto.
>
> Pra fechar o onboarding por agora:
>
> - **Pasta da [Cliente]:** `clientes/[slug]/`
> - **Formulário enviado:** ✓
> - **Briefing organizado:** ✓
> - **Deep research:** ✓
> - **Posicionamento:** [pendente — fluxo separado]
> - **Kick-off:** [pendente — usar `/slide` quando o posicionamento estiver pronto]
>
> Quando quiser começar a operação prática (calendário, briefings de peça, primeira campanha), as skills `/calendario-editorial`, `/briefing-peca` e `/meta-ads-ratos` já estão prontas."

### Passo 7 — Atualizar checklist no briefing

Adicionar ao topo do `clientes/[slug]/briefing.md` (depois do Status):

```markdown
## Status do onboarding
- [x] Pasta criada
- [x] Formulário enviado
- [x] Reunião de briefing realizada
- [x] Briefing organizado
- [x] Deep research feito
- [ ] Posicionamento construído
- [ ] Kick-off agendado
- [ ] Operação prática iniciada
```

(Marcar conforme cada etapa for completada na sessão atual.)

---

## Modos / variações

### Cliente recorrente (padrão)
Fluxo completo — onboarding longo, foco em estrutura de longo prazo. Pacote contratado define volume da operação.

### Consultoria pontual (escopo fechado)
Pular ou simplificar:
- Pacote/calendário pode ser N/A (sem operação contínua)
- Deep research opcional (depende se o escopo da consultoria precisa)
- Foco em entregar a consultoria com prazo definido

Se cliente é consultoria pontual, perguntar:

> "Consultoria pontual: precisa de deep research completo, ou foco direto no escopo da consultoria? (ex: se é consultoria de funil, talvez só análise do funil atual + concorrentes diretos baste)"

---

## Regras

- **Conversacional, não automático.** Em cada estágio, perguntar se segue. A Jaquelinne pode pausar, voltar dias depois, retomar
- **Slug consistente** — sempre `lowercase-com-hifens-sem-acento`. Se houver conflito (cliente com mesmo nome), oferecer `[slug]-2` ou nome alternativo
- **NÃO sobrescrever pasta de cliente que já existe.** Sempre confirmar antes
- **Reuniao** — sempre lembrar a Jaquelinne de gravar antes (Zoom/Meet têm transcript nativo, Otter, Granola, etc)
- **Posicionamento ainda é deferido** — não tentar construir aqui. Mensagem clara de "fluxo separado, falar com Jaquelinne quando ela quiser detalhar"
- **Status do onboarding** atualiza no briefing do cliente pra ela visualizar de onde parou semanas depois
- Pra **consultoria pontual**, ramificar pro fluxo simplificado. Não rodar Macro 2 inteiro se não faz sentido pro escopo
