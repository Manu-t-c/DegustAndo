const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const verifyTokenOptional = require("../middlewares/verifyTokenOptional");
const postsController = require("../controllers/posts.controller");

// Crear post
router.post("/", verifyToken, postsController.createPost);

// Todos los posts (con info de likes si hay token)
router.get("/", verifyTokenOptional, postsController.getAllPosts);

// Mis publicaciones
router.get("/me", verifyToken, postsController.getUserPosts);

// Eliminar post
router.delete("/:id", verifyToken, postsController.deletePost);

module.exports = router;

