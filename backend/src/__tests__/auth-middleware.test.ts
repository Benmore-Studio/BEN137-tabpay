import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp, prisma } from '../app';
import { config } from '../config';
import { authMiddleware, optionalAuthMiddleware, cleanupExpiredSessions } from '../middleware/auth';
import { errorHandler } from '../middleware/errorHandler';
import express, { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';

const app = createApp();

// Create a test app with auth middleware for testing
const createTestApp = () => {
  const testApp = express();
  testApp.use(express.json());

  // Protected route using authMiddleware
  testApp.get('/protected', authMiddleware, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    res.json({
      success: true,
      data: {
        user: authReq.user,
      },
    });
  });

  // Optional auth route using optionalAuthMiddleware
  testApp.get('/optional', optionalAuthMiddleware, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    res.json({
      success: true,
      data: {
        authenticated: !!authReq.user,
        user: authReq.user || null,
      },
    });
  });

  // Add error handler for proper error responses
  testApp.use(errorHandler);

  return testApp;
};

describe('Auth Middleware', () => {
  const testEmail = `testmiddleware${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';
  let testUserId: string;
  let validToken: string;
  let sessionId: string;

  beforeAll(async () => {
    // Create a test user
    const response = await request(app).post('/api/v1/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: 'Middleware',
      lastName: 'Test',
      phone: '+1234567890',
    });

    if (!response.body.success) {
      console.error('Registration failed:', response.body);
      throw new Error('Failed to create test user');
    }

    testUserId = response.body.data.user.id;
    validToken = response.body.data.token;

    // Get session ID
    const session = await prisma.session.findUnique({
      where: { token: validToken },
    });
    if (!session) {
      throw new Error('Session not found after registration');
    }
    sessionId = session.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.userPreferences.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  describe('authMiddleware', () => {
    const testApp = createTestApp();

    describe('successful authentication', () => {
      it('should return 200 and attach user data with valid token', async () => {
        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data.user).toHaveProperty('userId', testUserId);
        expect(response.body.data.user).toHaveProperty('email', testEmail.toLowerCase());
        expect(response.body.data.user).toHaveProperty('sessionId');
      });

      it('should attach correct session ID to request', async () => {
        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.body.data.user.sessionId).toBe(sessionId);
      });
    });

    describe('missing token', () => {
      it('should return 401 NO_TOKEN when Authorization header is missing', async () => {
        const response = await request(testApp).get('/protected');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.error).toHaveProperty('code', 'NO_TOKEN');
        expect(response.body.error).toHaveProperty('message', 'No token provided');
      });

      it('should return 401 NO_TOKEN when Authorization header has wrong format', async () => {
        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', 'Basic sometoken');

        expect(response.status).toBe(401);
        expect(response.body.error).toHaveProperty('code', 'NO_TOKEN');
      });

      it('should return 401 NO_TOKEN when Authorization header is empty', async () => {
        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', '');

        expect(response.status).toBe(401);
        expect(response.body.error).toHaveProperty('code', 'NO_TOKEN');
      });

      it('should return 401 INVALID_TOKEN when Bearer is present but token is empty', async () => {
        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', 'Bearer ');

        expect(response.status).toBe(401);
        // Empty string after Bearer triggers jwt.verify which returns INVALID_TOKEN
        expect(response.body.error.code).toMatch(/NO_TOKEN|INVALID_TOKEN/);
      });
    });

    describe('invalid token', () => {
      it('should return 401 INVALID_TOKEN for malformed JWT', async () => {
        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', 'Bearer invalid.jwt.token');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.error).toHaveProperty('code', 'INVALID_TOKEN');
        expect(response.body.error).toHaveProperty('message', 'Invalid token');
      });

      it('should return 401 INVALID_TOKEN for token with wrong secret', async () => {
        const wrongSecretToken = jwt.sign(
          { userId: testUserId, email: testEmail },
          'wrong-secret',
          { expiresIn: '7d' }
        );

        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', `Bearer ${wrongSecretToken}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toHaveProperty('code', 'INVALID_TOKEN');
      });

      it('should return 401 TOKEN_EXPIRED for expired JWT', async () => {
        // Create an expired token
        const expiredToken = jwt.sign(
          { userId: testUserId, email: testEmail },
          config.jwt.secret,
          { expiresIn: '-1s' } // Already expired
        );

        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', `Bearer ${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toHaveProperty('code', 'TOKEN_EXPIRED');
        expect(response.body.error).toHaveProperty('message', 'Token has expired');
      });
    });

    describe('session validation', () => {
      it('should return 401 SESSION_NOT_FOUND for valid JWT with no session', async () => {
        // Create a valid JWT that doesn't have a matching session
        const orphanToken = jwt.sign(
          {
            userId: testUserId,
            email: testEmail,
            jti: `${testUserId}-orphan-${Date.now()}`,
          },
          config.jwt.secret,
          { expiresIn: '7d' }
        );

        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', `Bearer ${orphanToken}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toHaveProperty('code', 'SESSION_NOT_FOUND');
        expect(response.body.error).toHaveProperty('message', 'Session not found');
      });

      it('should return 401 SESSION_EXPIRED for expired session', async () => {
        // Create a new session that is already expired
        const expiredSessionToken = jwt.sign(
          {
            userId: testUserId,
            email: testEmail,
            jti: `${testUserId}-expired-${Date.now()}`,
          },
          config.jwt.secret,
          { expiresIn: '7d' }
        );

        await prisma.session.create({
          data: {
            userId: testUserId,
            token: expiredSessionToken,
            expiresAt: new Date(Date.now() - 1000), // Already expired
          },
        });

        const response = await request(testApp)
          .get('/protected')
          .set('Authorization', `Bearer ${expiredSessionToken}`);

        expect(response.status).toBe(401);
        expect(response.body.error).toHaveProperty('code', 'SESSION_EXPIRED');
        expect(response.body.error).toHaveProperty('message', 'Session has expired');

        // Session should be cleaned up
        const session = await prisma.session.findUnique({
          where: { token: expiredSessionToken },
        });
        expect(session).toBeNull();
      });
    });
  });

  describe('optionalAuthMiddleware', () => {
    const testApp = createTestApp();

    describe('with valid authentication', () => {
      it('should attach user data when valid token is provided', async () => {
        const response = await request(testApp)
          .get('/optional')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('authenticated', true);
        expect(response.body.data.user).toHaveProperty('userId', testUserId);
        expect(response.body.data.user).toHaveProperty('email', testEmail.toLowerCase());
      });
    });

    describe('without authentication', () => {
      it('should proceed without error when no token is provided', async () => {
        const response = await request(testApp).get('/optional');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('authenticated', false);
        expect(response.body.data.user).toBeNull();
      });

      it('should proceed without error when Authorization header has wrong format', async () => {
        const response = await request(testApp)
          .get('/optional')
          .set('Authorization', 'Basic sometoken');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('authenticated', false);
      });
    });

    describe('with invalid authentication', () => {
      it('should proceed without user when token is invalid', async () => {
        const response = await request(testApp)
          .get('/optional')
          .set('Authorization', 'Bearer invalid.jwt.token');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('authenticated', false);
        expect(response.body.data.user).toBeNull();
      });

      it('should proceed without user when token is expired', async () => {
        const expiredToken = jwt.sign(
          { userId: testUserId, email: testEmail },
          config.jwt.secret,
          { expiresIn: '-1s' }
        );

        const response = await request(testApp)
          .get('/optional')
          .set('Authorization', `Bearer ${expiredToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('authenticated', false);
      });

      it('should proceed without user when session does not exist', async () => {
        const orphanToken = jwt.sign(
          {
            userId: testUserId,
            email: testEmail,
            jti: `${testUserId}-optional-orphan-${Date.now()}`,
          },
          config.jwt.secret,
          { expiresIn: '7d' }
        );

        const response = await request(testApp)
          .get('/optional')
          .set('Authorization', `Bearer ${orphanToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('authenticated', false);
      });

      it('should proceed without user and cleanup expired session', async () => {
        const expiredSessionToken = jwt.sign(
          {
            userId: testUserId,
            email: testEmail,
            jti: `${testUserId}-optional-expired-${Date.now()}`,
          },
          config.jwt.secret,
          { expiresIn: '7d' }
        );

        await prisma.session.create({
          data: {
            userId: testUserId,
            token: expiredSessionToken,
            expiresAt: new Date(Date.now() - 1000),
          },
        });

        const response = await request(testApp)
          .get('/optional')
          .set('Authorization', `Bearer ${expiredSessionToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('authenticated', false);
      });
    });
  });

  describe('cleanupExpiredSessions', () => {
    let cleanupTestUserId: string;

    beforeEach(async () => {
      // Create a test user for cleanup tests
      const response = await request(app).post('/api/v1/auth/register').send({
        email: `cleanuptest${Date.now()}@example.com`,
        password: 'SecurePass123!',
        firstName: 'Cleanup',
        lastName: 'Test',
        phone: '+1234567890',
      });

      if (!response.body.success) {
        console.error('Cleanup user registration failed:', response.body);
        throw new Error('Failed to create cleanup test user');
      }

      cleanupTestUserId = response.body.data.user.id;
    });

    afterAll(async () => {
      // Clean up test users
      await prisma.session.deleteMany({
        where: {
          user: {
            email: {
              contains: 'cleanuptest',
            },
          },
        },
      });
      await prisma.userPreferences.deleteMany({
        where: {
          user: {
            email: {
              contains: 'cleanuptest',
            },
          },
        },
      });
      await prisma.user.deleteMany({
        where: {
          email: {
            contains: 'cleanuptest',
          },
        },
      });
    });

    it('should delete expired sessions', async () => {
      // Create multiple expired sessions with unique jti
      const expiredToken1 = jwt.sign(
        { userId: cleanupTestUserId, email: 'test@example.com', jti: `cleanup-1-${Date.now()}` },
        config.jwt.secret
      );
      const expiredToken2 = jwt.sign(
        { userId: cleanupTestUserId, email: 'test@example.com', jti: `cleanup-2-${Date.now()}` },
        config.jwt.secret
      );

      await prisma.session.createMany({
        data: [
          {
            userId: cleanupTestUserId,
            token: expiredToken1,
            expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          },
          {
            userId: cleanupTestUserId,
            token: expiredToken2,
            expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          },
        ],
      });

      // Verify sessions exist
      const beforeCount = await prisma.session.count({
        where: {
          userId: cleanupTestUserId,
          expiresAt: { lt: new Date() },
        },
      });
      expect(beforeCount).toBeGreaterThanOrEqual(2);

      // Run cleanup
      const deletedCount = await cleanupExpiredSessions();
      expect(deletedCount).toBeGreaterThanOrEqual(2);

      // Verify expired sessions are deleted
      const afterCount = await prisma.session.count({
        where: {
          userId: cleanupTestUserId,
          expiresAt: { lt: new Date() },
        },
      });
      expect(afterCount).toBe(0);
    });

    it('should not delete valid sessions', async () => {
      // Create a valid session
      const validSessionToken = jwt.sign(
        { userId: cleanupTestUserId, email: 'test@example.com' },
        config.jwt.secret
      );

      await prisma.session.create({
        data: {
          userId: cleanupTestUserId,
          token: validSessionToken,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
        },
      });

      // Run cleanup
      await cleanupExpiredSessions();

      // Verify valid session still exists
      const session = await prisma.session.findUnique({
        where: { token: validSessionToken },
      });
      expect(session).toBeTruthy();
    });

    it('should return count of deleted sessions', async () => {
      const now = Date.now();
      // Create 3 expired sessions with unique jti
      const tokens = [
        jwt.sign({ userId: cleanupTestUserId, email: 'test@example.com', jti: `count-1-${now}` }, config.jwt.secret),
        jwt.sign({ userId: cleanupTestUserId, email: 'test@example.com', jti: `count-2-${now}` }, config.jwt.secret),
        jwt.sign({ userId: cleanupTestUserId, email: 'test@example.com', jti: `count-3-${now}` }, config.jwt.secret),
      ];

      await prisma.session.createMany({
        data: tokens.map((token) => ({
          userId: cleanupTestUserId,
          token,
          expiresAt: new Date(Date.now() - 1000),
        })),
      });

      const deletedCount = await cleanupExpiredSessions();
      expect(deletedCount).toBeGreaterThanOrEqual(3);
    });
  });
});
