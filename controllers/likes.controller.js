const Like = require("../models/Like");
const Post = require("../models/Post");

// Dar o quitar like (modo toggle)
exports.addLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // 🔍 Verificamos si el usuario ya dio like
    const existing = await Like.findOne({ user: userId, post: postId });

    if (existing) {
      // Quitar like
      await Like.findOneAndDelete({ user: userId, post: postId });

      // Actualizamos contador del post
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();

      return res.json({
        message: "Like eliminado 💔",
        liked: false,
        likesCount: post.likesCount
      });
    }

    //  Si no existe, agregamos el like
    await Like.create({ user: userId, post: postId });

    post.likesCount += 1;
    await post.save();

    res.status(201).json({
      message: "Like agregado ❤️",
      liked: true,
      likesCount: post.likesCount
    });

  } catch (error) {
    console.error("❌ Error en toggle like:", error);
    res.status(500).json({
      message: "Error al procesar like",
      error: error.message
    });
  }
};

// 👥 Ver quiénes dieron like a un post
exports.getLikesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ post: postId })
      .populate("user", "username avatar");
    res.json(likes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener likes",
      error: error.message
    });
  }
};

// 💻 Listar todos los likes del usuario
exports.getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const likes = await Like.find({ user: userId })
      .populate("post", "description image likesCount");
    res.json(likes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener likes",
      error: error.message
    });
  }
};


