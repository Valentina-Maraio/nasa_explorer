import { renderHook, waitFor } from '@testing-library/react';
import { useApod } from './useApod.js';
import { cacheKey, cacheSet, TTL } from '../utils/cache.js';

describe('useApod', () => {
  test('fetches and normalizes APOD data', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Galaxy',
        date: '2026-04-08',
        media_type: 'image',
        url: 'https://nasa.gov/img.jpg',
      }),
    });

    const { result } = renderHook(() => useApod('2026-04-08'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(null);
    expect(result.current.data).toMatchObject({
      title: 'Galaxy',
      date: '2026-04-08',
      media_type: 'image',
      url: 'https://nasa.gov/img.jpg',
    });
    expect(global.fetch).toHaveBeenCalledWith('/api/apod?date=2026-04-08');
  });

  test('uses cache when available', async () => {
    const key = cacheKey('apod', { date: '2026-04-08' });
    cacheSet(key, { title: 'Cached APOD' }, TTL.APOD);

    const { result } = renderHook(() => useApod('2026-04-08'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual({ title: 'Cached APOD' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('sets error on failed response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useApod('2026-04-08'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe(null);
    expect(result.current.error).toContain('HTTP error! status: 500');
  });
});
