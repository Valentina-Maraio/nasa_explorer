import { useCallback, useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheKey, cacheSet, TTL } from '../utils/cache';

function getFallback(kind) {
  return cacheGet(cacheKey(`space-weather-fallback-${kind}`));
}

function setFallback(kind, payload) {
  cacheSet(cacheKey(`space-weather-fallback-${kind}`), payload, TTL.WEATHER_FALLBACK);
}

export function useSpaceWeather({ active = false, date }) {
  const [mars, setMars] = useState(null);
  const [moon, setMoon] = useState(null);
  const [marsLoading, setMarsLoading] = useState(false);
  const [moonLoading, setMoonLoading] = useState(false);
  const [marsError, setMarsError] = useState(null);
  const [moonError, setMoonError] = useState(null);
  const [marsFromFallback, setMarsFromFallback] = useState(false);
  const [moonFromFallback, setMoonFromFallback] = useState(false);

  const fetchMars = useCallback(async () => {
    setMarsLoading(true);
    setMarsError(null);
    setMarsFromFallback(false);

    try {
      const queryDate = date ? `?date=${encodeURIComponent(date)}` : '';
      const response = await fetch(buildApiUrl(`/api/weather/mars${queryDate}`));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      setMars(payload);
      setFallback('mars', payload);
    } catch (err) {
      const fallback = getFallback('mars');
      if (fallback) {
        setMars(fallback);
        setMarsFromFallback(true);
      }
      setMarsError(err.message || 'Failed to fetch Mars weather telemetry');
    } finally {
      setMarsLoading(false);
    }
  }, [date]);

  const fetchMoon = useCallback(async () => {
    setMoonLoading(true);
    setMoonError(null);
    setMoonFromFallback(false);

    try {
      const queryDate = date ? `?date=${encodeURIComponent(date)}` : '';
      const response = await fetch(buildApiUrl(`/api/weather/moon${queryDate}`));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      setMoon(payload);
      setFallback('moon', payload);
    } catch (err) {
      const fallback = getFallback('moon');
      if (fallback) {
        setMoon(fallback);
        setMoonFromFallback(true);
      }
      setMoonError(err.message || 'Failed to fetch Moon proxy telemetry');
    } finally {
      setMoonLoading(false);
    }
  }, [date]);

  const refreshAll = useCallback(() => {
    fetchMars();
    fetchMoon();
  }, [fetchMars, fetchMoon]);

  useEffect(() => {
    if (!active) {
      return;
    }

    refreshAll();
  }, [active, refreshAll]);

  return {
    mars,
    moon,
    marsLoading,
    moonLoading,
    marsError,
    moonError,
    marsFromFallback,
    moonFromFallback,
    retryMars: fetchMars,
    retryMoon: fetchMoon,
    refreshAll,
  };
}

export default useSpaceWeather;
