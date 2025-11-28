const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  parentType: { type: String, enum: ["place", "event", "post"], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

// Índice para consultas rápidas
CommentSchema.index({ parentType: 1, parentId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", CommentSchema);


