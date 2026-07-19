const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
const { env } = require('../config/env');

const readSql = async (fileName) => {
  const filePath = path.resolve(__dirname, '..', 'database', fileName);
  return fs.readFile(filePath, 'utf8');
};

const withConfiguredDatabase = (sql) =>
  sql
    .replace(/CREATE DATABASE IF NOT EXISTS fbms/gi, `CREATE DATABASE IF NOT EXISTS \`${env.db.database}\``)
    .replace(/USE fbms/gi, `USE \`${env.db.database}\``);

const seed = async () => {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true
  });

  try {
    const schemaSql = withConfiguredDatabase(await readSql('schema.sql'));
    const seedSql = withConfiguredDatabase(await readSql('seed.sql'));

    await connection.query(schemaSql);
    await connection.query(seedSql);
    console.log(`Seeded ${env.db.database} successfully.`);
  } finally {
    await connection.end();
  }
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
