function parseGeo(query){
  if(!query.near) return null;
  const [latStr, lngStr] = String(query.near).split(",");
  const lat = parseFloat(latStr), lng = parseFloat(lngStr);
  const radiusKm = parseFloat(query.radiusKm || "5");
  if(Number.isFinite(lat) && Number.isFinite(lng)){
    return { near: { lat, lng }, radiusKm };
  }
  return null;
}

function buildCommon({ q, tags, sort, page = 1, limit = 12 }){
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (tags){
    const arr = String(tags).split(",").map(s=>s.trim()).filter(Boolean);
    if (arr.length) filter.tags = { $all: arr };
  }
  const options = { page: Math.max(1, +page), limit: Math.min(100, Math.max(1, +limit)) };
  const sortObj = {};
  if (sort){
    String(sort).split(",").forEach(key=>{
      if(key === "proximity") return; // calculado aparte
      const dir = key.startsWith("-") ? -1 : 1;
      const field = key.replace(/^-/, "");
      sortObj[field] = dir;
    });
  }
  return { filter, options, sortObj };
}

module.exports = { parseGeo, buildCommon };
