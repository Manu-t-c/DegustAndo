const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  category: { type: String, index: true },
  tags: { type: [String], index: true, default: [] },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  address: { type: String, default: "" },
  ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  photos: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

PlaceSchema.index({ location: "2dsphere" });
PlaceSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Place", PlaceSchema);
