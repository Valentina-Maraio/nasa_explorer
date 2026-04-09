import { renderHook, waitFor } from '@testing-library/react';
import { useNeo } from './useNeo.js';

describe('useNeo', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-04-08T10:00:00Z'));
  });

  afterEach(() => {
    Date.now.mockRestore();
  });

  test('normalizes hazard metrics and closest object', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        date: '2026-04-08',
        objects: [
          {
            name: 'A',
            isPotentiallyHazardous: true,
            missDistanceKilometers: 100,
            approachDateTime: '2026-Apr-08 12:30',
            absoluteMagnitude: 22,
          },
          {
            name: 'B',
            isPotentiallyHazardous: false,
            missDistanceKilometers: 50,
            approachDateTime: '2026-Apr-08 09:00',
            absoluteMagnitude: 20,
          },
        ],
      }),
    });

    const { result } = renderHook(() => useNeo('2026-04-08'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(null);
    expect(result.current.data.hazardousCount).toBe(1);
    expect(result.current.data.hazardPercent).toBe(50);
    expect(result.current.data.closestObject.name).toBe('B');
    expect(result.current.data.nextApproach.name).toBe('A');
    expect(global.fetch).toHaveBeenCalledWith('/api/neo/feed?date=2026-04-08');
  });

  test('sets error on failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useNeo('2026-04-08'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe(null);
    expect(result.current.error).toContain('HTTP error! status: 503');
  });
});
