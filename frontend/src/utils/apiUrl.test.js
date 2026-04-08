describe('buildApiUrl', () => {
  afterEach(() => {
    delete process.env.VITE_API_BASE_URL;
    jest.resetModules();
  });

  test('returns relative path when no base url is configured', async () => {
    const { buildApiUrl } = await import('./apiUrl.js');
    expect(buildApiUrl('/api/apod')).toBe('/api/apod');
    expect(buildApiUrl('api/apod')).toBe('/api/apod');
  });

  test('builds absolute url and trims trailing slash from base', async () => {
    process.env.VITE_API_BASE_URL = 'https://example.com///';
    jest.resetModules();

    const { buildApiUrl } = await import('./apiUrl.js');
    expect(buildApiUrl('/api/apod')).toBe('https://example.com/api/apod');
    expect(buildApiUrl('api/neo/feed')).toBe('https://example.com/api/neo/feed');
  });
});
