const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const followsController = require("../controllers/follows.controller");

// Seguir a un usuario
router.post("/", verifyToken, followsController.followUser);

// Dejar de seguir
router.delete("/", verifyToken, followsController.unfollowUser);

// Ver a quién sigo
router.get("/following", verifyToken, followsController.getFollowing);

// Ver quiénes me siguen
router.get("/followers", verifyToken, followsController.getFollowers);

module.exports = router;
