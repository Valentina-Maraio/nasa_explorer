import { useState, useCallback, useEffect } from 'react';
import { normaliseApodData } from '../utils/normalise';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheSet, cacheKey, TTL } from '../utils/cache';

export function useApod(initialDate = '', options = {}) {
  const { autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchApod = useCallback(async (date = '') => {
    setLoading(true);
    setError(null);
    try {
      const key = cacheKey('apod', { date: date || 'today' });
      const cached = cacheGet(key);
      if (cached) {
        setData(cached);
        setError(null);
        setLoading(false);
        return;
      }

      const url = `/api/apod${date ? `?date=${date}` : ''}`;
      const response = await fetch(buildApiUrl(url));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const normalized = normaliseApodData(data);
      cacheSet(key, normalized, TTL.APOD);
      setData(normalized);
      setError(null);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch APOD - Check that backend is running on port 3001';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    fetchApod(initialDate);
  }, [fetchApod, initialDate]);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }
    fetchApod(initialDate);
  }, [fetchApod, initialDate, autoFetch]);

  return {
    data,
    loading,
    error,
    retry,
    fetchApod,
  };
}

export default useApod;
