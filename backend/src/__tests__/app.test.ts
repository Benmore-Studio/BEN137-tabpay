import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { createApp, prisma } from '../app';

const app = createApp();

describe('TabPay Backend API', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Root Endpoint', () => {
    it('GET / should return 200 with healthy status', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('service', 'TabPay Backend');
      expect(response.body.data).toHaveProperty('version', '1.0.0');
    });

    it('GET / should return JSON content type', async () => {
      const response = await request(app).get('/');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('GET / response should have correct structure', async () => {
      const response = await request(app).get('/');

      // Verify the response structure is visible and correct
      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'healthy',
          service: 'TabPay Backend',
          version: '1.0.0',
        },
      });
    });
  });

  describe('Health Endpoint', () => {
    it('GET /health should return database status', async () => {
      const response = await request(app).get('/health');

      // Should return either connected or disconnected status
      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('status', 'healthy');
        expect(response.body.data).toHaveProperty('database', 'connected');
      } else {
        expect(response.body.success).toBe(false);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('code', 'DATABASE_ERROR');
        expect(response.body.error).toHaveProperty('message');
      }
    });

    it('GET /health should return JSON content type', async () => {
      const response = await request(app).get('/health');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('API v1 Health Endpoint', () => {
    it('GET /api/v1/health should return 200 with API health status', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('api', 'v1');
    });

    it('GET /api/v1/health response should have correct structure', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'healthy',
          api: 'v1',
        },
      });
    });
  });

  describe('404 Error Handling', () => {
    it('GET /nonexistent should return 404 with error structure', async () => {
      const response = await request(app).get('/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('/nonexistent');
    });

    it('GET /api/v1/nonexistent should return 404', async () => {
      const response = await request(app).get('/api/v1/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });

    it('POST /api/v1/nonexistent should return 404', async () => {
      const response = await request(app).post('/api/v1/nonexistent').send({});

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });

    it('404 error response should be visible JSON', async () => {
      const response = await request(app).get('/does-not-exist');

      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.error.message).toBeTruthy();
      expect(response.body.error.message.length).toBeGreaterThan(0);
    });
  });

  describe('CORS Configuration', () => {
    it('should include CORS headers on requests', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:5173');

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should handle preflight OPTIONS request', async () => {
      const response = await request(app)
        .options('/')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(response.headers['access-control-allow-methods']).toContain('GET');
    });

    it('should allow credentials', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:5173');

      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('JSON Body Parsing', () => {
    it('should accept JSON body on POST requests', async () => {
      const response = await request(app)
        .post('/api/v1/nonexistent')
        .set('Content-Type', 'application/json')
        .send({ test: 'data' });

      // Should get 404, not 400 (body was parsed correctly)
      expect(response.status).toBe(404);
    });
  });

  describe('Response Structure Consistency', () => {
    it('all successful responses should have success: true and data property', async () => {
      const endpoints = ['/', '/api/v1/health'];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);

        if (response.status === 200) {
          expect(response.body).toHaveProperty('success', true);
          expect(response.body).toHaveProperty('data');
          expect(typeof response.body.data).toBe('object');
        }
      }
    });

    it('all error responses should have success: false and error property', async () => {
      const endpoints = ['/nonexistent', '/api/v1/invalid'];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('code');
        expect(response.body.error).toHaveProperty('message');
      }
    });
  });

  describe('UI Response Visibility', () => {
    it('root endpoint data should be human-readable', async () => {
      const response = await request(app).get('/');

      // Check that the response contains visible, meaningful data
      const data = response.body.data;
      expect(data.status).toBe('healthy');
      expect(data.service).toBe('TabPay Backend');
      expect(data.version).toMatch(/^\d+\.\d+\.\d+$/); // version format
    });

    it('API v1 health should clearly show API version', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.body.data.api).toBe('v1');
      expect(response.body.data.status).toBe('healthy');
    });

    it('error messages should be descriptive', async () => {
      const response = await request(app).get('/some/invalid/route');

      expect(response.body.error.message).toContain('/some/invalid/route');
      expect(response.body.error.message).toContain('not found');
    });
  });
});
