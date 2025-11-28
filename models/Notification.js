const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // A quién va dirigida la notificación

    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }, // Quién la generó

    type: { 
      type: String, 
      enum: ["like", "comment", "follow"], 
      required: true 
    }, // Tipo de notificación

    message: { type: String, required: true },
    read: { type: Boolean, default: false } // Si el usuario ya la vio
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
