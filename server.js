const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  allowExitOnIdle: true,
});

// Ejemplo de ruta
app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en Puerto{port}`);
});
