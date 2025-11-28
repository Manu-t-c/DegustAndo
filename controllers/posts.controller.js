const Post = require("../models/Post");
const Like = require("../models/Like");

// ➕ Crear un post
exports.createPost = async (req, res) => {
  try {
    const { description, image } = req.body;

    const newPost = new Post({
      user: req.user.id,
      description,
      image,
    });

    await newPost.save();
    res.status(201).json({ message: "Post creado correctamente 🍳", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error al crear post", error: error.message });
  }
};

// 📜 Obtener todos los posts con info de likes
exports.getAllPosts = async (req, res) => {
  try {
    const userId = req.user?.id; // si hay token (opcional)
    const posts = await Post.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .lean(); // devuelve objetos JS puros

    // Si hay usuario logueado, marcamos cuáles posts tiene like
    if (userId) {
      const likes = await Like.find({ user: userId });
      const likedPosts = likes.map(l => l.post.toString());
      posts.forEach(p => {
        p.likedByUser = likedPosts.includes(p._id.toString());
      });
    } else {
      posts.forEach(p => (p.likedByUser = false));
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener posts", error: error.message });
  }
};


// 👤 Obtener publicaciones del usuario autenticado
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ user: userId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tus publicaciones", error: error.message });
  }
};

// Eliminar post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id; // asumimos que mandas el id por URL
    const userId = req.user.id;   // tu middleware de auth agrega esto

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Verificamos que el usuario sea el dueño
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el post" });
  }
};
