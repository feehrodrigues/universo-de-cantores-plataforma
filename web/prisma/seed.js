const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // ===== CRIAR PLANOS DE PAGAMENTO =====
    console.log('\n📋 Criando planos de pagamento...');
    
    await prisma.paymentPlan.createMany({
      data: [
        {
          name: 'Aula Avulsa Online',
          description: 'Aula individual online, ideal para teste.',
          price: 50,
          duration: 'avulsa',
          lessonsIncluded: 1,
          isRecurring: false,
          isActive: true,
          validityDays: 30,
        },
        {
          name: 'Aula Avulsa Presencial',
          description: 'Aula individual presencial, ideal para teste.',
          price: 70,
          duration: 'avulsa',
          lessonsIncluded: 1,
          isRecurring: false,
          isActive: true,
          validityDays: 30,
        },
        {
          name: 'Plano Mensal Online',
          description: 'Plano 4 aulas mensais online (R$ 40/aula).',
          price: 160,
          duration: 'mensal',
          lessonsIncluded: 4,
          isRecurring: true,
          isActive: true,
          validityDays: 30,
        },
        {
          name: 'Plano Mensal Presencial',
          description: 'Plano 4 aulas mensais presenciais (R$ 57,50/aula).',
          price: 230,
          duration: 'mensal',
          lessonsIncluded: 4,
          isRecurring: true,
          isActive: true,
          validityDays: 30,
        },
        {
          name: 'Programa Belting 3 Meses Online',
          description: 'Curso intensivo de belting 12 aulas em 3 meses (R$ 37,50).',
          price: 450,
          duration: '3-meses',
          lessonsIncluded: 12,
          isRecurring: false,
          isActive: true,
          validityDays: 90,
        },
        {
          name: 'Programa Belting 3 Meses Presencial',
          description: 'Curso belting presencial 12 aulas em 3 meses (R$ 53,33).',
          price: 640,
          duration: '3-meses',
          lessonsIncluded: 12,
          isRecurring: false,
          isActive: true,
          validityDays: 90,
        },
      ],
      skipDuplicates: true,
    });

    console.log('✓ 6 planos de pagamento criados');

    // ===== CRIAR CONTRATOS PADRÃO =====
    console.log('\n📋 Criando contratos padrão...');
    
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

5. REPOSIÇÃO
A reposição de aulas deve ser solicitada em até 30 dias.

6. ATRASO
A aula inicia na hora marcada; atrasos não estendem a duração.

7. PAGAMENTO ANTECIPADO
Pagamento via PIX até 24h antes da aula. Não há reembolso após 48h da compra.

8. IMAGEM
Ao concordar você autoriza uso de imagem e voz para fins pedagógicos.

9. LGPD
Seus dados estão protegidos e podem ser excluídos mediante solicitação.

10. OUTROS
Reservamos o direito de modificar os termos. Atualizações serão comunicadas por email.
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
`;

    await prisma.contract.createMany({
      data: [
        {
          type: 'TERMS_OF_SERVICE',
          title: 'Termos de Serviço',
          content: termsTemplate,
          cancellationPolicy: 'Cancelamento com 24h de antecedência',
          replacementPolicy: 'Reposição dentro de 30 dias',
          latePolicy: 'Aula inicia na hora; atraso não estende',
          prepaymentPolicy: 'PIX até 24h antes da aula',
          imageRightsConsent: true,
          lgpdConsent: true,
          expiresAt: new Date('2099-12-31'),
        },
        {
          type: 'IMAGE_RIGHTS',
          title: 'Autorização de Direitos de Imagem',
          content: imageRightsTemplate,
          imageRightsConsent: true,
          lgpdConsent: true,
          expiresAt: new Date('2099-12-31'),
        },
        {
          type: 'PAYMENT_AGREEMENT',
          title: 'Acordo de Pagamento',
          content: paymentTemplate,
          cancellationPolicy: 'Sem reembolso após 48h da compra',
          prepaymentPolicy: 'PIX até 24h antes da aula',
          lgpdConsent: true,
          expiresAt: new Date('2099-12-31'),
        },
      ],
      skipDuplicates: true,
    });

    console.log('✓ contratos padrão criados');

    console.log('\n✨ Seed concluído com sucesso!');
    console.log('\n📊 Dados criados:');
    console.log('  - 6 Planos de Pagamento');
    console.log('  - 3 Contratos Padrão');
    console.log('\n🎯 Próximos passos:');
    console.log('  1. Criar APIs para CRUD de aulas');
    console.log('  2. Criar páginas de interface (frontend)');
    console.log('  3. Integrar Jitsi Meet');
    console.log('  4. Criar dashboard de evolução');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
