describe('nasaService', () => {
  let clientGet;
  let service;

  beforeEach(() => {
    jest.resetModules();
    clientGet = jest.fn();
    process.env.NASA_API_KEY = 'test-key';

    jest.doMock('axios', () => ({
      create: jest.fn(() => ({ get: clientGet })),
    }));

    jest.isolateModules(() => {
      service = require('../../../services/nasaService');
    });
  });

  afterEach(() => {
    delete process.env.NASA_API_KEY;
    jest.clearAllMocks();
  });

  test('fetchApod returns response data on success', async () => {
    const mockData = { title: 'APOD Title' };
    clientGet.mockResolvedValueOnce({ data: mockData });

    const result = await service.fetchApod('2026-04-08');

    expect(result).toEqual(mockData);
    expect(clientGet).toHaveBeenCalledWith('https://api.nasa.gov/planetary/apod', {
      params: {
        api_key: 'test-key',
        date: '2026-04-08',
      },
    });
  });

  test('fetchApod throws missing key error when NASA_API_KEY is absent', async () => {
    delete process.env.NASA_API_KEY;

    await expect(service.fetchApod('2026-04-08')).rejects.toMatchObject({
      code: 'MISSING_NASA_API_KEY',
      statusCode: 500,
    });
  });

  test('maps timeout errors to NASA_TIMEOUT', async () => {
    clientGet.mockRejectedValueOnce({ code: 'ECONNABORTED' });

    await expect(service.fetchApod('2026-04-08')).rejects.toMatchObject({
      code: 'NASA_TIMEOUT',
      statusCode: 504,
    });
  });

  test('maps upstream response errors to NASA_UPSTREAM_ERROR', async () => {
    clientGet.mockRejectedValueOnce({ response: { status: 503 } });

    await expect(service.fetchApod('2026-04-08')).rejects.toMatchObject({
      code: 'NASA_UPSTREAM_ERROR',
      statusCode: 502,
      meta: { upstreamStatus: 503 },
    });
  });
});
