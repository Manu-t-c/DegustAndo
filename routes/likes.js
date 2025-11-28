const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const likesController = require("../controllers/likes.controller");

// ✅ Toggle de like (agregar o quitar)
router.post("/", verifyToken, likesController.addLike);

// 👥 Ver quiénes dieron like a un post
router.get("/:postId", verifyToken, likesController.getLikesByPost);

// 💻 Listar todos los likes del usuario
router.get("/", verifyToken, likesController.getUserLikes);

module.exports = router;

