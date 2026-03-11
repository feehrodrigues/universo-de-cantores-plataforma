# 🔬 REFERÊNCIA TÉCNICA - UNIVERSO DE CANTORES v2.0

## Schema Prisma: Fluxo de Dados e Agregações

---

## 1. ESTRUTURA DE DADOS (Models Principais)

### **User** (Base de autenticação)
```
User
├─ id, email, name, passwordHash
├─ role: USER | ADMIN
├─ phone (para contato WhatsApp)
└─ Relations:
   ├─ studentProfile (1-to-1)
   └─ adminProfile (1-to-1)
```

### **StudentProfile** (Perfil do aluno)
```
StudentProfile
├─ userId (FK)
├─ overallGoal (Objetivo geral do aluno)
├─ monthlyGoal (Objetivo do mês atual)
├─ lessonsBalance (Aulas não agendadas)
├─ acceptedTerms, imageRights (Contratos)
└─ Relations:
   ├─ classes → Class[]
   ├─ purchases → ClassPurchase[]
   ├─ contracts → Contract[]
   ├─ monthlyPlans → MonthlyLessonPlan[]
   └─ vocalProfiles → VocalProfile[] (Snapshots mensais)
```

### **Class** (Aula)
```
Class
├─ studentId (FK)
├─ professorId (FK - você, Felipe)
├─ scheduledAt (DateTime)
├─ status: SCHEDULED | ONGOING | COMPLETED | CANCELLED
├─ type: INDIVIDUAL_ONLINE | INDIVIDUAL_PRESENCIAL | GROUP_*
├─ isPaid, paymentDeadline (24h antes)
├─ jitsiRoomId (ID gerado para cada aula)
└─ Relations:
   ├─ preBriefing → PreClassBriefing? (1-to-1)
   └─ report → ClassReport? (1-to-1)
```

### **PreClassBriefing** (Formulário pré-aula)
```
PreClassBriefing
├─ classId (FK - unique)
├─ difficulties (String - Dificuldades do aluno)
├─ musicalTastes (String - Gostos musicais)
├─ selectedSong (String - Música para a aula)
├─ classGoal (String - Objetivo da aula)
├─ filledByStudent (Boolean)
└─ filledByProfessor (Boolean)
```

### **ClassReport** (Relatório pós-aula)
```
ClassReport
├─ classId (FK - unique)
├─ Relatório qualitativo:
│  ├─ howWasTheClass
│  ├─ studentDevelopment
│  ├─ vocalObservations
│  └─ technicalEvolution
├─ Plano futuro:
│  ├─ homeExercises
│  ├─ nextClassGoals
│  ├─ suggestedRepertoire
│  └─ improvementPlan
└─ Relations (1-to-1):
   ├─ structureEval → StructureEvaluation?
   ├─ modelingEval → ModelingEvaluation?
   └─ expressionEval → ExpressionEvaluation?
```

---

## 2. AVALIAÇÕES E.M.E. (Escala 1-10)

### **StructureEvaluation** (Dimensão Estrutura)

**Componentes avaliados (cada um 1-10):**

```
1. SUPORTE RESPIRATÓRIO
   ├─ posturCorrect (Postura: esterno, ombro, nuca)
   ├─ intercostalBreathing (Respiração intercostal)
   ├─ subglotticControl (Controle pressão subglótica)
   └─ contraSupport (Contra-apoio)

2. FECHAMENTO / ADUÇÃO
   ├─ glotticBalance (Equilíbrio glótico)
   ├─ vocalAttacks (Ataques vocais)
   └─ sourceFlowBalance (Binômio fonte-fluxo)

3. REGISTROS VOCAIS
   ├─ taCtBalance (Equilíbrio TA/CT)
   ├─ registerTransition (Troca de registros)
   ├─ vocalBreakReduction (Redução quebra)
   ├─ midRegisterStability (Estabilidade registro médio)
   ├─ denseRegister (Registro denso)
   └─ tenueRegister (Registro tênue)

4. ESTABILIDADE LARÍNGEA
   └─ laryngealStability (Controle STD, abaixamento)

5. REDUÇÃO DE COMPENSAÇÕES
   ├─ tongueRelaxation (Relaxamento língua)
   ├─ neckRelaxation (Relaxamento pescoço)
   └─ jawControl (Controle mandíbula)

**NOTA FINAL (finalGrade):**
   = Média aritmética de todos os componentes (1-10)
```

### **ModelingEvaluation** (Dimensão Modelagem)

**Componentes avaliados (cada um 1-10):**

```
1. AJUSTE DO TRATO VOCAL
   ├─ laryngopharynx
   ├─ oropharynx
   ├─ nasopharynx
   ├─ oralCavity
   ├─ nasalCavity
   └─ vocalTractIsonomy

2. EFICIÊNCIA FONTE-FILTRO
   ├─ sourceFilterBalance
   ├─ articulationLevel
   ├─ filterAdjustment
   └─ sourceAdjustment

3. DICÇÃO
   ├─ vowelArticulation
   ├─ consonantPrecision
   └─ naturalArticulation

4. TIMBRE
   ├─ chiarascuroBalance
   └─ timbreConsistency

**NOTA FINAL (finalGrade):**
   = Média aritmética de todos os componentes (1-10)
```

### **ExpressionEvaluation** (Dimensão Expressão)

**Componentes avaliados (cada um 1-10):**

```
1. INTERPRETAÇÃO
   ├─ artisticIdentity
   ├─ keyWords
   ├─ intentionalAdjustments
   ├─ musicalIntelligence
   └─ vocalStyle

2. REPERTÓRIO
   └─ repertoireChoice

3. COERÊNCIA ARTÍSTICA
   ├─ musicalConsistency
   ├─ vocalConsistency
   └─ stylisticConsistency

**NOTA FINAL (finalGrade):**
   = Média aritmética de todos os componentes (1-10)
```

---

## 3. COMO FUNCIONA O FLUXO DE DADOS

### **Aula 1 (Avaliação Inicial)**

```
1. Aluno agenda aula
   └─ Class criada (status: SCHEDULED)

2. Pré-aula (opcional)
   └─ PreClassBriefing preenchida (aluno ou professor)

3. Durante aula
   └─ Jitsi integrado
   └─ Class.status = ONGOING

4. Pós-aula (até 12h após)
   └─ Professor preenche ClassReport
      ├─ Qual foi a aula (narrativa)
      ├─ Como foi desenvolvimento (narrativa)
      ├─ Cada componente E.M.E. (escala 1-10)
      │  └─ Sistema **calcula automaticamente** finalGrade para cada dimensão
      │
      └─ Plano futuro (exercícios, metas)

5. Dashboard do aluno
   └─ Vê relatório completo
   └─ Vê as 3 notas finais (Estrutura, Modelagem, Expressão em 1-10)
   └─ Começa a construir histórico
```

### **Aulas 2+ (Evolução)**

```
1. Professor preenche novo relatório
   └─ Novo StructureEvaluation, ModelingEvaluation, ExpressionEvaluation

2. VocalProfile (Snapshot Mensal)
   └─ Todo mês, agregação automática:
      ├─ structureGrade = Média de Estrutura do mês
      ├─ modelingGrade = Média de Modelagem do mês
      └─ expressionGrade = Média de Expressão do mês

3. Dashboard de Evolução (Aluno)
   └─ Vê timeline:
      ├─ Aula 1: Estrutura 4, Modelagem 5, Expressão 3
      ├─ Aula 2: Estrutura 5, Modelagem 5, Expressão 4
      ├─ Aula 3: Estrutura 6, Modelagem 6, Expressão 4
      └─ Padrão visual de progresso
```

---

## 4. CALCULO AUTOMÁTICO DAS NOTAS FINAIS

**Quando você salva um relatório, o backend DEVE calcular:**

```typescript
// Exemplo: StructureEvaluation
const components = [
  posturCorrect,
  intercostalBreathing,
  subglotticControl,
  contraSupport,
  glotticBalance,
  vocalAttacks,
  sourceFlowBalance,
  taCtBalance,
  registerTransition,
  vocalBreakReduction,
  midRegisterStability,
  denseRegister,
  tenueRegister,
  laryngealStability,
  tongueRelaxation,
  neckRelaxation,
  jawControl
].filter(c => c !== null && c !== undefined);

const finalGrade = Math.round(
  components.reduce((a, b) => a + b, 0) / components.length
);

// Salva em StructureEvaluation.finalGrade
```

**Mesmo para ModelingEvaluation e ExpressionEvaluation!**

---

## 5. DASHBOARD DE EVOLUÇÃO (PowerBI-like)

### **Dados que alimentam o dashboard:**

```
GET /api/student/[studentId]/evolution

Response:
{
  "student": { ... },
  "currentMonth": {
    "year": 2024,
    "month": 2,
    "classes": 3,
    "structureAvg": 5.2,
    "modelingAvg": 5.8,
    "expressionAvg": 4.1
  },
  "lastThreeMonths": [
    { month: 12, year: 2023, structureAvg: 4.0, modelingAvg: 4.5, expressionAvg: 3.2 },
    { month: 1, year: 2024, structureAvg: 4.5, modelingAvg: 5.0, expressionAvg: 3.8 },
    { month: 2, year: 2024, structureAvg: 5.2, modelingAvg: 5.8, expressionAvg: 4.1 }
  ],
  "allReports": [
    {
      classId: "...",
      date: "2024-02-28",
      structure: 5,
      modeling: 6,
      expression: 4,
      components: {
        "posturCorrect": 6,
        "intercostalBreathing": 5,
        "glotticBalance": 4,
        ...
      }
    },
    ...
  ],
  "trends": {
    "structure": "↑ +1.2 no mês",
    "modeling": "↑ +1.3 no mês",
    "expression": "→ Estável"
  }
}
```

### **Visualizações (Frontend):**

```
┌─────────────────────────────────────────────┐
│ SEU PROGRESSO VOCAL                         │
├─────────────────────────────────────────────┤
│                                             │
│ 📊 RADAR E.M.E. (Últimas 3 Aulas)           │
│     Estrutura: 5 → 6 → 6 (↑ +1)            │
│     Modelagem: 5 → 6 → 6 (↑ +1)            │
│     Expressão: 4 → 4 → 5 (↑ +1)            │
│                                             │
│ 📈 GRÁFICO DE LINHA (Últimos 3 meses)       │
│     Estrutura  ╱╱               (linha azul)│
│     Modelagem ╱╱                (linha roxa)│
│     Expressão ╱                 (linha rosa)│
│                                             │
│ 🔍 FILTRADOS POR COMPONENTE                 │
│     Apenas Estrutura                   [✓] │
│     ├─ Suporte Respiratório: 5 → 6 [↑]   │
│     ├─ Fechamento: 4 → 5 [↑]             │
│     ├─ Registros: 5 → 6 [↑]              │
│     ├─ Estabilidade Laríngea: 6 → 6 [=] │
│     └─ Compensações: 5 → 5 [=]           │
│                                             │
│ 📋 DETALHES DA AULA (28/02/2024)           │
│     Estrutura: 6/10                        │
│     Modelagem: 6/10                        │
│     Expressão: 5/10                        │
│     Como foi: "Aula muito produtiva..."    │
│     Próximos passos: "Trabalhar agudos..." │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 6. PAGAMENTO E PLANOS

### **PaymentPlan** (Opções disponíveis)
```
┌─ Aula Avulsa Online (R$ 50)
├─ Aula Avulsa Presencial (R$ 70)
├─ Plano Mensal Online (R$ 160)
├─ Plano Mensal Presencial (R$ 230)
├─ Programa Belting 3M Online (R$ 450)
└─ Programa Belting 3M Presencial (R$ 640)
```

### **ClassPurchase** (Compra do aluno)
```
Aluno compra: Plano Mensal Online (R$ 160, 4 aulas)
└─ ClassPurchase criada
   ├─ lessonsRemaining: 4
   ├─ isPaid: false
   ├─ paymentDeadline: 24h antes de primeira aula
   ├─ pixReference: (Você coloca depois que recebe PIX)
   └─ status: PENDING → ACTIVE → EXPIRED
```

---

## 7. FLUXO DE CONTATO (Lead Gen)

### **ContactLead** (Formulário na Home)

```
Público preenche:
├─ Nome
├─ Email
├─ Telefone
├─ Mensagem
└─ Interesse em: "Aula avulsa", "Plano mensal", etc

├─ ContactLead criada (status: NEW)
└─ Você vê no /admin/leads

Depois você marca:
├─ CONTACTED (Respondeu via WhatsApp)
├─ CONVERTED (Virou aluno)
└─ REJECTED (Não tem interesse)
```

---

## 8. CONTRATOS

### **Contract** (Documentos digitais)

```
Tipos:
├─ TERMS_OF_SERVICE (Termos gerais)
├─ IMAGE_RIGHTS (Direitos de imagem)
└─ PAYMENT_AGREEMENT (Acordo de pagamento)

Aluno DEVE aceitar todos antes de primeira aula.
```

---

## 9. PLANO MENSAL E PERFIL VOCAL

### **MonthlyLessonPlan** (Estratégia pedagógica do mês)
```
Janeiro 2024:
├─ monthlyGoal: "Melhorar agudos e controle de belting"
├─ lessonsPlanned: 4
└─ strategy: "Semana 1-2: estrutura. Semana 3-4: projeção"
```

### **VocalProfile** (Snapshot agregado do mês)
```
Janeiro 2024:
├─ structureGrade: 5.2 (Média de 4 aulas: 5+5+5+5.8)
├─ modelingGrade: 5.5 (Média de 4 aulas: 5+5+6+6)
├─ expressionGrade: 4.3 (Média de 4 aulas: 4+4+4+5)
└─ totalClassesDone: 4
```

---

## 10. INTEGRAÇÃO JITSI

### **Fluxo de Aula ao Vivo**

```
1. Aluno entra em /aula/[classId] (24h antes, classe aparece bloqueada)

2. 15min antes da aula:
   └─ Botão "ENTRAR NA SALA" fica disponível
   └─ Countdown visual (15:00 → 00:00)

3. Aluno clica "ENTRAR"
   └─ Jitsi abre em fullscreen/modal
   └─ Class.status = ONGOING
   └─ Class.jitsiRoomId = `class-${classId}`

4. Jitsi configurado com:
   ├─ Desabilitar chat público (apenas você e aluno)
   ├─ Desabilitar screenshare (apenas vídeo/áudio)
   ├─ Mostrar duração total (ex: 60min)
   ├─ Sempre gravado (opcional, depende de GDPR)
   └─ Tema: Dark mode com roxo/ciano

5. Aluno sai da sala
   └─ Class.status = COMPLETED
   └─ Redireciona para página "Obrigado!"
   └─ Shows: "Seu relatório estará pronto em até 12h"

6. Você (professor) preenche relatório
   └─ ClassReport criada com E.M.E. detalhado
   └─ Aluno recebe email: "Seu relatório está pronto!"
```

---

## 11. APIs QUE PRECISAM SER CRIADAS

```
// Autenticação
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

// Público (Lead)
POST   /api/contact-leads

// Aluno (autenticado)
GET    /api/student/dashboard
GET    /api/student/classes
GET    /api/student/evolution
GET    /api/student/reports/[reportId]
POST   /api/student/briefing/[classId]

// Professor (admin)
GET    /api/admin/students
GET    /api/admin/students/[studentId]
GET    /api/admin/classes
GET    /api/admin/classes/[classId]/briefing
POST   /api/admin/classes/[classId]/report
PATCH  /api/admin/classes/[classId]/payment
GET    /api/admin/leads
PATCH  /api/admin/leads/[leadId]

// Jitsi
GET    /api/jitsi/token/[classId]
```

---

## 12. PRÓXIMOS PASSOS

✅ **DONE:** Schema Prisma 100% completo
⏳ **TODO:** Criar seed data (PaymentPlans, Contracts)
⏳ **TODO:** Criar APIs (Backend)
⏳ **TODO:** Criar UI/Páginas (Frontend)
⏳ **TODO:** Integrar Jitsi
⏳ **TODO:** Dashboard de Evolução (PowerBI-like)

---

**Desenvolvido por:** Co-Founder Técnico  
**Data:** Março 2024  
**Status:** Pronto para desenvolvimento
