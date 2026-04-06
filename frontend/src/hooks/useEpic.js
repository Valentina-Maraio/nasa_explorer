import { useCallback, useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheKey, cacheSet, TTL } from '../utils/cache';

function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}

export function useEpic(initialDate = getTodayIsoDate()) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEpic = useCallback(async (date = initialDate) => {
    setLoading(true);
    setError(null);

    try {
      const key = cacheKey('epic-natural', { date });
      const cached = cacheGet(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await fetch(buildApiUrl(`/api/epic/natural?date=${date}`));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      const leadImage = payload.images?.[0] || null;
      const normalized = {
        date: payload.date || date,
        imageCount: payload.imageCount || 0,
        images: payload.images || [],
        leadImage,
      };

      cacheSet(key, normalized, TTL.EPIC);
      setData(normalized);
    } catch (err) {
      setError(err.message || 'Failed to fetch EPIC imagery');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [initialDate]);

  useEffect(() => {
    fetchEpic(initialDate);
  }, [fetchEpic, initialDate]);

  return {
    data,
    loading,
    error,
    fetchEpic,
  };
}

export default useEpic;