const nasaService = require('../services/nasaService');

async function getApod(req, res) {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const data = await nasaService.fetchApod(date);
  res.json(data);
}

module.exports = {
  getApod,
};