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

async function fetchNeoFeed(date) {
  const apiKey = getApiKey();

  try {
    const response = await client.get('https://api.nasa.gov/neo/rest/v1/feed', {
      params: {
        api_key: apiKey,
        start_date: date,
        end_date: date,
      },
    });

    return response.data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to fetch near-earth objects');
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

async function fetchMarsManifest(rover = 'curiosity') {
  const apiKey = getApiKey();

  try {
    const response = await client.get(`https://api.nasa.gov/mars-photos/api/v1/manifests/${encodeURIComponent(rover)}`, {
      params: {
        api_key: apiKey,
      },
    });

    return response.data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to fetch Mars rover manifest');
  }
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

module.exports = {
  fetchApod,
  fetchNeoFeed,
  fetchEpicNatural,
  fetchMarsManifest,
  searchImages,
  fetchAsset,
  fetchMetadata,
};