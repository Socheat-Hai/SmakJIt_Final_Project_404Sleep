require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
console.log('PrismaClient created successfully');

prisma.$connect()
  .then(() => console.log('Connected to database!'))
  .catch(e => console.log('Error:', e.message.substring(0, 200)))
  .finally(() => prisma.$disconnect());
