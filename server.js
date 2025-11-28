const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express"); 
const YAML = require("yamljs"); 
  

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cargar documentación Swagger
const swaggerDocument = YAML.load("./swagger/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//console.log("Swagger cargado con título:", swaggerD5rrt5ocument.info.title);

// Conexión a MongoDB
const connectDB = require("./config/db");
connectDB();
//Conexion fronet 
app.use(express.static(path.join(__dirname, "public")));
// Rutas
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/notifications", require("./routes/notifications"));
app.use("/api/v1/likes", require("./routes/likes"));
app.use("/api/v1/follows", require("./routes/follows"));
app.use("/api/v1/posts", require("./routes/posts"));
app.use("/api/v1/places", require("./routes/places"));
app.use("/api/v1/events", require("./routes/events"));
app.use("/api/v1/comments", require("./routes/comments"));
app.use("/api/v1/feed", require("./routes/feed"));
app.use("/api/v1/search", require("./routes/search"));


// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${process.env.PORT}/api-docs`);
  console.log(`👥 Endpoint usuarios: http://localhost:${process.env.PORT}/api/v1/users`);
  console.log("🧭 CWD:", process.cwd());
  console.log("📁 Archivo .env esperado en:", path.resolve(".env"));
  console.log("🔍 JWT_SECRET actual:", process.env.JWT_SECRET);

  console.log()

});
