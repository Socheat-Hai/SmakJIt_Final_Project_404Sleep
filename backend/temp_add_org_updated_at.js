require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
(async () => {
  try {
    await client.connect();
    await client.query('ALTER TABLE "Organization" ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
    console.log('added updated_at to Organization');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await client.end();
  }
})();
