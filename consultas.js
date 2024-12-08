const pool = require("./server"); // Importa el pool de server.js

// Función para obtener todos los usuarios
const getUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM Users");
    return result.rows;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error.message);
    throw error;
  }
};

// Función para obtener un usuario por ID
const getUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Users WHERE ID = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error obteniendo usuario:", error.message);
    throw error;
  }
};

// Función para crear un nuevo usuario
const createUser = async (nombre, contrasena, celular, email) => {
  try {
    const result = await pool.query(
      "INSERT INTO Users (Nombre, Contrasena, Celular, Email) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, contrasena, celular, email]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creando usuario:", error.message);
    throw error;
  }
};

// Función para obtener todos los posts
const getPosts = async () => {
  try {
    const result = await pool.query("SELECT * FROM Posts");
    return result.rows;
  } catch (error) {
    console.error("Error obteniendo posts:", error.message);
    throw error;
  }
};

// Función para crear un nuevo post
const createPost = async (titulo, description, precio, userId) => {
  try {
    const result = await pool.query(
      "INSERT INTO Posts (Titulo, Description, Precio, UserID) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, description, precio, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creando post:", error.message);
    throw error;
  }
};

// Exportar todas las funciones
module.exports = {
  getUsers,
  getUserById,
  createUser,
  getPosts,
  createPost,
};
