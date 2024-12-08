const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const consultas = require("./consultas");  // Importa las consultas para interactuar con la base de datos

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";  // Clave secreta para firmar el token JWT

// Función para autenticar a un usuario e iniciar sesión
const login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await consultas.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Comparar la contraseña con la almacenada en la base de datos (encriptada)
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Si la autenticación es exitosa, generar el token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },  // Información que queremos incluir en el token
      JWT_SECRET,  // La clave secreta para firmar el token
      { expiresIn: "1h" }  // El token expirará en 1 hora
    );

    // Devolver el token al cliente
    res.json({ token });
  } catch (error) {
    console.error("Error al autenticar usuario:", error.message);
    res.status(500).json({ error: "Error en la autenticación" });
  }
};

// Middleware para verificar si el usuario está autenticado (verificación del token)
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");  // Extraer el token del encabezado Authorization

  if (!token) {
    return res.status(403).json({ error: "Acceso denegado. No hay token." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // Verificar y decodificar el token
    req.user = decoded;  // Guardar los datos decodificados en `req.user`
    next();  // Continuar con la ejecución de la siguiente función (ruta)
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Función para registrar un nuevo usuario
const register = async (req, res) => {
  const { nombre, contrasena, celular, email } = req.body;

  try {
    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(contrasena, 10);  // Encriptar con un 'salt' de 10 rondas

    // Crear el nuevo usuario en la base de datos
    const newUser = await consultas.createUser(nombre, hashedPassword, celular, email);

    // Devolver el usuario creado (sin la contraseña)
    res.status(201).json({
      id: newUser.id,
      nombre: newUser.nombre,
      celular: newUser.celular,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

module.exports = { login, authenticateToken, register };  // Exportar las funciones para ser usadas en app.js
