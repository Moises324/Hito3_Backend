const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const consultas = require("./consultas");  

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";  

const login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await consultas.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },  
      JWT_SECRET,  
      { expiresIn: "1h" } 
    );

    res.json({ token });
  } catch (error) {
    console.error("Error al autenticar usuario:", error.message);
    res.status(500).json({ error: "Error en la autenticación" });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); 

  if (!token) {
    return res.status(403).json({ error: "Acceso denegado. No hay token." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  
    req.user = decoded;  
    next();  
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};


const register = async (req, res) => {
  const { nombre, contrasena, celular, email } = req.body;

  try {
    
    const hashedPassword = await bcrypt.hash(contrasena, 10);  

    const newUser = await consultas.createUser(nombre, hashedPassword, celular, email);

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

module.exports = { login, authenticateToken, register };  
