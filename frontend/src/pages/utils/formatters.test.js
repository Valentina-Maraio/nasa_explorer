import { formatCountdown, formatNumber } from './formatters.js';

describe('formatNumber', () => {
  test('returns placeholder for nullish and NaN values', () => {
    expect(formatNumber(null)).toBe('--');
    expect(formatNumber(undefined)).toBe('--');
    expect(formatNumber(Number.NaN)).toBe('--');
  });

  test('formats numbers with max fraction digits', () => {
    expect(formatNumber(12345)).toBe('12,345');
    expect(formatNumber(12345.678, 2)).toBe('12,345.68');
  });
});

describe('formatCountdown', () => {
  test('returns zeroed clock for invalid or elapsed duration', () => {
    expect(formatCountdown(0)).toBe('00:00:00');
    expect(formatCountdown(-100)).toBe('00:00:00');
    expect(formatCountdown(null)).toBe('00:00:00');
  });

  test('formats hh:mm:ss countdown', () => {
    expect(formatCountdown(3661000)).toBe('01:01:01');
    expect(formatCountdown(59000)).toBe('00:00:59');
  });
});
