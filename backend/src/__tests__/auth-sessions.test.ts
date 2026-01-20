import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp, prisma } from '../app';
import { config } from '../config';

const app = createApp();

describe('Auth API - Login & Sessions', () => {
  const testEmail = `testsession${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';
  let testUserId: string;
  let testToken: string;

  beforeAll(async () => {
    // Create a test user first
    const response = await request(app).post('/api/v1/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: 'Session',
      lastName: 'Test',
      phone: '+1234567890',
    });

    testUserId = response.body.data.user.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.userPreferences.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 200 and token with valid credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('expiresAt');

      testToken = response.body.data.token;
    });

    it('should return user data without password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      const user = response.body.data.user;
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email', testEmail.toLowerCase());
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).not.toHaveProperty('password');
    });

    it('should return valid JWT token', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      const token = response.body.data.token;
      const decoded = jwt.verify(token, config.jwt.secret) as {
        userId: string;
        email: string;
      };

      expect(decoded.userId).toBe(testUserId);
      expect(decoded.email).toBe(testEmail.toLowerCase());
    });

    it('should create session in database', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      const token = response.body.data.token;
      const session = await prisma.session.findUnique({
        where: { token },
      });

      expect(session).toBeTruthy();
      expect(session!.userId).toBe(testUserId);
      expect(session!.token).toBe(token);
    });

    it('should return expiresAt timestamp', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      expect(response.body.data.expiresAt).toBeTruthy();
      const expiresAt = new Date(response.body.data.expiresAt);
      expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: testPassword,
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'INVALID_CREDENTIALS');
      expect(response.body.error).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toHaveProperty('code', 'INVALID_CREDENTIALS');
      expect(response.body.error).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        password: testPassword,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should handle case-insensitive email login', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail.toUpperCase(),
        password: testPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body.data.user.email).toBe(testEmail.toLowerCase());
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return 200 and delete session', async () => {
      // Login first
      const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      const token = loginResponse.body.data.token;

      // Logout
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('message');

      // Verify session is deleted
      const session = await prisma.session.findUnique({
        where: { token },
      });
      expect(session).toBeNull();
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app).post('/api/v1/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'NO_TOKEN');
    });

    it('should return 401 for invalid token format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body.error).toHaveProperty('code', 'NO_TOKEN');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should return 200 with new token', async () => {
      // Login first
      const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      const oldToken = loginResponse.body.data.token;

      // Wait a bit to ensure new token is different
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refresh token
      const response = await request(app).post('/api/v1/auth/refresh').send({
        token: oldToken,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('expiresAt');

      // New token should be different
      const newToken = response.body.data.token;
      expect(newToken).not.toBe(oldToken);

      // Old session should be updated
      const oldSession = await prisma.session.findUnique({
        where: { token: oldToken },
      });
      expect(oldSession).toBeNull();

      // New session should exist
      const newSession = await prisma.session.findUnique({
        where: { token: newToken },
      });
      expect(newSession).toBeTruthy();
    });

    it('should return valid user data with new token', async () => {
      // Login first
      const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      const oldToken = loginResponse.body.data.token;

      // Refresh token
      const response = await request(app).post('/api/v1/auth/refresh').send({
        token: oldToken,
      });

      const user = response.body.data.user;
      expect(user.id).toBe(testUserId);
      expect(user.email).toBe(testEmail.toLowerCase());
      expect(user).not.toHaveProperty('password');
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app).post('/api/v1/auth/refresh').send({
        token: 'invalid.jwt.token',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'INVALID_TOKEN');
    });

    it('should return 401 for non-existent session', async () => {
      // Delete all existing sessions for this user first
      await prisma.session.deleteMany({
        where: { userId: testUserId },
      });

      // Create a valid JWT but with no session in DB
      const fakeToken = jwt.sign(
        { userId: testUserId, email: testEmail },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      const response = await request(app).post('/api/v1/auth/refresh').send({
        token: fakeToken,
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toHaveProperty('code', 'SESSION_NOT_FOUND');
    });

    it('should return 400 for missing token', async () => {
      const response = await request(app).post('/api/v1/auth/refresh').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('Response Visibility', () => {
    it('login response should be visible with all fields', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      expect(response.body.data.token).toBeTruthy();
      expect(response.body.data.expiresAt).toBeTruthy();
      expect(response.body.data.user.firstName).toBe('Session');
      expect(response.body.data.user.lastName).toBe('Test');
    });

    it('refresh response should be visible with all fields', async () => {
      // Login first
      const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: testEmail,
        password: testPassword,
      });

      // Refresh
      const response = await request(app).post('/api/v1/auth/refresh').send({
        token: loginResponse.body.data.token,
      });

      expect(response.body.data.token).toBeTruthy();
      expect(response.body.data.expiresAt).toBeTruthy();
      expect(response.body.data.user.id).toBeTruthy();
    });
  });
});
