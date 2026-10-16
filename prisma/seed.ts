import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ===== LIMPAR DADOS ANTERIORES =====
  await prisma.paymentPlan.deleteMany();
  await prisma.contract.deleteMany();
  console.log('✓ Dados anteriores limpos');

  // ===== CRIAR PLANOS DE PAGAMENTO =====
  const plans = await prisma.paymentPlan.createMany({
    data: [
      {
        name: 'Aula Avulsa Online',
        description: 'Uma aula individual online. Ideal para testes.',
        price: 50,
        duration: 'avulsa',
        lessonsIncluded: 1,
        isRecurring: false,
        isActive: true,
      },
      {
        name: 'Aula Avulsa Presencial',
        description: 'Uma aula individual presencial. Ideal para testes.',
        price: 70,
        duration: 'avulsa',
        lessonsIncluded: 1,
        isRecurring: false,
        isActive: true,
      },
      {
        name: 'Plano Mensal Online',
        description: 'Plano de 4 aulas mensais online (R$ 40/aula).',
        price: 160,
        duration: 'mensal',
        lessonsIncluded: 4,
        isRecurring: true,
        isActive: true,
      },
      {
        name: 'Plano Mensal Presencial',
        description: 'Plano de 4 aulas mensais presenciais (R$ 57.50/aula).',
        price: 230,
        duration: 'mensal',
        lessonsIncluded: 4,
        isRecurring: true,
        isActive: true,
      },
      {
        name: 'Programa Belting 3 Meses Online',
        description: 'Curso intensivo de belting: 12 aulas em 3 meses (R$ 37.50/aula).',
        price: 450,
        duration: '3-meses',
        lessonsIncluded: 12,
        isRecurring: false,
        isActive: true,
      },
      {
        name: 'Programa Belting 3 Meses Presencial',
        description: 'Curso intensivo de belting presencial: 12 aulas em 3 meses (R$ 53.33/aula).',
        price: 640,
        duration: '3-meses',
        lessonsIncluded: 12,
        isRecurring: false,
        isActive: true,
      },
    ],
  });

  console.log(`✓ ${plans.count} planos de pagamento criados`);

  // ===== CRIAR CONTRATOS PADRÃO =====
  // precisamos de um usuário no banco para servir como dono dos contratos
  let adminUser = await prisma.user.findUnique({ where: { email: 'admin@universodecantores.com' } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@universodecantores.com',
        name: 'Administrador',
        password: await bcrypt.hash('senha123', 10),
      },
    });
  }

  const termsTemplate = `
TERMOS DE SERVIÇO - UNIVERSO DE CANTORES

Bem-vindo ao Universo de Cantores! Estes termos regulam seu uso da plataforma.

1. ACEITAÇÃO DOS TERMOS
Ao se registrar e utilizar os serviços, você concorda integral e irrevogavelmente com estes termos.

2. RESPONSABILIDADE
O Universo de Cantores fornece aulas de canto profissionais. Você é responsável por fornecer feedback honesto sobre sua experiência.

3. PRESENÇA
As aulas devem ser realizadas com o aluno presente e atento.

4. CANCELAMENTO
Cancelamentos devem ser feitos com no mínimo 24 horas de antecedência.

5. MODIFICAÇÕES
Reservamos o direito de modificar estes termos a qualquer momento. Atualizações serão comunicadas por email.

Data de aceitação: _____________________
Assinatura digital: Confirmada em plataforma
  `;

  const imageRightsTemplate = `
AUTORIZAÇÃO DE DIREITOS DE IMAGEM

Eu, _____________________, autorizo o Universo de Cantores a:

1. Registrar durante minhas aulas (áudio/vídeo) para fins de feedback personalizado.
2. Usar minha voz/imagem em vídeos educacionais (apenas internos na plataforma).
3. Compartilhar progresso (relatórios) com terceiros apenas se eu autorizar explicitamente.

Entendo que:
- Meus dados estão protegidos por LGPD e confidencialidade
- Posso revogar esta autorização a qualquer momento
- Minha privacidade é prioridade

Data: _____________________
Assinatura digital: Confirmada em plataforma
  `;

  const paymentTemplate = `
ACORDO DE PAGAMENTO

Este acordo estabelece os termos de pagamento para aulas no Universo de Cantores.

1. VALOR E PLANO
Plano escolhido: ___________________
Valor total: R$ ___________________
Número de aulas: ___________________

2. FORMA E PRAZO
Pagamento via PIX (chave: recebedor@email.com)
Prazo: ATÉ 24 HORAS ANTES DA AULA

3. CONFIRMAÇÃO
Você deve enviar comprovante do PIX via WhatsApp para confirmação.

4. REEMBOLSO
Reembolsos são permitidos apenas até 48 horas antes da primeira aula.

5. RENOVAÇÃO
Planos mensais renovam-se automaticamente. Cancele com 30 dias de antecedência.

Data: _____________________
Assinatura digital: Confirmada em plataforma
  `;

  const contracts = await prisma.contract.createMany({
    data: [
      {
        userId: adminUser!.id,
        type: 'TERMS_OF_SERVICE',
        title: 'Termos de Serviço',
        content: termsTemplate,
        cancellationPolicy: 'Cancelamento com 24h de antecedência',
        replacementPolicy: 'Reposição dentro de 30 dias',
        latePolicy: 'Aula inicia na hora; atraso não estende',
        prepaymentPolicy: 'PIX até 24h antes da aula',
        imageRightsConsent: true,
        lgpdConsent: true,
      },
      {
        userId: adminUser!.id,
        type: 'IMAGE_RIGHTS',
        title: 'Autorização de Direitos de Imagem',
        content: imageRightsTemplate,
        imageRightsConsent: true,
        lgpdConsent: true,
      },
      {
        userId: adminUser!.id,
        type: 'PAYMENT_AGREEMENT',
        title: 'Acordo de Pagamento',
        content: paymentTemplate,
        cancellationPolicy: 'Sem reembolso após 48h da compra',
        prepaymentPolicy: 'PIX até 24h antes da aula',
        lgpdConsent: true,
      },
    ],
  });

  console.log(`✓ ${contracts.count} contratos criados`);

  // caso queira rodar novamente com dados de teste, talvez crie um usuário admin
  // para vincular aos contratos padrão. Para simplificar, aqui já criamos
  // um admin caso não exista e usamos seu id nos templates.

  // ===== DADOS DE TESTE (Opcional) =====
  console.log('\n💡 Para criar um aluno de teste, execute:');
  console.log(`
    const user = await prisma.user.create({
      data: {
        email: 'aluno@test.com',
        name: 'Aluno Teste',
        password: '<bcrypt hash aqui>',
        role: 'USER',
        studentProfile: {
          create: {
            overallGoal: 'Aprender belting',
            generalGoal: 'Aprender belting',
            vocalHistory: 'iniciante',
            lessonBalance: 4,
          },
        },
      },
      include: { studentProfile: true },
    });
  `);

  console.log('\n✨ Seed concluído com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro durante seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
