const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const models = [
  'user',
  'studentProfile',
  'adminProfile',
  'paymentPlan',
  'classPurchase',
  'contract',
  'class',
  'preClassBriefing',
  'classReport',
  'structureEvaluation',
  'modelingEvaluation',
  'expressionEvaluation',
  'vocalProfile',
  'monthlyLessonPlan',
  'contactLead'
];

console.log('🔍 Verificando Prisma Client Models:');
console.log('');

models.forEach(model => {
  const exists = prisma[model] !== undefined;
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${model}`);
});

console.log('');
console.log(`✨ Total de models verificados: ${models.length}`);
