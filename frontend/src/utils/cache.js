const NS = 'nasa_cache:';

export const TTL = {
  APOD: 60 * 60 * 1000,          
  IMAGE_SEARCH: 10 * 60 * 1000,  
  ASSET: 30 * 60 * 1000,         
  METADATA: 30 * 60 * 1000,      
  NEO: 60 * 60 * 1000,
  EPIC: 6 * 60 * 60 * 1000,
  MARS_MANIFEST: 6 * 60 * 60 * 1000,
  WEATHER_FALLBACK: 15 * 60 * 1000,
};

export function cacheSet(key, data, ttlMs) {
  try {
    const entry = JSON.stringify({ data, expiresAt: Date.now() + ttlMs });
    localStorage.setItem(NS + key, entry);
  } catch {
  }
}

export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(NS + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function cacheKey(prefix, params = {}) {
  const sorted = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== '' && params[k] != null)
    .map((k) => `${k}=${params[k]}`)
    .join(':');
  return sorted ? `${prefix}:${sorted}` : prefix;
}
