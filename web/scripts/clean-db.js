const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Limpando TODAS as contas do banco...');
  
  // Limpar na ordem certa (por causa de foreign keys)
  const deletedSP = await prisma.studentProfile.deleteMany({});
  const deletedAP = await prisma.adminProfile.deleteMany({});
  const deletedUsers = await prisma.user.deleteMany({});
  
  console.log('StudentProfiles deletados:', deletedSP.count);
  console.log('AdminProfiles deletados:', deletedAP.count);
  console.log('Usuarios deletados:', deletedUsers.count);
  console.log('');
  console.log('🎉 Banco limpo! Todas as contas foram removidas.');
  console.log('');
  console.log('Agora:');
  console.log('1. Acesse http://localhost:3000/setup');
  console.log('2. Faça login com sua conta Google');
  console.log('3. Clique em "Tornar-se Admin"');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
