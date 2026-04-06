const nasaService = require('../services/nasaService');

function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}

function buildEpicArchiveUrl(date, imageName) {
  const [year, month, day] = date.split('-');
  return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${imageName}.png`;
}

async function getEpicNatural(req, res) {
  const date = req.query.date || getTodayIsoDate();
  const data = await nasaService.fetchEpicNatural(date);

  const images = data.map((item) => ({
    identifier: item.identifier,
    caption: item.caption,
    image: item.image,
    date: item.date,
    centroidCoordinates: item.centroid_coordinates || null,
    dscovrJ2000Position: item.dscovr_j2000_position || null,
    lunarJ2000Position: item.lunar_j2000_position || null,
    sunJ2000Position: item.sun_j2000_position || null,
    archiveUrl: buildEpicArchiveUrl(date, item.image),
  }));

  res.json({
    date,
    imageCount: images.length,
    images,
  });
}

module.exports = {
  getEpicNatural,
};