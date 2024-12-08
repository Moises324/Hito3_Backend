const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const auth = require("./auth");  // Importa las funciones de autenticación

dotenv.config(); // Cargar las variables de entorno desde .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para registrar un nuevo usuario
app.post("/register", auth.register);  // Usamos la función `register` desde auth.js

// Ruta para iniciar sesión y generar el JWT
app.post("/login", auth.login);  // Usamos la función `login` desde auth.js

// Ruta protegida
app.get("/protected", auth.authenticateToken, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


