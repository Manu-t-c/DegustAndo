const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 📜 Obtener todos los usuarios 
exports.getAllUsers = async (req, res) => {
  try {
    // Solo username, avatar y _id
    const users = await User.find().select("username avatar _id");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};


// 👤 Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

// ✏️ Actualizar perfil del usuario autenticado
exports.updateUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "No tienes permiso para editar este perfil 🚫" });
    }

    const { name, email, password, bio, avatar } = req.body;
    const updatedData = { name, email, bio, avatar };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    }).select("-password");

    res.json({ message: "Perfil actualizado correctamente ✅", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
  }
};

// 🗑️ Eliminar cuenta
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "No puedes eliminar otra cuenta 😅" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Cuenta eliminada correctamente 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};
