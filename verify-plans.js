const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const plans = await prisma.paymentPlan.findMany();
    
    console.log('💰 PLANOS DE PAGAMENTO CRIADOS:');
    console.log('');
    
    plans.forEach((plan, idx) => {
      console.log(`  ${idx + 1}. ${plan.name}`);
      console.log(`     Preço: R$ ${plan.price}`);
      console.log(`     Aulas: ${plan.lessonsIncluded}`);
      console.log(`     Duração: ${plan.duration}`);
      console.log('');
    });
    
    console.log(`✅ TOTAL: ${plans.length} planos criados`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
