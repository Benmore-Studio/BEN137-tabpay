import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp, prisma } from '../app';

const app = createApp();

describe('Users API', () => {
  const testEmail = `usertest${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';
  let testUserId: string;
  let authToken: string;

  beforeAll(async () => {
    // Create a test user
    const response = await request(app).post('/api/v1/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: 'User',
      lastName: 'Test',
      phone: '+1234567890',
    });

    if (!response.body.success) {
      console.error('Registration failed:', response.body);
      throw new Error('Failed to create test user');
    }

    testUserId = response.body.data.user.id;
    authToken = response.body.data.token;
  });

  afterAll(async () => {
    // Clean up - user might be deleted by tests, so use deleteMany
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.userPreferences.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  describe('GET /api/v1/users/me', () => {
    it('should return 200 and user profile for authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');

      const user = response.body.data.user;
      expect(user).toHaveProperty('id', testUserId);
      expect(user).toHaveProperty('email', testEmail.toLowerCase());
      expect(user).toHaveProperty('firstName', 'User');
      expect(user).toHaveProperty('lastName', 'Test');
      expect(user).toHaveProperty('phone', '+1234567890');
      expect(user).toHaveProperty('isAgeVerified', false);
      expect(user).toHaveProperty('hasPaymentMethod', false);
      expect(user).not.toHaveProperty('password');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app).get('/api/v1/users/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'NO_TOKEN');
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
      expect(response.body.error).toHaveProperty('code', 'INVALID_TOKEN');
    });
  });

  describe('PATCH /api/v1/users/me', () => {
    it('should update firstName successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ firstName: 'UpdatedFirst' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user).toHaveProperty('firstName', 'UpdatedFirst');
    });

    it('should update lastName successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ lastName: 'UpdatedLast' });

      expect(response.status).toBe(200);
      expect(response.body.data.user).toHaveProperty('lastName', 'UpdatedLast');
    });

    it('should update phone successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phone: '+9876543210' });

      expect(response.status).toBe(200);
      expect(response.body.data.user).toHaveProperty('phone', '+9876543210');
    });

    it('should update multiple fields at once', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'MultiFirst',
          lastName: 'MultiLast',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user).toHaveProperty('firstName', 'MultiFirst');
      expect(response.body.data.user).toHaveProperty('lastName', 'MultiLast');
    });

    it('should return 400 for empty update body', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'NO_FIELDS');
    });

    it('should return 400 for invalid phone format', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phone: 'invalid-phone' });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 400 for firstName too long', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ firstName: 'a'.repeat(51) });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me')
        .send({ firstName: 'Test' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/users/me/preferences', () => {
    it('should return 200 and preferences for authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('preferences');

      const prefs = response.body.data.preferences;
      expect(prefs).toHaveProperty('defaultTipPercent', 18); // Default
      expect(prefs).toHaveProperty('notifications', true); // Default
      expect(prefs).toHaveProperty('autoReorder', false); // Default
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app).get('/api/v1/users/me/preferences');

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/users/me/preferences', () => {
    it('should update defaultTipPercent to 0', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ defaultTipPercent: 0 });

      expect(response.status).toBe(200);
      expect(response.body.data.preferences).toHaveProperty('defaultTipPercent', 0);
    });

    it('should update defaultTipPercent to 15', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ defaultTipPercent: 15 });

      expect(response.status).toBe(200);
      expect(response.body.data.preferences).toHaveProperty('defaultTipPercent', 15);
    });

    it('should update defaultTipPercent to 20', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ defaultTipPercent: 20 });

      expect(response.status).toBe(200);
      expect(response.body.data.preferences).toHaveProperty('defaultTipPercent', 20);
    });

    it('should update notifications setting', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notifications: false });

      expect(response.status).toBe(200);
      expect(response.body.data.preferences).toHaveProperty('notifications', false);
    });

    it('should update autoReorder setting', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ autoReorder: true });

      expect(response.status).toBe(200);
      expect(response.body.data.preferences).toHaveProperty('autoReorder', true);
    });

    it('should update multiple preferences at once', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          defaultTipPercent: 18,
          notifications: true,
          autoReorder: false,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.preferences).toHaveProperty('defaultTipPercent', 18);
      expect(response.body.data.preferences).toHaveProperty('notifications', true);
      expect(response.body.data.preferences).toHaveProperty('autoReorder', false);
    });

    it('should return 400 for invalid tip percentage (not in allowed values)', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ defaultTipPercent: 25 });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 400 for empty update body', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'NO_FIELDS');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .patch('/api/v1/users/me/preferences')
        .send({ defaultTipPercent: 15 });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/users/me/verify-age', () => {
    it('should verify age for user 21+', async () => {
      // Create a date for someone who is 25 years old
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 25);

      const response = await request(app)
        .post('/api/v1/users/me/verify-age')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ dateOfBirth: dob.toISOString() });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user).toHaveProperty('isAgeVerified', true);
      expect(response.body.data).toHaveProperty('message', 'Age verified successfully');
    });

    it('should reject age verification for user under 21', async () => {
      // Create a new test user for this test
      const youngUserEmail = `younguser${Date.now()}@example.com`;
      const registerResponse = await request(app).post('/api/v1/auth/register').send({
        email: youngUserEmail,
        password: 'SecurePass123!',
        firstName: 'Young',
        lastName: 'User',
        phone: '+1111111111',
      });

      const youngToken = registerResponse.body.data.token;
      const youngUserId = registerResponse.body.data.user.id;

      // Create a date for someone who is 18 years old
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 18);

      const response = await request(app)
        .post('/api/v1/users/me/verify-age')
        .set('Authorization', `Bearer ${youngToken}`)
        .send({ dateOfBirth: dob.toISOString() });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'AGE_VERIFICATION_FAILED');
      expect(response.body.error.message).toContain('21 years old');

      // Clean up young user
      await prisma.session.deleteMany({ where: { userId: youngUserId } });
      await prisma.userPreferences.deleteMany({ where: { userId: youngUserId } });
      await prisma.user.deleteMany({ where: { id: youngUserId } });
    });

    it('should reject edge case: exactly 21 years minus one day', async () => {
      // Create a new test user for this test
      const edgeUserEmail = `edgeuser${Date.now()}@example.com`;
      const registerResponse = await request(app).post('/api/v1/auth/register').send({
        email: edgeUserEmail,
        password: 'SecurePass123!',
        firstName: 'Edge',
        lastName: 'User',
        phone: '+2222222222',
      });

      const edgeToken = registerResponse.body.data.token;
      const edgeUserId = registerResponse.body.data.user.id;

      // Create a date for someone who is 21 tomorrow
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - 21);
      dob.setDate(dob.getDate() + 1);

      const response = await request(app)
        .post('/api/v1/users/me/verify-age')
        .set('Authorization', `Bearer ${edgeToken}`)
        .send({ dateOfBirth: dob.toISOString() });

      expect(response.status).toBe(403);
      expect(response.body.error).toHaveProperty('code', 'AGE_VERIFICATION_FAILED');

      // Clean up edge user
      await prisma.session.deleteMany({ where: { userId: edgeUserId } });
      await prisma.userPreferences.deleteMany({ where: { userId: edgeUserId } });
      await prisma.user.deleteMany({ where: { id: edgeUserId } });
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .post('/api/v1/users/me/verify-age')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ dateOfBirth: 'invalid-date' });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 400 for missing dateOfBirth', async () => {
      const response = await request(app)
        .post('/api/v1/users/me/verify-age')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .post('/api/v1/users/me/verify-age')
        .send({ dateOfBirth: new Date().toISOString() });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/users/me', () => {
    it('should delete user account successfully', async () => {
      // Create a new user to delete
      const deleteUserEmail = `deleteuser${Date.now()}@example.com`;
      const registerResponse = await request(app).post('/api/v1/auth/register').send({
        email: deleteUserEmail,
        password: 'SecurePass123!',
        firstName: 'Delete',
        lastName: 'User',
        phone: '+3333333333',
      });

      const deleteToken = registerResponse.body.data.token;
      const deleteUserId = registerResponse.body.data.user.id;

      // Delete the account
      const response = await request(app)
        .delete('/api/v1/users/me')
        .set('Authorization', `Bearer ${deleteToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('message', 'Account deleted successfully');

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: deleteUserId },
      });
      expect(deletedUser).toBeNull();

      // Verify session is also deleted (cascade)
      const deletedSession = await prisma.session.findFirst({
        where: { userId: deleteUserId },
      });
      expect(deletedSession).toBeNull();
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app).delete('/api/v1/users/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 after using deleted account token', async () => {
      // Create a new user to delete
      const expiredUserEmail = `expireduser${Date.now()}@example.com`;
      const registerResponse = await request(app).post('/api/v1/auth/register').send({
        email: expiredUserEmail,
        password: 'SecurePass123!',
        firstName: 'Expired',
        lastName: 'User',
        phone: '+4444444444',
      });

      const expiredToken = registerResponse.body.data.token;

      // Delete the account
      await request(app)
        .delete('/api/v1/users/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      // Try to use the token again
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });
  });
});
