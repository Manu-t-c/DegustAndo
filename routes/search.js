const express = require("express");
const Place = require("../models/Place");
const Event = require("../models/Event");
const { ok, error } = require("../utils/http");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { types = ["place","event"], text, filters = {}, geo, sort = [], page = 1, limit = 20 } = req.body || {};

    const build = (Model, kind) => {
      const q = {};
      if (text) q.$text = { $search: text };
      const f = (filters && filters[kind]) || {};
      for (const k of Object.keys(f)){
        if (["category", "tags", "dateFrom", "dateTo", "rating", "priceLevel"].includes(k)) q[k] = f[k];
      }
      if (f.tags) q.tags = { $all: f.tags };
      if (kind === "event"){
        if (f.dateFrom || f.dateTo){
          q.dateStart = {};
          if (f.dateFrom) q.dateStart.$gte = new Date(f.dateFrom);
          if (f.dateTo) q.dateStart.$lte = new Date(f.dateTo);
        }
      }
      let query = Model.find(q);
      if (geo && geo.near){
        query = query.where("location").near({ center: { type: "Point", coordinates: [geo.near.lng, geo.near.lat] }, maxDistance: (geo.radiusKm||5)*1000 });
      }
      const sortObj = {};
      sort.forEach(s=>{ if(s!=="proximity"){ const dir = s.startsWith("-")?-1:1; sortObj[s.replace(/^-/, "")] = dir; } });
      return query.sort(sortObj).skip((page-1)*limit).limit(limit);
    };

    const tasks = [];
    if (types.includes("place")) tasks.push(build(Place, "place"));
    if (types.includes("event")) tasks.push(build(Event, "event"));

    const [places = [], events = []] = await Promise.all(tasks);
    const items = [
      ...places.map(p=>({ type: "place", data: p })),
      ...events.map(e=>({ type: "event", data: e }))
    ];
    ok(res, { page, limit, total: items.length, items });
  } catch (e) { error(res, e); }
});

module.exports = router;
