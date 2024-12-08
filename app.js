const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const auth = require("./auth");  

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.post("/register", auth.register); 


app.post("/login", auth.login);  


app.get("/protected", auth.authenticateToken, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


