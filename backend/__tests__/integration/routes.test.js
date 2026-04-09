jest.mock('../../services/nasaService', () => ({
  fetchApod: jest.fn(),
  fetchNeoFeed: jest.fn(),
  fetchMarsWeather: jest.fn(),
  fetchMoonWeatherProxy: jest.fn(),
  fetchEpicNatural: jest.fn(),
  searchImages: jest.fn(),
  fetchAsset: jest.fn(),
  fetchMetadata: jest.fn(),
  fetchMarsManifest: jest.fn(),
}));

const request = require('supertest');
const app = require('../../app');
const nasaService = require('../../services/nasaService');

describe('API route contracts', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('GET /api/apod returns payload from service', async () => {
    nasaService.fetchApod.mockResolvedValueOnce({
      title: 'Test APOD',
      date: '2026-04-08',
    });

    const response = await request(app).get('/api/apod?date=2026-04-08');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ title: 'Test APOD', date: '2026-04-08' });
    expect(nasaService.fetchApod).toHaveBeenCalledWith('2026-04-08');
  });

  test('GET /api/apod rejects invalid date query', async () => {
    const response = await request(app).get('/api/apod?date=not-a-date');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(response.body.error).toBe('Invalid request parameters');
    expect(nasaService.fetchApod).not.toHaveBeenCalled();
  });

  test('GET /api/neo/feed returns normalized response shape', async () => {
    nasaService.fetchNeoFeed.mockResolvedValueOnce({
      element_count: 1,
      near_earth_objects: {
        '2026-04-08': [
          {
            id: '123',
            name: 'Ast-1',
            nasa_jpl_url: 'https://example.test',
            is_potentially_hazardous_asteroid: true,
            absolute_magnitude_h: 23.1,
            estimated_diameter: {
              meters: { estimated_diameter_max: 140.5 },
            },
            close_approach_data: [
              {
                close_approach_date: '2026-04-08',
                close_approach_date_full: '2026-Apr-08 12:00',
                miss_distance: { kilometers: '45000' },
                relative_velocity: { kilometers_per_second: '11.2' },
                orbiting_body: 'Earth',
              },
            ],
          },
        ],
      },
    });

    const response = await request(app).get('/api/neo/feed?date=2026-04-08');

    expect(response.status).toBe(200);
    expect(response.body.date).toBe('2026-04-08');
    expect(response.body.elementCount).toBe(1);
    expect(response.body.objects).toHaveLength(1);
    expect(response.body.objects[0]).toMatchObject({
      id: '123',
      name: 'Ast-1',
      isPotentiallyHazardous: true,
      approachDate: '2026-04-08',
      orbitingBody: 'Earth',
    });
  });

  test('GET /api/weather/mars rejects unsupported units', async () => {
    const response = await request(app).get('/api/weather/mars?units=kelvin');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(nasaService.fetchMarsWeather).not.toHaveBeenCalled();
  });

  test('GET /api/weather/moon returns synthesized proxy response', async () => {
    nasaService.fetchMoonWeatherProxy.mockResolvedValueOnce({
      date: '2026-04-08',
      items: [
        {
          date: '2026-04-08T00:00:00Z',
          lunar_j2000_position: { x: 1, y: 0, z: 0 },
          sun_j2000_position: { x: 1, y: 1, z: 0 },
        },
      ],
      history: [
        {
          date: '2026-04-08',
          item: {
            date: '2026-04-08T00:00:00Z',
            lunar_j2000_position: { x: 1, y: 0, z: 0 },
            sun_j2000_position: { x: 1, y: 1, z: 0 },
            caption: 'Test caption',
          },
        },
      ],
    });

    const response = await request(app).get('/api/weather/moon?date=2026-04-08&days=7');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.source).toContain('EPIC');
    expect(Array.isArray(response.body.history)).toBe(true);
    expect(response.body.history.length).toBeGreaterThan(0);
    expect(response.body.proxyMetrics).toEqual(
      expect.objectContaining({
        lunarDistanceAu: expect.any(Number),
        sunDistanceAu: expect.any(Number),
      }),
    );
    expect(nasaService.fetchMoonWeatherProxy).toHaveBeenCalledWith('2026-04-08', 7);
  });

  test('GET /api/epic/natural returns transformed EPIC images', async () => {
    nasaService.fetchEpicNatural.mockResolvedValueOnce([
      {
        identifier: 'id-1',
        caption: 'Earth view',
        image: 'epic_1',
        date: '2026-04-08 00:10:00',
      },
    ]);

    const response = await request(app).get('/api/epic/natural?date=2026-04-08');

    expect(response.status).toBe(200);
    expect(response.body.date).toBe('2026-04-08');
    expect(response.body.imageCount).toBe(1);
    expect(response.body.images[0]).toMatchObject({
      identifier: 'id-1',
      image: 'epic_1',
    });
    expect(response.body.images[0].archiveUrl).toContain('/2026/04/08/png/epic_1.png');
  });

  test('GET /api/images/search forwards filters', async () => {
    nasaService.searchImages.mockResolvedValueOnce({ collection: { items: [] } });

    const response = await request(app).get('/api/images/search?q=nebula&page=2&page_size=6');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ collection: { items: [] } });
    expect(nasaService.searchImages).toHaveBeenCalledWith({
      q: 'nebula',
      page: 2,
      page_size: 6,
    });
  });

  test('GET /api/images/search rejects invalid page_size', async () => {
    const response = await request(app).get('/api/images/search?q=nebula&page_size=999');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(nasaService.searchImages).not.toHaveBeenCalled();
  });

  test('GET /api/images/asset requires nasa_id', async () => {
    const response = await request(app).get('/api/images/asset');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(nasaService.fetchAsset).not.toHaveBeenCalled();
  });

  test('GET /api/images/metadata returns service payload', async () => {
    nasaService.fetchMetadata.mockResolvedValueOnce({ href: 'https://meta.test' });

    const response = await request(app).get('/api/images/metadata?nasa_id=ABC123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ href: 'https://meta.test' });
    expect(nasaService.fetchMetadata).toHaveBeenCalledWith('ABC123');
  });

  test('GET /api/mars/manifest maps photo_manifest payload', async () => {
    nasaService.fetchMarsManifest.mockResolvedValueOnce({
      photo_manifest: {
        name: 'Curiosity',
        landing_date: '2012-08-06',
        launch_date: '2011-11-26',
        status: 'active',
        max_sol: 10,
        max_date: '2026-04-08',
        total_photos: 999,
        photos: [
          {
            sol: 10,
            earth_date: '2026-04-08',
            total_photos: 12,
            cameras: ['MAST'],
          },
        ],
      },
    });

    const response = await request(app).get('/api/mars/manifest?rover=curiosity');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: 'Curiosity',
      maxSol: 10,
      latestPhotos: {
        sol: 10,
        earthDate: '2026-04-08',
        totalPhotos: 12,
      },
    });
    expect(nasaService.fetchMarsManifest).toHaveBeenCalledWith('curiosity');
  });
});
