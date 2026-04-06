import { useCallback, useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/apiUrl';
import { cacheGet, cacheKey, cacheSet, TTL } from '../utils/cache';

function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}

function parseApproachTimestamp(value) {
  if (!value) {
    return null;
  }

  const match = value.match(/^(\d{4})-([A-Za-z]{3})-(\d{2})\s+(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, year, monthName, day, hour, minute] = match;
  const monthMap = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };

  const month = monthMap[monthName];
  if (!month) {
    return null;
  }

  return Date.parse(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
}

export function useNeo(initialDate = getTodayIsoDate()) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNeo = useCallback(async (date = initialDate) => {
    setLoading(true);
    setError(null);

    try {
      const key = cacheKey('neo-feed', { date });
      const cached = cacheGet(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      const response = await fetch(buildApiUrl(`/api/neo/feed?date=${date}`));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();
      const objects = Array.isArray(payload.objects) ? payload.objects : [];
      const hazardousCount = objects.filter((item) => item.isPotentiallyHazardous).length;
      const closestObject = objects.reduce((closest, item) => {
        if (!closest || item.missDistanceKilometers < closest.missDistanceKilometers) {
          return item;
        }
        return closest;
      }, null);
      const nextApproach = objects.reduce((closest, item) => {
        const nextTime = parseApproachTimestamp(item.approachDateTime);
        if (!nextTime || nextTime < Date.now()) {
          return closest;
        }
        if (!closest || nextTime < closest.timestamp) {
          return { item, timestamp: nextTime };
        }
        return closest;
      }, null);

      const normalized = {
        date: payload.date || date,
        elementCount: payload.elementCount || objects.length,
        objects,
        hazardousCount,
        hazardPercent: objects.length ? Math.round((hazardousCount / objects.length) * 100) : 0,
        closestObject,
        nextApproach: nextApproach?.item || null,
        nextApproachTimestamp: nextApproach?.timestamp || null,
      };

      cacheSet(key, normalized, TTL.NEO);
      setData(normalized);
    } catch (err) {
      setError(err.message || 'Failed to fetch near-earth object telemetry');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [initialDate]);

  useEffect(() => {
    fetchNeo(initialDate);
  }, [fetchNeo, initialDate]);

  return {
    data,
    loading,
    error,
    fetchNeo,
  };
}

export default useNeo;