import { renderHook, waitFor, act } from '@testing-library/react';
import { useSpaceWeather } from './useSpaceWeather.js';
import { cacheKey, cacheSet, TTL } from '../utils/cache.js';

describe('useSpaceWeather', () => {
  test('does not fetch when inactive', () => {
    renderHook(() => useSpaceWeather({ active: false, date: '2026-04-08' }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('fetches mars and moon weather when active', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ source: 'mars' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ source: 'moon' }),
      });

    const { result } = renderHook(() => useSpaceWeather({ active: true, date: '2026-04-08' }));

    await waitFor(() => expect(result.current.marsLoading).toBe(false));
    await waitFor(() => expect(result.current.moonLoading).toBe(false));

    expect(result.current.mars).toEqual({ source: 'mars' });
    expect(result.current.moon).toEqual({ source: 'moon' });
    expect(global.fetch).toHaveBeenCalledWith('/api/weather/mars?date=2026-04-08');
    expect(global.fetch).toHaveBeenCalledWith('/api/weather/moon?days=7&date=2026-04-08');
  });

  test('uses fallback for mars when request fails', async () => {
    cacheSet(cacheKey('space-weather-fallback-mars'), { source: 'fallback-mars' }, TTL.WEATHER_FALLBACK);

    global.fetch
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ source: 'moon' }) });

    const { result } = renderHook(() => useSpaceWeather({ active: true, date: '2026-04-08' }));

    await waitFor(() => expect(result.current.marsLoading).toBe(false));

    expect(result.current.mars).toEqual({ source: 'fallback-mars' });
    expect(result.current.marsFromFallback).toBe(true);
    expect(result.current.marsError).toContain('HTTP error! status: 500');

    await act(async () => {
      await result.current.retryMars();
    });
  });
});
