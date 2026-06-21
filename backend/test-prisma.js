require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

console.log("PrismaClient created");

prisma.$connect()
  .then(() => {
    console.log("Connected to PostgreSQL!");
  })
  .catch((err) => {
    console.log(err);
  });