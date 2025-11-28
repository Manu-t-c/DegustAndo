const express = require("express");
const Place = require("../models/Place");
const Event = require("../models/Event");
const { ok, error } = require("../utils/http");
const { parseGeo, buildCommon } = require("../utils/buildQuery");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const types = (req.query.types || "place,event").split(",");
    const geo = parseGeo(req.query);
    const { filter, options, sortObj } = buildCommon(req.query);

    const tasks = [];
    if (types.includes("place")){
      let q = Place.find(filter);
      if (geo){ q = q.where("location").near({ center: { type: "Point", coordinates: [geo.near.lng, geo.near.lat] }, maxDistance: geo.radiusKm*1000 }); }
      tasks.push(q.sort(sortObj).limit(options.limit));
    }
    if (types.includes("event")){
      let q = Event.find(filter);
      if (req.query.dateFrom||req.query.dateTo){
        const r = {};
        if (req.query.dateFrom) r.$gte = new Date(req.query.dateFrom);
        if (req.query.dateTo) r.$lte = new Date(req.query.dateTo);
        q = q.where("dateStart", r);
      }
      if (geo){ q = q.where("location").near({ center: { type: "Point", coordinates: [geo.near.lng, geo.near.lat] }, maxDistance: geo.radiusKm*1000 }); }
      tasks.push(q.sort(sortObj).limit(options.limit));
    }

    const [places = [], events = []] = await Promise.all(tasks);
    const items = [];
    places.forEach(p=> items.push({ type: "place", data: p }));
    events.forEach(e=> items.push({ type: "event", data: e }));

    ok(res, { page: 1, limit: options.limit, total: items.length, items });
  } catch (e) { error(res, e); }
});

// recomendado (MVP: trending por ratingCount y cercanía)
router.get("/recommended", async (req, res) => {
  try {
    const geo = parseGeo(req.query);
    const limit = Math.min(50, +(req.query.limit || 12));

    let q = Place.find({}).sort({ ratingCount: -1, ratingAvg: -1 });
    if (geo){ q = q.where("location").near({ center: { type: "Point", coordinates: [geo.near.lng, geo.near.lat] }, maxDistance: geo.radiusKm*1000 }); }
    const places = await q.limit(limit);

    ok(res, { items: places.map(p=>({ type:"place", data:p })) });
  } catch (e) { error(res, e); }
});

module.exports = router;
