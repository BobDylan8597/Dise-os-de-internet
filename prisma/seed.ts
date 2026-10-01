import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  console.log('🗑️  Datos anteriores eliminados');

  const tenant1 = await prisma.tenant.create({
    data: { name: 'Tech Solutions' },
  });
  const tenant2 = await prisma.tenant.create({
    data: { name: 'Marketing Pro' },
  });
  const tenant3 = await prisma.tenant.create({
    data: { name: 'Consulting Exp' },
  });
  console.log('🏢 Tenants creados');

  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@test.com',
        name: 'Admin',
        password: passwordHash,
        telephone: '123456789',
        role: 'ADMIN',
        tenantId: tenant1.id,
      },
      {
        email: 'ana@test.com',
        name: 'Ana',
        password: passwordHash,
        telephone: '987654321',
        role: 'USER',
        tenantId: tenant1.id,
      },
      {
        email: 'luis@test.com',
        name: 'Luis',
        password: passwordHash,
        role: 'USER',
        tenantId: tenant2.id,
      },
      {
        email: 'maria@test.com',
        name: 'María',
        password: passwordHash,
        role: 'USER',
        tenantId: tenant3.id,
      },
    ],
  });
  console.log('👤 Usuarios creados');
  console.log('✅ Seed completado con éxito');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });