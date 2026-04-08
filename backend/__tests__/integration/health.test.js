const request = require('supertest');
const app = require('../../app');

describe('GET /health', () => {
  afterEach(() => {
    delete process.env.NASA_API_KEY;
    delete process.env.NODE_ENV;
  });

  test('returns ok status and environment details', async () => {
    process.env.NODE_ENV = 'test';
    process.env.NASA_API_KEY = 'demo-key';

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.environment).toBe('test');
    expect(response.body.apiKeyConfigured).toBe(true);
    expect(typeof response.body.uptime).toBe('number');
  });
});
