const Notification = require("../models/Notification");

// 📬 Crear notificación
exports.createNotification = async (req, res) => {
  try {
    const { user, sender, type, message } = req.body;

    const newNotification = new Notification({ user, sender, type, message });
    await newNotification.save();

    res.status(201).json({
      message: "Notificación creada correctamente 🔔",
      notification: newNotification,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear notificación", error: error.message });
  }
};

// 📥 Obtener notificaciones de un usuario
exports.getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notificaciones", error: error.message });
  }
};

// ✅ Marcar como leída
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notificación no encontrada" });

    notification.read = true;
    await notification.save();

    res.json({ message: "Notificación marcada como leída ", notification });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar notificación", error: error.message });
  }
};

// 🗑️ Eliminar notificación
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notificación no encontrada" });

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notificación eliminada correctamente " });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar notificación", error: error.message });
  }
};
