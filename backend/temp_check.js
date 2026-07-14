const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL || 'postgres://localhost/postgres' });
client.connect()
  .then(async () => {
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
    console.log(res.rows);
    await client.end();
  })
  .catch(err => console.error(err));
