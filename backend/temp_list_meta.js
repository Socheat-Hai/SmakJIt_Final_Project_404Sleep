require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
(async () => {
  try {
    await client.connect();
    const res = await client.query('SELECT name FROM "SequelizeMeta" ORDER BY name');
    console.log(res.rows.map(r=>r.name));
  } finally { await client.end(); }
})();
