require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
(async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Organization'");
    console.log('Org columns:', res.rows.map(r=>r.column_name));
  } finally { await client.end(); }
})();
