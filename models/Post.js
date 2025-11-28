const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // quién publicó
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true } // agrega createdAt y updatedAt automáticamente
);

// ✅ Para evitar valores negativos o inconsistentes
postSchema.methods.updateLikesCount = async function () {
  const Like = mongoose.model("Like");
  const count = await Like.countDocuments({ post: this._id });
  this.likesCount = count >= 0 ? count : 0;
  await this.save();
  return this.likesCount;
};

module.exports = mongoose.model("Post", postSchema);


