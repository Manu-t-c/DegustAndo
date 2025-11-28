const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const notificationController = require("../controllers/notifications.controller");

// Crear notificación
router.post("/", verifyToken, notificationController.createNotification);

// Obtener notificaciones del usuario autenticado
router.get("/", verifyToken, notificationController.getNotificationsByUser);

// Marcar como leída
router.put("/:id/read", verifyToken, notificationController.markAsRead);

// Eliminar notificación
router.delete("/:id", verifyToken, notificationController.deleteNotification);

module.exports = router;
