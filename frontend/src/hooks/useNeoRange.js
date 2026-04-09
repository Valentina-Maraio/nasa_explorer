import { useCallback, useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheKey, cacheSet, TTL } from '../utils/cache';

function getStartDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  return d.toISOString().split('T')[0];
}

function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}

export function useNeoRange(days = 7) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRange = useCallback(async () => {
    setLoading(true);
    setError(null);

    const startDate = getStartDate(days);
    const endDate = getTodayIsoDate();
    const key = cacheKey('neo-range', { startDate, endDate });

    try {
      const cached = cacheGet(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await fetch(
        buildApiUrl(`/api/neo/range?start_date=${startDate}&end_date=${endDate}`),
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const days_data = payload.days || [];
      cacheSet(key, days_data, TTL.NEO);
      setData(days_data);
    } catch (err) {
      setError(err.message || 'Failed to fetch NEO range data');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchRange();
  }, [fetchRange]);

  return { data, loading, error, retry: fetchRange };
}
