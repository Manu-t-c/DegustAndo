const express = require("express");
const Comment = require("../models/Comment");
const Place = require("../models/Place");
const { ok, error } = require("../utils/http");

const router = express.Router();

// POST - crear comentario
router.post("/", async (req, res) => {
  try {
    const c = await Comment.create(req.body);

    // si es rating sobre Place, actualizar promedio
    if (c.parentType === "place" && Number.isFinite(c.rating)) {
      const agg = await Comment.aggregate([
        { $match: { parentType: "place", parentId: c.parentId, rating: { $exists: true } } },
        { $group: { _id: "$parentId", count: { $sum: 1 }, avg: { $avg: "$rating" } } }
      ]);
      if (agg[0]) {
        await Place.findByIdAndUpdate(c.parentId, { ratingAvg: agg[0].avg, ratingCount: agg[0].count });
      }
    }

    // populate userId para frontend
    const populated = await c.populate("userId", "username avatar");

    ok(res, populated, 201);
  } catch (e) { error(res, e); }
});

// GET - obtener comentarios de un post/place/event
router.get("/", async (req, res) => {
  try {
    const { parentType, parentId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (parentType) filter.parentType = parentType;
    if (parentId) filter.parentId = parentId;

    const total = await Comment.countDocuments(filter);
    const items = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit)
      .populate("userId", "username avatar"); // populate para mostrar nombre y avatar

    ok(res, { page: +page, limit: +limit, total, items });
  } catch (e) { error(res, e); }
});

// DELETE - borrar comentario
router.delete("/:id", async (req, res) => {
  try {
    const r = await Comment.findByIdAndDelete(req.params.id);
    ok(res, { deleted: !!r });
  } catch (e) { error(res, e); }
});

module.exports = router;

