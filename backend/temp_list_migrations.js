const { Client } = require('pg');
const conn = process.env.DATABASE_URL || 'postgres://localhost/postgres';
const client = new Client({ connectionString: conn });
client.connect()
  .then(async () => {
    const res = await client.query('SELECT name FROM "SequelizeMeta"');
    console.log(res.rows);
    await client.end();
  })
  .catch(err => { console.error('Error', err); });
