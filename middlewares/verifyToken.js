// middlewares/verifyToken.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado o formato inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("JWT_SECRET en verifyToken:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guarda los datos del usuario autenticado
    next(); // continúa con la siguiente función
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
