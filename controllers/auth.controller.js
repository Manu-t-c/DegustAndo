const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    // Validar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    //Sin encriptar 
    //const hashedPassword = password;

    // Crear usuario nuevo con avatar static
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || "https://i.imgur.com/8Km9tLL.png"
    });
    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    //if (password !== user.password) {
  //return res.status(401).json({ message: "Contraseña incorrecta" });}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};


