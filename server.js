const { Pool } = require("pg");

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  allowExitOnIdle: true,
});

module.exports = pool; // Exporta el pool para ser usado en consultas.js