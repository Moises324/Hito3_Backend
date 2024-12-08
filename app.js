const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const consultas = require("./consultas"); 
const { authenticateToken, login, register } = require("./auth");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/register", register);

app.post("/login", login);

app.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await consultas.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
});

app.get("/users/:id", authenticateToken, async (req, res) => {
  try {
    const user = await consultas.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
});

app.get("/posts", authenticateToken, async (req, res) => {
  try {
    const posts = await consultas.getPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo posts" });
  }
});

app.post("/posts", authenticateToken, async (req, res) => {
  const { titulo, description, precio, userId } = req.body;
  try {
    const newPost = await consultas.createPost(titulo, description, precio, userId);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Error creando post" });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});



