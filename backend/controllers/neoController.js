const nasaService = require('../services/nasaService');

function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}

async function getNeoFeed(req, res) {
  const date = req.query.date || getTodayIsoDate();
  const data = await nasaService.fetchNeoFeed(date);
  const objects = (data.near_earth_objects?.[date] || [])
    .map((item) => {
      const approach = item.close_approach_data?.[0] || {};

      return {
        id: item.id,
        name: item.name,
        nasaJplUrl: item.nasa_jpl_url,
        isPotentiallyHazardous: item.is_potentially_hazardous_asteroid,
        absoluteMagnitude: item.absolute_magnitude_h,
        estimatedDiameterMaxMeters:
          item.estimated_diameter?.meters?.estimated_diameter_max || null,
        approachDate: approach.close_approach_date || date,
        approachDateTime: approach.close_approach_date_full || null,
        missDistanceKilometers: Number(approach.miss_distance?.kilometers || 0),
        relativeVelocityKilometersPerSecond: Number(
          approach.relative_velocity?.kilometers_per_second || 0,
        ),
        orbitingBody: approach.orbiting_body || null,
      };
    })
    .sort((left, right) => {
      const leftTime = left.approachDateTime ? Date.parse(left.approachDateTime.replace(' ', 'T')) : Number.MAX_SAFE_INTEGER;
      const rightTime = right.approachDateTime ? Date.parse(right.approachDateTime.replace(' ', 'T')) : Number.MAX_SAFE_INTEGER;
      return leftTime - rightTime;
    });

  res.json({
    date,
    elementCount: data.element_count || objects.length,
    objects,
  });
}

module.exports = {
  getNeoFeed,
};