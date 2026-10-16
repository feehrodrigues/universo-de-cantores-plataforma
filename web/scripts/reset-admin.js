const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Limpando admins para permitir setup...');
  
  // Deletar todos os AdminProfiles
  const deleted = await prisma.adminProfile.deleteMany({});
  console.log(`Deletados ${deleted.count} perfis de admin.`);
  
  console.log('');
  console.log('✅ Pronto! Agora você pode:');
  console.log('1. Acessar http://localhost:3000/setup');
  console.log('2. Fazer login com seu email');
  console.log('3. Clicar em "Tornar-se Admin"');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
