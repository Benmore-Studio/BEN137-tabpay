import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createApp, prisma } from '../app';
import { config } from '../config';

const app = createApp();

describe('Auth API - Registration', () => {
  const testEmail = `test${Date.now()}@example.com`;
  let createdUserId: string | null = null;

  afterEach(async () => {
    // Clean up created user after each test
    if (createdUserId) {
      await prisma.userPreferences.deleteMany({ where: { userId: createdUserId } });
      await prisma.user.deleteMany({ where: { id: createdUserId } });
      createdUserId = null;
    }
  });

  afterAll(async () => {
    // Final cleanup
    await prisma.user.deleteMany({ where: { email: { contains: '@example.com' } } });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should return 201 and create user with valid data', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: testEmail,
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');

      createdUserId = response.body.data.user.id;
    });

    it('should return user data without password', async () => {
      const uniqueEmail = `test${Date.now() + 1}@example.com`;
      const response = await request(app).post('/api/v1/auth/register').send({
        email: uniqueEmail,
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      const user = response.body.data.user;
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email', uniqueEmail.toLowerCase());
      expect(user).toHaveProperty('firstName', 'John');
      expect(user).toHaveProperty('lastName', 'Doe');
      expect(user).toHaveProperty('phone', '+1234567890');
      expect(user).not.toHaveProperty('password');

      createdUserId = user.id;
    });

    it('should return valid JWT token', async () => {
      const uniqueEmail = `test${Date.now() + 2}@example.com`;
      const response = await request(app).post('/api/v1/auth/register').send({
        email: uniqueEmail,
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      const token = response.body.data.token;
      expect(token).toBeTruthy();

      // Verify token is valid
      const decoded = jwt.verify(token, config.jwt.secret) as {
        userId: string;
        email: string;
      };
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email', uniqueEmail.toLowerCase());

      createdUserId = response.body.data.user.id;
    });

    it('should hash password with bcrypt', async () => {
      const uniqueEmail = `test${Date.now() + 3}@example.com`;
      const plainPassword = 'SecurePass123!';

      const response = await request(app).post('/api/v1/auth/register').send({
        email: uniqueEmail,
        password: plainPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      createdUserId = response.body.data.user.id;

      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: createdUserId },
      });

      expect(user).toBeTruthy();
      expect(user!.password).not.toBe(plainPassword);

      // Verify password is properly hashed
      const isValid = await bcrypt.compare(plainPassword, user!.password);
      expect(isValid).toBe(true);
    });

    it('should create default UserPreferences record', async () => {
      const uniqueEmail = `test${Date.now() + 4}@example.com`;
      const response = await request(app).post('/api/v1/auth/register').send({
        email: uniqueEmail,
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      createdUserId = response.body.data.user.id;

      // Check that preferences were created
      const preferences = await prisma.userPreferences.findUnique({
        where: { userId: createdUserId },
      });

      expect(preferences).toBeTruthy();
      expect(preferences!.userId).toBe(createdUserId);
    });

    it('should store email in lowercase', async () => {
      const uniqueEmail = `Test${Date.now() + 5}@EXAMPLE.COM`;
      const response = await request(app).post('/api/v1/auth/register').send({
        email: uniqueEmail,
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(response.body.data.user.email).toBe(uniqueEmail.toLowerCase());
      createdUserId = response.body.data.user.id;
    });

    it('should return 409 for duplicate email', async () => {
      const uniqueEmail = `test${Date.now() + 6}@example.com`;

      // Create first user
      const firstResponse = await request(app).post('/api/v1/auth/register').send({
        email: uniqueEmail,
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      createdUserId = firstResponse.body.data.user.id;

      // Try to create second user with same email
      const response = await request(app).post('/api/v1/auth/register').send({
        email: uniqueEmail,
        password: 'DifferentPass123!',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+9876543210',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'EMAIL_EXISTS');
      expect(response.body.error).toHaveProperty('message', 'Email already registered');
    });
  });

  describe('Email Validation', () => {
    it('should return 400 for invalid email format', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'invalid-email',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('details');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('Password Validation', () => {
    it('should return 400 for password less than 8 characters', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: `test${Date.now()}@example.com`,
        password: 'Short1!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      const details = response.body.error.details as Array<{ field: string; message: string }>;
      const passwordError = details.find((d) => d.field === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError!.message).toContain('at least 8 characters');
    });

    it('should return 400 for password without uppercase letter', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: `test${Date.now()}@example.com`,
        password: 'lowercase123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      const details = response.body.error.details as Array<{ field: string; message: string }>;
      const passwordError = details.find((d) => d.field === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError!.message).toContain('uppercase letter');
    });

    it('should return 400 for password without number', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: `test${Date.now()}@example.com`,
        password: 'NoNumbers!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      const details = response.body.error.details as Array<{ field: string; message: string }>;
      const passwordError = details.find((d) => d.field === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError!.message).toContain('number');
    });
  });

  describe('Phone Number Validation', () => {
    it('should return 400 for invalid phone format', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: `test${Date.now()}@example.com`,
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: 'invalid-phone',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');

      const details = response.body.error.details as Array<{ field: string; message: string }>;
      const phoneError = details.find((d) => d.field === 'phone');
      expect(phoneError).toBeDefined();
      expect(phoneError!.message).toContain('Invalid phone number');
    });

    it('should accept valid international phone formats', async () => {
      const validPhones = ['+1234567890', '+441234567890', '1234567890'];

      for (const phone of validPhones) {
        const uniqueEmail = `test${Date.now() + Math.random()}@example.com`;
        const response = await request(app).post('/api/v1/auth/register').send({
          email: uniqueEmail,
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
          phone,
        });

        expect(response.status).toBe(201);
        createdUserId = response.body.data.user.id;

        // Cleanup
        await prisma.userPreferences.deleteMany({ where: { userId: createdUserId } });
        await prisma.user.deleteMany({ where: { id: createdUserId } });
        createdUserId = null;
      }
    });
  });

  describe('Name Validation', () => {
    it('should return 400 for missing firstName', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: `test${Date.now()}@example.com`,
        password: 'SecurePass123!',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 400 for missing lastName', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: `test${Date.now()}@example.com`,
        password: 'SecurePass123!',
        firstName: 'John',
        phone: '+1234567890',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('Response Visibility', () => {
    it('should return visible user data with all fields', async () => {
      const uniqueEmail = `test${Date.now() + 7}@example.com`;
      const response = await request(app).post('/api/v1/auth/register').send({
        email: uniqueEmail,
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      const user = response.body.data.user;
      expect(user.id).toBeTruthy();
      expect(user.email).toBe(uniqueEmail.toLowerCase());
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.phone).toBe('+1234567890');
      expect(typeof user.isAgeVerified).toBe('boolean');
      expect(typeof user.hasPaymentMethod).toBe('boolean');
      expect(user.createdAt).toBeTruthy();

      createdUserId = user.id;
    });
  });
});
