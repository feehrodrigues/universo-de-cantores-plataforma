const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'feehrodriguesoficial@gmail.com';
  
  console.log(`🔧 Configurando admin para: ${adminEmail}\n`);

  // Buscar ou criar usuário
  let user = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { adminProfile: true },
  });

  if (!user) {
    console.log('📝 Usuário não encontrado. Criando...');
    user = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Felipe Rodrigues',
      },
      include: { adminProfile: true },
    });
    console.log('✅ Usuário criado!');
  } else {
    console.log('✅ Usuário encontrado:', user.name || user.email);
  }

  // Verificar se já é admin
  if (user.adminProfile?.role === 'admin') {
    console.log('\n🎉 Este usuário já é administrador!');
    return;
  }

  // Criar ou atualizar AdminProfile
  await prisma.adminProfile.upsert({
    where: { userId: user.id },
    update: { role: 'admin' },
    create: {
      userId: user.id,
      role: 'admin',
    },
  });

  console.log('\n🎉 Admin configurado com sucesso!');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Role: admin');
  console.log('\nAgora você pode acessar /admin após fazer login com o Clerk.');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
