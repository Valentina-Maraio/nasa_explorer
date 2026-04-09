const nasaService = require('../services/nasaService');

function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}

function normaliseObject(item, fallbackDate) {
  const approach = item.close_approach_data?.[0] || {};
  return {
    id: item.id,
    name: item.name,
    nasaJplUrl: item.nasa_jpl_url,
    isPotentiallyHazardous: item.is_potentially_hazardous_asteroid,
    absoluteMagnitude: item.absolute_magnitude_h,
    estimatedDiameterMaxMeters:
      item.estimated_diameter?.meters?.estimated_diameter_max || null,
    approachDate: approach.close_approach_date || fallbackDate,
    approachDateTime: approach.close_approach_date_full || null,
    missDistanceKilometers: Number(approach.miss_distance?.kilometers || 0),
    relativeVelocityKilometersPerSecond: Number(
      approach.relative_velocity?.kilometers_per_second || 0,
    ),
    orbitingBody: approach.orbiting_body || null,
  };
}

async function getNeoFeed(req, res) {
  const date = req.query.date || getTodayIsoDate();
  const data = await nasaService.fetchNeoFeed(date);
  const objects = (data.near_earth_objects?.[date] || [])
    .map((item) => normaliseObject(item, date))
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

async function getNeoRange(req, res) {
  const today = getTodayIsoDate();
  const startDate = req.query.start_date || today;
  const endDate = req.query.end_date || today;

  const data = await nasaService.fetchNeoRange(startDate, endDate);
  const neoObjects = data.near_earth_objects || {};

  const days = Object.keys(neoObjects)
    .sort()
    .map((date) => {
      const objects = (neoObjects[date] || [])
        .map((item) => normaliseObject(item, date))
        .sort((a, b) => {
          const at = a.approachDateTime
            ? Date.parse(a.approachDateTime.replace(' ', 'T'))
            : Number.MAX_SAFE_INTEGER;
          const bt = b.approachDateTime
            ? Date.parse(b.approachDateTime.replace(' ', 'T'))
            : Number.MAX_SAFE_INTEGER;
          return at - bt;
        });
      return { date, objects };
    });

  res.json({
    startDate,
    endDate,
    elementCount: data.element_count || days.reduce((s, d) => s + d.objects.length, 0),
    days,
  });
}

module.exports = {
  getNeoFeed,
  getNeoRange,
};