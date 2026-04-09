const axios = require('axios');
const AppError = require('../utils/AppError');

const client = axios.create({ timeout: 15000 });

function getApiKey() {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new AppError('NASA_API_KEY is not configured on server', 500, 'MISSING_NASA_API_KEY', false);
  }

  return apiKey;
}

function mapAxiosError(error, fallbackMessage) {
  if (error.response) {
    return new AppError(fallbackMessage, 502, 'NASA_UPSTREAM_ERROR', true, {
      upstreamStatus: error.response.status,
    });
  }

  if (error.code === 'ECONNABORTED') {
    return new AppError('NASA upstream timed out', 504, 'NASA_TIMEOUT', true);
  }

  return new AppError(fallbackMessage, 502, 'NASA_REQUEST_FAILED', true);
}

async function fetchApod(date) {
  const apiKey = getApiKey();

  try {
    const response = await client.get('https://api.nasa.gov/planetary/apod', {
      params: {
        api_key: apiKey,
        date,
      },
    });

    return response.data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to fetch APOD');
  }
}



async function fetchEpicNatural(date) {
  const apiKey = getApiKey();

  try {
    const response = await client.get(`https://api.nasa.gov/EPIC/api/natural/date/${date}`, {
      params: {
        api_key: apiKey,
      },
    });

    return response.data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to fetch EPIC imagery');
  }
}



async function fetchMarsWeather(date) {
  const apiKey = getApiKey();

  const requestConfigs = [
    {
      url: 'https://api.nasa.gov/insight_weather/',
      params: {
        api_key: apiKey,
        feedtype: 'json',
        ver: '1.0',
      },
    },
    {
      url: 'https://api.nasa.gov/insight_weather/',
      params: {
        api_key: apiKey,
      },
    },
  ];

  let lastError = null;

  for (const config of requestConfigs) {
    try {
      const response = await client.get(config.url, {
        params: config.params,
      });
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  if (date) {
    throw mapAxiosError(lastError, 'Failed to fetch Mars weather data for requested date');
  }

  throw mapAxiosError(lastError, 'Failed to fetch Mars weather data');
}

async function fetchMoonWeatherProxy(date, days = 7) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const desiredPoints = Math.max(1, Math.min(Number(days) || 7, 14));
  const maxLookbackDays = Math.max(desiredPoints * 3, desiredPoints);
  const history = [];
  let latestItems = [];
  let lastError = null;

  for (let index = 0; index < maxLookbackDays && history.length < desiredPoints; index += 1) {
    const candidateDate = new Date(`${targetDate}T00:00:00Z`);
    candidateDate.setUTCDate(candidateDate.getUTCDate() - index);
    const isoDate = candidateDate.toISOString().split('T')[0];

    try {
      const items = await fetchEpicNatural(isoDate);
      if (Array.isArray(items) && items.length > 0) {
        if (latestItems.length === 0) {
          latestItems = items;
        }

        history.push({
          date: isoDate,
          item: items[0],
        });
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (history.length === 0 && lastError) {
    throw mapAxiosError(lastError, 'Failed to fetch Moon proxy telemetry');
  }

  return {
    date: targetDate,
    items: latestItems,
    history,
  };
}

async function searchImages({ q, page, page_size }) {
  try {
    const response = await client.get('https://images-api.nasa.gov/search', {
      params: { q, page, page_size },
    });

    return response.data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to search images');
  }
}

async function fetchAsset(nasaId) {
  try {
    const response = await client.get(`https://images-api.nasa.gov/asset/${encodeURIComponent(nasaId)}`);
    return response.data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to fetch asset data');
  }
}

async function fetchMetadata(nasaId) {
  try {
    const response = await client.get(`https://images-api.nasa.gov/metadata/${encodeURIComponent(nasaId)}`);
    return response.data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to fetch metadata');
  }
}

async function fetchSolarFlares(startDate, endDate) {
  const apiKey = getApiKey();
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const start = startDate || thirtyDaysAgo;
  const end = endDate || today;

  try {
    const response = await client.get('https://api.nasa.gov/DONKI/FLR', {
      params: {
        api_key: apiKey,
        startDate: start,
        endDate: end,
      },
    });

    return response.data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to fetch solar flare data');
  }
}

module.exports = {
  fetchApod,
  fetchEpicNatural,
  fetchMarsWeather,
  fetchMoonWeatherProxy,
  fetchSolarFlares,
  searchImages,
  fetchAsset,
  fetchMetadata,
};