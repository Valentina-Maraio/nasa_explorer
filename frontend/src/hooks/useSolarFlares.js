import { useCallback, useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheKey, cacheSet, TTL } from '../utils/cache';

function getFallback() {
  return cacheGet(cacheKey('solar-flares-fallback'));
}

function setFallback(payload) {
  cacheSet(cacheKey('solar-flares-fallback'), payload, TTL.WEATHER_FALLBACK);
}

function getDefaultDateRange() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return {
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
}

export function useSolarFlares({ active = false, startDate, endDate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromFallback, setFromFallback] = useState(false);

  const fetchSolarFlares = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFromFallback(false);

    try {
      const dateRange = getDefaultDateRange();
      const params = new URLSearchParams({
        startDate: startDate || dateRange.startDate,
        endDate: endDate || dateRange.endDate,
      });

      const response = await fetch(buildApiUrl(`/api/weather/solar?${params.toString()}`));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      setData(payload);
      setFallback(payload);
    } catch (err) {
      const fallback = getFallback();
      if (fallback) {
        setData(fallback);
        setFromFallback(true);
      }
      setError(err.message || 'Failed to fetch solar flare data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!active) {
      return;
    }

    fetchSolarFlares();
  }, [active, fetchSolarFlares]);

  return {
    data,
    loading,
    error,
    fromFallback,
    retry: fetchSolarFlares,
    refresh: fetchSolarFlares,
  };
}

export default useSolarFlares;
