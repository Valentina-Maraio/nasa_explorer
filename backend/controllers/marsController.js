const nasaService = require('../services/nasaService');

async function getMarsManifest(req, res) {
  const rover = req.query.rover || 'curiosity';
  const data = await nasaService.fetchMarsManifest(rover);
  const manifest = data.photo_manifest;
  const latestEntry = manifest.photos.find((entry) => entry.sol === manifest.max_sol) || null;

  res.json({
    name: manifest.name,
    landingDate: manifest.landing_date,
    launchDate: manifest.launch_date,
    status: manifest.status,
    maxSol: manifest.max_sol,
    maxDate: manifest.max_date,
    totalPhotos: manifest.total_photos,
    latestPhotos: latestEntry
      ? {
          sol: latestEntry.sol,
          earthDate: latestEntry.earth_date,
          totalPhotos: latestEntry.total_photos,
          cameras: latestEntry.cameras,
        }
      : null,
  });
}

module.exports = {
  getMarsManifest,
};