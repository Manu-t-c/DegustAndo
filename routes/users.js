const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");

// Rutas protegidas
router.get("/", verifyToken, usersController.getAllUsers);
router.get("/:id", verifyToken, usersController.getUserById);
router.put("/:id", verifyToken, usersController.updateUser);
router.delete("/:id", verifyToken, usersController.deleteUser);

module.exports = router;



