const mysql = require('mysql2/promise');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
  });

  await connection.execute('CREATE DATABASE IF NOT EXISTS hello_world_project');
  console.log('Database created successfully');
  await connection.end();
}

createDatabase().catch(console.error);
