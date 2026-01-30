import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp, prisma } from '../app';

const app = createApp();

describe('Venue API Endpoints', () => {
  let testVenueId: string;
  let testServiceBarId: string;

  beforeAll(async () => {
    // Create test data
    const venue = await prisma.venue.create({
      data: {
        name: 'Test Casino ' + Date.now(), // Unique name to avoid conflicts
        address: '123 Test Street, Test City, TS 12345',
        description: 'A test casino venue',
        isActive: true,
      },
    });
    testVenueId = venue.id;

    const serviceBar = await prisma.serviceBar.create({
      data: {
        venueId: testVenueId,
        name: 'Test Bar',
        location: 'Main Floor',
        isActive: true,
        availableServers: 3,
        estimatedWaitMinutes: 5,
        status: 'low',
      },
    });
    testServiceBarId = serviceBar.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testServiceBarId) {
      await prisma.serviceBar.deleteMany({
        where: { id: testServiceBarId },
      });
    }
    if (testVenueId) {
      await prisma.venue.deleteMany({
        where: { id: testVenueId },
      });
    }
    await prisma.$disconnect();
  });

  describe('GET /api/v1/venues', () => {
    it('should return 200 with list of venues', async () => {
      const response = await request(app).get('/api/v1/venues');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return venues with serviceBarsCount', async () => {
      const response = await request(app).get('/api/v1/venues');

      expect(response.status).toBe(200);
      const venues = response.body.data;

      if (venues.length > 0) {
        const venue = venues[0];
        expect(venue).toHaveProperty('id');
        expect(venue).toHaveProperty('name');
        expect(venue).toHaveProperty('address');
        expect(venue).toHaveProperty('serviceBarsCount');
        expect(typeof venue.serviceBarsCount).toBe('number');
      }
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/v1/venues');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('response should be visible and structured', async () => {
      const response = await request(app).get('/api/v1/venues');

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();

      // Check that data is present and visible
      const venues = response.body.data;
      expect(venues.length).toBeGreaterThan(0);

      const testVenue = venues.find((v: { id: string }) => v.id === testVenueId);
      expect(testVenue).toBeDefined();
      expect(testVenue.name).toContain('Test Casino');
    });
  });

  describe('GET /api/v1/venues/:id', () => {
    it('should return 200 with venue details', async () => {
      const response = await request(app).get(`/api/v1/venues/${testVenueId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', testVenueId);
      expect(response.body.data.name).toContain('Test Casino');
      expect(response.body.data).toHaveProperty('serviceBarsCount');
    });

    it('should return 404 for non-existent venue', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/api/v1/venues/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VENUE_NOT_FOUND');
      expect(response.body.error).toHaveProperty('message', 'Venue not found');
    });

    it('venue details should be visible with all required fields', async () => {
      const response = await request(app).get(`/api/v1/venues/${testVenueId}`);

      const venue = response.body.data;
      expect(venue.name).toBeTruthy();
      expect(venue.address).toBeTruthy();
      expect(venue.description).toBeDefined();
      expect(venue.timezone).toBeTruthy();
      expect(typeof venue.serviceBarsCount).toBe('number');
    });
  });

  describe('GET /api/v1/venues/:id/bars', () => {
    it('should return 200 with list of service bars', async () => {
      const response = await request(app).get(`/api/v1/venues/${testVenueId}/bars`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return service bars with status information', async () => {
      const response = await request(app).get(`/api/v1/venues/${testVenueId}/bars`);

      expect(response.status).toBe(200);
      const bars = response.body.data;

      if (bars.length > 0) {
        const bar = bars[0];
        expect(bar).toHaveProperty('id');
        expect(bar).toHaveProperty('name');
        expect(bar).toHaveProperty('location');
        expect(bar).toHaveProperty('activeOrders');
        expect(bar).toHaveProperty('availableServers');
        expect(bar).toHaveProperty('estimatedWaitMinutes');
        expect(bar).toHaveProperty('status');
        expect(typeof bar.activeOrders).toBe('number');
      }
    });

    it('should return 404 for non-existent venue', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/api/v1/venues/${fakeId}/bars`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'VENUE_NOT_FOUND');
    });

    it('service bars data should be visible with real-time status', async () => {
      const response = await request(app).get(`/api/v1/venues/${testVenueId}/bars`);

      const bars = response.body.data;
      expect(bars.length).toBeGreaterThan(0);

      const testBar = bars.find((b: { id: string }) => b.id === testServiceBarId);
      expect(testBar).toBeDefined();
      expect(testBar.name).toBe('Test Bar');
      expect(testBar.location).toBe('Main Floor');
      expect(testBar.status).toBe('low');
      expect(testBar.availableServers).toBe(3);
      expect(testBar.estimatedWaitMinutes).toBe(5);
    });
  });

  describe('GET /api/v1/bars/:id', () => {
    it('should return 200 with service bar details', async () => {
      const response = await request(app).get(`/api/v1/bars/${testServiceBarId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', testServiceBarId);
      expect(response.body.data).toHaveProperty('name', 'Test Bar');
    });

    it('should include venue information', async () => {
      const response = await request(app).get(`/api/v1/bars/${testServiceBarId}`);

      expect(response.status).toBe(200);
      const bar = response.body.data;

      expect(bar).toHaveProperty('venue');
      expect(bar.venue).toHaveProperty('id', testVenueId);
      expect(bar.venue.name).toContain('Test Casino');
    });

    it('should include real-time status fields', async () => {
      const response = await request(app).get(`/api/v1/bars/${testServiceBarId}`);

      const bar = response.body.data;
      expect(bar).toHaveProperty('activeOrders');
      expect(bar).toHaveProperty('availableServers', 3);
      expect(bar).toHaveProperty('estimatedWaitMinutes', 5);
      expect(bar).toHaveProperty('status', 'low');
      expect(typeof bar.activeOrders).toBe('number');
    });

    it('should return 404 for non-existent service bar', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/api/v1/bars/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'SERVICE_BAR_NOT_FOUND');
      expect(response.body.error).toHaveProperty('message', 'Service bar not found');
    });

    it('service bar details should be visible and complete', async () => {
      const response = await request(app).get(`/api/v1/bars/${testServiceBarId}`);

      const bar = response.body.data;
      expect(bar.name).toBeTruthy();
      expect(bar.location).toBeTruthy();
      expect(bar.status).toBeTruthy();
      expect(bar.venue.name).toBeTruthy();
      expect(bar.venue.address).toBeTruthy();
    });
  });

  describe('Response Structure Consistency', () => {
    it('all successful responses should follow the same structure', async () => {
      const endpoints = [
        '/api/v1/venues',
        `/api/v1/venues/${testVenueId}`,
        `/api/v1/venues/${testVenueId}/bars`,
        `/api/v1/bars/${testServiceBarId}`,
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.headers['content-type']).toMatch(/application\/json/);
      }
    });

    it('all error responses should follow the same structure', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const endpoints = [`/api/v1/venues/${fakeId}`, `/api/v1/bars/${fakeId}`];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('code');
        expect(response.body.error).toHaveProperty('message');
      }
    });
  });
});
