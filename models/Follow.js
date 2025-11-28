const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // quién sigue
    following: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }  // a quién sigue
  },
  { timestamps: true }
);

// Un usuario no puede seguir a otro más de una vez
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema);
