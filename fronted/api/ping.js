module.exports = function handler(req, res) {
  res.status(200).json({
    ok: true,
    keySet: !!process.env.ANTHROPIC_API_KEY,
    time: new Date().toISOString()
  });
}
