const nasaService = require('../services/nasaService');

async function searchImages(req, res) {
  const filters = {
    q: req.query.q || 'moon',
    page: req.query.page || 1,
    page_size: req.query.page_size || 20,
  };

  const data = await nasaService.searchImages(filters);
  res.json(data);
}

async function getAsset(req, res) {
  const data = await nasaService.fetchAsset(req.query.nasa_id);
  res.json(data);
}

async function getMetadata(req, res) {
  const data = await nasaService.fetchMetadata(req.query.nasa_id);
  res.json(data);
}

module.exports = {
  searchImages,
  getAsset,
  getMetadata,
};