const nasaService = require('../services/nasaService');

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickNumber(...values) {
  for (const value of values) {
    const parsed = toNumber(value);
    if (parsed != null) {
      return parsed;
    }
  }

  return null;
}

function normalizeSolEntry(sol, entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const minTempC = pickNumber(entry.AT?.mn, entry.at?.mn);
  const maxTempC = pickNumber(entry.AT?.mx, entry.at?.mx);
  const avgTempC = pickNumber(entry.AT?.av, entry.at?.av);
  const pressurePa = pickNumber(entry.PRE?.av, entry.pre?.av, entry.PRE?.mn, entry.pre?.mn);
  const windSpeedMs = pickNumber(entry.HWS?.av, entry.hws?.av, entry.HWS?.mn, entry.hws?.mn);
  const firstUtc = entry.First_UTC || entry.first_utc || null;
  const lastUtc = entry.Last_UTC || entry.last_utc || null;

  if (
    minTempC == null
    && maxTempC == null
    && avgTempC == null
    && pressurePa == null
    && windSpeedMs == null
  ) {
    return null;
  }

  return {
    sol,
    date: firstUtc,
    lastDate: lastUtc,
    minTempC,
    maxTempC,
    avgTempC,
    pressurePa,
    windSpeedMs,
  };
}

async function getMarsWeather(req, res) {
  const data = await nasaService.fetchMarsWeather(req.query.date);
  const solKeys = Array.isArray(data.sol_keys) ? data.sol_keys : [];
  const history = solKeys
    .map((sol) => normalizeSolEntry(sol, data[sol]))
    .filter(Boolean)
    .sort((left, right) => Number(right.sol) - Number(left.sol));

  if (history.length === 0) {
    res.json({
      source: 'NASA InSight Mars Weather Service',
      status: 'unavailable',
      units: {
        temperature: 'C',
        pressure: 'Pa',
        windSpeed: 'm/s',
      },
      latest: null,
      history: [],
      message: 'NO MARS WEATHER TELEMETRY AVAILABLE',
    });
    return;
  }

  res.json({
    source: 'NASA InSight Mars Weather Service',
    status: 'ok',
    units: {
      temperature: 'C',
      pressure: 'Pa',
      windSpeed: 'm/s',
    },
    latest: history[0],
    history,
  });
}

function toVectorMagnitude(vector) {
  if (!vector || typeof vector !== 'object') {
    return null;
  }

  const x = toNumber(vector.x);
  const y = toNumber(vector.y);
  const z = toNumber(vector.z);
  if (x == null || y == null || z == null) {
    return null;
  }

  return Math.sqrt((x * x) + (y * y) + (z * z));
}

function deriveMoonProxyFromEpic(item) {
  const lunarDistanceAu = toVectorMagnitude(item.lunar_j2000_position);
  const sunDistanceAu = toVectorMagnitude(item.sun_j2000_position);

  let proxyTempC = null;
  if (lunarDistanceAu != null) {
    const clamped = Math.max(0.6, Math.min(1.4, lunarDistanceAu));
    proxyTempC = Number((120 / clamped) - 165).toFixed(1);
    proxyTempC = toNumber(proxyTempC);
  }

  return {
    timestamp: item.date || null,
    centroid: item.centroid_coordinates || null,
    lunarDistanceAu,
    sunDistanceAu,
    proxyTempC,
    caption: item.caption || null,
  };
}

async function getMoonWeather(req, res) {
  const data = await nasaService.fetchMoonWeatherProxy(req.query.date);
  const latestItem = data.items[0] || null;

  if (!latestItem) {
    res.json({
      source: 'NASA EPIC Natural Color Imagery',
      status: 'unavailable',
      units: {
        temperature: 'C (proxy)',
        distance: 'AU',
      },
      latest: null,
      proxyMetrics: null,
      caveats: [
        'Moon telemetry is proxy-derived from EPIC geometry and is not atmospheric weather.',
      ],
      message: 'NO LUNAR PROXY TELEMETRY AVAILABLE',
    });
    return;
  }

  const proxyMetrics = deriveMoonProxyFromEpic(latestItem);

  res.json({
    source: 'NASA EPIC Natural Color Imagery',
    status: 'ok',
    units: {
      temperature: 'C (proxy)',
      distance: 'AU',
    },
    latest: {
      date: data.date,
      timestamp: latestItem.date || null,
    },
    proxyMetrics,
    caveats: [
      'Moon values are proxy-derived from EPIC geometry and should be treated as estimated environmental indicators.',
    ],
  });
}

module.exports = {
  getMarsWeather,
  getMoonWeather,
};
