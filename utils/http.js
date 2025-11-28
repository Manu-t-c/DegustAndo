function ok(res, data, status = 200){
  res.status(status).json(data);
}
function error(res, err, status = 400){
  res.status(status).json({ message: err.message || String(err) });
}
module.exports = { ok, error };
