const Follow = require("../models/Follow");

// ➕ Seguir a un usuario
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { following } = req.body; // <-- usar "following"

    if (followerId === following) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo 😅" });
    }

    const newFollow = new Follow({ follower: followerId, following });
    await newFollow.save();

    res.status(201).json({ message: "Ahora sigues a este usuario 👥", follow: newFollow });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ya sigues a este usuario" });
    }
    res.status(500).json({ message: "Error al seguir al usuario", error: error.message });
  }
};

// ❌ Dejar de seguir
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { following } = req.body; // <-- usar "following"

    const deleted = await Follow.findOneAndDelete({ follower: followerId, following });

    if (!deleted) {
      return res.status(404).json({ message: "No estabas siguiendo a este usuario" });
    }

    res.json({ message: "Dejaste de seguir a este usuario 💔" });
  } catch (error) {
    res.status(500).json({ message: "Error al dejar de seguir", error: error.message });
  }
};

// 📋 Ver a quién sigo
exports.getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await Follow.find({ follower: userId })
      .populate("following", "username email");
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener lista de seguidos", error: error.message });
  }
};

// 👀 Ver quiénes me siguen
exports.getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await Follow.find({ following: userId })
      .populate("follower", "username email");
    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener seguidores", error: error.message });
  }
};
