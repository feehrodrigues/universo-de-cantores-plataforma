const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTables() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public'
      ORDER BY table_name
    `;
    console.log('\n📊 TABELAS NO BANCO DE DADOS:');
    tables.forEach(t => console.log(`  - ${t.table_name}`));
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
