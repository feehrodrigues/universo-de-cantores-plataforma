# STATUS.md

> Documento vivo. Atualizar sempre que algo mudar.
> Última atualização: [16/10/2026]

---

## O que é o Universo de Cantores

Plataforma educacional para cantores e ministérios de louvor. Tem duas grandes áreas:

**PARTE A — Acervo (funciona em produção)**
- Blog com comentários moderados
- Kits de ensaio com divisão de vozes
- Cantatas (coleções de kits)
- Login/Cadastro via Clerk
- Área de doação (PIX e PayPal)
- Conteúdo gerenciado no Sanity CMS

**PARTE B — Plataforma de aulas (em construção, não usável ainda)**
- Aluno agenda aula
- Aluno preenche briefing pré-aula
- Aula acontece via Jitsi
- Professor escreve relatório com avaliação E.M.E
- Aluno vê evolução vocal com gráficos
- Pagamento PIX manual (sem API)

---

## Stack Técnica

| Camada | Tecnologia | Onde |
|---|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript | `web/` |
| Estilo | Tailwind CSS 4 | `web/` |
| CMS | Sanity | raiz |
| Banco | PostgreSQL + Prisma | `web/prisma/` |
| Auth | Clerk | `web/` |
| Vídeo | Jitsi Meet | `web/` |
| Email | Brevo | `web/lib/email.ts` |
| Deploy | Netlify | `netlify.toml` |
| Domínio | `universodecantores.com.br` | externo |

---

## ✅ O que FUNCIONA hoje

- **Login/Cadastro** — via Clerk, funcionando
- **Kits** — visualização, busca, filtro
- **Cantatas** — visualização
- **Blog** — visualização, comentários (com moderação)
- **Admin** — consegue entrar, marcar pagamento como pago
- **Teacher** — consegue entrar, ver painel
- **Sanity** — publicar/editar conteúdo funciona (kits, blog, cantatas)
- **Deploy** — Netlify builda e publica sem erro

---

## ❌ O que NÃO funciona / está incompleto

### 🔴 Crítico

**1. Nome do aluno aparece como "Usuário"** em várias telas
- Aparece em `/teacher/dashboard`, `/admin`, dashboards
- Causa: bug de sincronização entre Clerk e Prisma
- Afeta: TUDO que depende do nome do aluno

**2. Aluno NÃO consegue agendar aula pelo site**
- Hoje o fluxo é manual: aluno manda WhatsApp, você cria aula no `/teacher`
- Falta: interface de agendamento para o aluno
- Falta: notificação para o professor quando o aluno agenda

### 🟠 Importante

**3. Dashboard admin é pobre**
- Só mostra lista de aulas e botão de "marcar pago"
- Falta: gestão de usuários em massa, filtros, relatórios, cadastro de planos

**4. Fluxo de agendamento pelo professor é confuso**
- Não mostra os horários disponíveis
- Não conecta com a agenda

### 🟡 Decisões pendentes (não são bugs)

**5. Kits não têm material para download**
- Decisão: link do Google Drive por kit (Opção A) ou upload no Sanity (Opção B)?
- Recomendação: Google Drive por enquanto (mais simples, sem custo)

**6. Pagamento NÃO usa API** (decisão consciente)
- PIX manual: aluno paga, você marca como pago no admin
- **Não implementar API de pagamento** (custo, complexidade, taxas)
- Escala até ~100 alunos tranquilo

### 🟢 Menor

**7. Performance** (problemas conhecidos, não urgentes)
- Clerk carrega em todas as páginas (mesmo públicas)
- Fontes do Google via `@import` (bloqueia render)
- Ícone foi otimizado ✅
- Logo foi otimizado ✅

**8. Segurança**
- Middleware não valida role (`/admin`, `/teacher` abertos para qualquer logado)
- Webhook do Clerk sem verificação de assinatura
- Rate limiting ausente nas APIs

**9. Manutenção**
- Falta documentação por arquivo
- Falta README de verdade
- Falta `docs/` com arquitetura

---

## 🗺️ Roadmap Priorizado

### 🎯 Fase 1 — Consertar nome do aluno (raiz de tudo)
**O que:** descobrir por que aparece "Usuário" em vez do nome
**Esforço:** 1-2h
**Impacto:** destrava todo o resto

### 🎯 Fase 2 — Aluno agenda aula pelo site
**O que:** aluno escolhe horário, professor recebe solicitação
**Esforço:** 1-2 dias
**Impacto:** libera seu tempo (fim do WhatsApp manual)

### 🎯 Fase 3 — Dashboard admin decente
**O que:** listar usuários, filtros, criar planos, relatórios
**Esforço:** 1-2 dias
**Impacto:** você gerencia sem se perder

### 🎯 Fase 4 — Melhorar seu próprio trabalho (Parte A)
**O que:** você precisa definir. Publicar kit mais fácil? Blog mais rápido?
**Esforço:** depende
**Impacto:** sua produtividade

### 🎯 Fase 5 — Performance e limpeza
**O que:** Clerk só onde precisa, fontes via next/font, cache
**Esforço:** 1 dia
**Impacto:** site rápido

### 🎯 Fase 6 — Segurança e documentação
**O que:** middleware com role, rate limit, README, docs
**Esforço:** 2-3 dias
**Impacto:** sustentabilidade

---

## 🎨 Decisões já tomadas

- **Não usar API de pagamento.** PIX manual é suficiente.
- **Conteúdo no Sanity**, não no banco. Banco só para dados de usuário/aula/pagamento.
- **Clerk** para autenticação (não NextAuth).
- **Jitsi** para videochamada (não Zoom, Meet, etc).

---

## 📌 Próximo passo

**Fase 1:** consertar o bug do "Usuário" aparecendo no lugar do nome do aluno.

