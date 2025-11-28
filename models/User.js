const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },// nombre de usuario
    email: { type: String, required: true, unique: true },   // correo
    password: { type: String, required: true },              // contraseña
    reputation: { type: Number, default: 0 },                // reputación
    bio: { type: String, default: "" },                     // descripción del perfil
    avatar: { type: String, default: "" }                  // foto de perfil
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
