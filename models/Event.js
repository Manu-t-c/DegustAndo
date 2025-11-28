const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["going", "interested", "declined"], required: true },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  tags: { type: [String], index: true, default: [] },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  address: { type: String, default: "" },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  capacity: { type: Number, default: 0 },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: { type: [ParticipantSchema], default: [] }
}, { timestamps: true });

EventSchema.index({ location: "2dsphere" });
EventSchema.index({ dateStart: 1, dateEnd: 1 });
EventSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Event", EventSchema);
