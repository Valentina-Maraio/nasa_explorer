import { useCallback, useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheKey, cacheSet, TTL } from '../utils/cache';

export function useMarsManifest(rover = 'curiosity') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchManifest = useCallback(async (nextRover = rover) => {
    setLoading(true);
    setError(null);

    try {
      const key = cacheKey('mars-manifest', { rover: nextRover });
      const cached = cacheGet(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await fetch(buildApiUrl(`/api/mars/manifest?rover=${nextRover}`));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      cacheSet(key, payload, TTL.MARS_MANIFEST);
      setData(payload);
    } catch (err) {
      setError(err.message || 'Failed to fetch Mars manifest');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [rover]);

  useEffect(() => {
    fetchManifest(rover);
  }, [fetchManifest, rover]);

  return {
    data,
    loading,
    error,
    fetchManifest,
  };
}

export default useMarsManifest;