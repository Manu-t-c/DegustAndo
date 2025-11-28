const express = require("express");
const Event = require("../models/Event");
const { ok, error } = require("../utils/http");
const { parseGeo, buildCommon } = require("../utils/buildQuery");

const router = express.Router();

router.post("/", async (req, res) => {
  try { const doc = await Event.create(req.body); ok(res, doc, 201); }
  catch(e){ error(res, e); }
});

router.get("/:id", async (req, res) => {
  try { const doc = await Event.findById(req.params.id); if(!doc) return error(res, new Error("Not found"), 404); ok(res, doc); }
  catch(e){ error(res, e); }
});

router.patch("/:id", async (req, res) => {
  try { const doc = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }); if(!doc) return error(res, new Error("Not found"), 404); ok(res, doc); }
  catch(e){ error(res, e); }
});

router.delete("/:id", async (req, res) => {
  try { const doc = await Event.findByIdAndDelete(req.params.id); if(!doc) return error(res, new Error("Not found"), 404); ok(res, { deleted: true }); }
  catch(e){ error(res, e); }
});

// RSVP
router.post("/:id/rsvp", async (req, res) => {
  try {
    const { status, userId } = req.body;
    if(!["going","interested","declined"].includes(status)) return error(res, new Error("Invalid status"));
    const doc = await Event.findById(req.params.id);
    if(!doc) return error(res, new Error("Not found"), 404);
    const idx = doc.participants.findIndex(p=> String(p.userId)===String(userId));
    if(idx>=0) doc.participants[idx].status = status; else doc.participants.push({ userId, status });
    await doc.save();
    ok(res, { ok: true, participants: doc.participants });
  } catch (e) { error(res, e); }
});

// LIST con fechas/geo
router.get("/", async (req, res) => {
  try {
    const geo = parseGeo(req.query);
    const { filter, options, sortObj } = buildCommon(req.query);

    if (req.query.dateFrom || req.query.dateTo){
      filter.$and = filter.$and || [];
      const r = {};
      if (req.query.dateFrom) r.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) r.$lte = new Date(req.query.dateTo);
      filter.$and.push({ dateStart: r });
    }

    let query = Event.find(filter);

    if (geo){
      const meters = geo.radiusKm * 1000;
      query = query.where("location").near({
        center: { type: "Point", coordinates: [geo.near.lng, geo.near.lat] },
        maxDistance: meters
      });
    }

    const total = await Event.countDocuments(query.getQuery());
    const items = await query.sort(sortObj).skip((options.page-1)*options.limit).limit(options.limit);
    ok(res, { page: options.page, limit: options.limit, total, items });
  } catch (e) { error(res, e); }
});

module.exports = router;
