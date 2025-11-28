const express = require("express");
const Place = require("../models/Place");
const { ok, error } = require("../utils/http");
const { parseGeo, buildCommon } = require("../utils/buildQuery");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const place = await Place.create(req.body);
    ok(res, place, 201);
  } catch (e) { error(res, e); }
});

// READ by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await Place.findById(req.params.id);
    if(!doc) return error(res, new Error("Not found"), 404);
    ok(res, doc);
  } catch (e) { error(res, e); }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const doc = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!doc) return error(res, new Error("Not found"), 404);
    ok(res, doc);
  } catch (e) { error(res, e); }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Place.findByIdAndDelete(req.params.id);
    if(!doc) return error(res, new Error("Not found"), 404);
    ok(res, { deleted: true });
  } catch (e) { error(res, e); }
});

// LIST + filtros
router.get("/", async (req, res) => {
  try {
    const geo = parseGeo(req.query);
    const { filter, options, sortObj } = buildCommon(req.query);
    if (req.query.category) filter.category = req.query.category;

    let query = Place.find(filter);

    if (geo){
      const meters = geo.radiusKm * 1000;
      query = query.where("location").near({
        center: { type: "Point", coordinates: [geo.near.lng, geo.near.lat] },
        maxDistance: meters
      });
    }

    const total = await Place.countDocuments(query.getQuery());
    const items = await query.sort(sortObj).skip((options.page-1)*options.limit).limit(options.limit);

    ok(res, { page: options.page, limit: options.limit, total, items });
  } catch (e) { error(res, e); }
});

module.exports = router;
