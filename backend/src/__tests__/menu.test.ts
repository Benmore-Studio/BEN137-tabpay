import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp, prisma } from '../app';

const app = createApp();

describe('Menu & Category API Endpoints', () => {
  let testVenueId: string;
  let testBarId: string;
  let testCategoryId: string;
  let testMenuItemId: string;
  let testModifierId: string;

  beforeAll(async () => {
    // Create test venue
    const venue = await prisma.venue.create({
      data: {
        name: 'Test Menu Casino ' + Date.now(),
        address: '456 Menu Street',
        description: 'Test venue for menu',
        isActive: true,
      },
    });
    testVenueId = venue.id;

    // Create test service bar
    const bar = await prisma.serviceBar.create({
      data: {
        venueId: testVenueId,
        name: 'Test Menu Bar',
        location: 'Test Floor',
        isActive: true,
        availableServers: 2,
        estimatedWaitMinutes: 10,
        status: 'medium',
      },
    });
    testBarId = bar.id;

    // Create test category
    const category = await prisma.category.create({
      data: {
        name: 'Test Category ' + Date.now(),
        icon: 'test-icon',
        sortOrder: 1,
        isActive: true,
      },
    });
    testCategoryId = category.id;

    // Create test modifier
    const modifier = await prisma.modifier.create({
      data: {
        name: 'Test Modifier',
        required: false,
        maxSelections: 1,
        options: {
          create: [
            {
              name: 'Option 1',
              priceAdjustment: 0,
              sortOrder: 1,
              isDefault: true,
            },
            {
              name: 'Option 2',
              priceAdjustment: 1.5,
              sortOrder: 2,
              isDefault: false,
            },
          ],
        },
      },
    });
    testModifierId = modifier.id;

    // Create test menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        serviceBarId: testBarId,
        categoryId: testCategoryId,
        name: 'Test Menu Item',
        description: 'A delicious test item',
        price: 12.99,
        imageUrl: 'https://example.com/test.jpg',
        available: true,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        sortOrder: 1,
        modifiers: {
          create: [
            {
              modifierId: testModifierId,
              sortOrder: 1,
            },
          ],
        },
      },
    });
    testMenuItemId = menuItem.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.menuItem.deleteMany({ where: { serviceBarId: testBarId } });
    await prisma.modifierOption.deleteMany({ where: { modifierId: testModifierId } });
    await prisma.modifier.deleteMany({ where: { id: testModifierId } });
    await prisma.category.deleteMany({ where: { id: testCategoryId } });
    await prisma.serviceBar.deleteMany({ where: { id: testBarId } });
    await prisma.venue.deleteMany({ where: { id: testVenueId } });
    await prisma.$disconnect();
  });

  describe('GET /api/v1/categories', () => {
    it('should return 200 with list of categories', async () => {
      const response = await request(app).get('/api/v1/categories');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return categories sorted by sortOrder', async () => {
      const response = await request(app).get('/api/v1/categories');

      const categories = response.body.data;
      expect(categories.length).toBeGreaterThan(0);

      // Check if sorted by sortOrder
      for (let i = 1; i < categories.length; i++) {
        expect(categories[i].sortOrder).toBeGreaterThanOrEqual(categories[i - 1].sortOrder);
      }
    });

    it('should include itemCount for each category', async () => {
      const response = await request(app).get('/api/v1/categories');

      const categories = response.body.data;
      if (categories.length > 0) {
        const category = categories[0];
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('sortOrder');
        expect(category).toHaveProperty('itemCount');
        expect(typeof category.itemCount).toBe('number');
      }
    });

    it('categories should be visible and properly structured', async () => {
      const response = await request(app).get('/api/v1/categories');

      const testCategory = response.body.data.find(
        (c: { id: string }) => c.id === testCategoryId
      );
      expect(testCategory).toBeDefined();
      expect(testCategory.name).toContain('Test Category');
      expect(testCategory.icon).toBe('test-icon');
    });
  });

  describe('GET /api/v1/bars/:barId/menu', () => {
    it('should return 200 with full menu', async () => {
      const response = await request(app).get(`/api/v1/bars/${testBarId}/menu`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 404 for non-existent bar', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/api/v1/bars/${fakeId}/menu`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'SERVICE_BAR_NOT_FOUND');
    });

    it('should return menu grouped by categories', async () => {
      const response = await request(app).get(`/api/v1/bars/${testBarId}/menu`);

      const menu = response.body.data;
      expect(menu.length).toBeGreaterThan(0);

      const category = menu.find((c: { id: string }) => c.id === testCategoryId);
      expect(category).toBeDefined();
      expect(category).toHaveProperty('items');
      expect(Array.isArray(category.items)).toBe(true);
    });

    it('menu items should include dietary information', async () => {
      const response = await request(app).get(`/api/v1/bars/${testBarId}/menu`);

      const menu = response.body.data;
      const category = menu.find((c: { id: string }) => c.id === testCategoryId);

      if (category && category.items.length > 0) {
        const item = category.items[0];
        expect(item).toHaveProperty('dietary');
        expect(item.dietary).toHaveProperty('vegetarian');
        expect(item.dietary).toHaveProperty('vegan');
        expect(item.dietary).toHaveProperty('glutenFree');
        expect(typeof item.dietary.vegetarian).toBe('boolean');
      }
    });

    it('prices should be numbers not strings', async () => {
      const response = await request(app).get(`/api/v1/bars/${testBarId}/menu`);

      const menu = response.body.data;
      const category = menu.find((c: { id: string }) => c.id === testCategoryId);

      if (category && category.items.length > 0) {
        const item = category.items[0];
        expect(typeof item.price).toBe('number');
        expect(item.price).toBeGreaterThan(0);
      }
    });
  });

  describe('GET /api/v1/bars/:barId/menu/:categoryId', () => {
    it('should return 200 with category items', async () => {
      const response = await request(app).get(
        `/api/v1/bars/${testBarId}/menu/${testCategoryId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('category');
      expect(response.body.data).toHaveProperty('items');
    });

    it('should return 404 for non-existent bar', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/api/v1/bars/${fakeId}/menu/${testCategoryId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toHaveProperty('code', 'SERVICE_BAR_NOT_FOUND');
    });

    it('should return 404 for non-existent category', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/api/v1/bars/${testBarId}/menu/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toHaveProperty('code', 'CATEGORY_NOT_FOUND');
    });

    it('should include category information', async () => {
      const response = await request(app).get(
        `/api/v1/bars/${testBarId}/menu/${testCategoryId}`
      );

      const data = response.body.data;
      expect(data.category).toHaveProperty('id', testCategoryId);
      expect(data.category).toHaveProperty('name');
      expect(data.category.name).toContain('Test Category');
    });

    it('items should be visible with all details', async () => {
      const response = await request(app).get(
        `/api/v1/bars/${testBarId}/menu/${testCategoryId}`
      );

      const items = response.body.data.items;
      expect(items.length).toBeGreaterThan(0);

      const item = items.find((i: { id: string }) => i.id === testMenuItemId);
      expect(item).toBeDefined();
      expect(item.name).toBe('Test Menu Item');
      expect(item.description).toBeTruthy();
      expect(item.available).toBe(true);
    });
  });

  describe('GET /api/v1/menu-items/:id', () => {
    it('should return 200 with menu item details', async () => {
      const response = await request(app).get(`/api/v1/menu-items/${testMenuItemId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', testMenuItemId);
    });

    it('should return 404 for non-existent menu item', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(`/api/v1/menu-items/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'MENU_ITEM_NOT_FOUND');
    });

    it('should include full modifier details with options', async () => {
      const response = await request(app).get(`/api/v1/menu-items/${testMenuItemId}`);

      const item = response.body.data;
      expect(item).toHaveProperty('modifiers');
      expect(Array.isArray(item.modifiers)).toBe(true);
      expect(item.modifiers.length).toBeGreaterThan(0);

      const modifier = item.modifiers[0];
      expect(modifier).toHaveProperty('id');
      expect(modifier).toHaveProperty('name');
      expect(modifier).toHaveProperty('required');
      expect(modifier).toHaveProperty('maxSelections');
      expect(modifier).toHaveProperty('options');
      expect(Array.isArray(modifier.options)).toBe(true);
    });

    it('modifier options should include priceAdjustment as numbers', async () => {
      const response = await request(app).get(`/api/v1/menu-items/${testMenuItemId}`);

      const item = response.body.data;
      const modifier = item.modifiers[0];
      const option = modifier.options[0];

      expect(option).toHaveProperty('id');
      expect(option).toHaveProperty('name');
      expect(option).toHaveProperty('priceAdjustment');
      expect(typeof option.priceAdjustment).toBe('number');
    });

    it('should include category and service bar info', async () => {
      const response = await request(app).get(`/api/v1/menu-items/${testMenuItemId}`);

      const item = response.body.data;
      expect(item).toHaveProperty('category');
      expect(item.category).toHaveProperty('id', testCategoryId);
      expect(item.category).toHaveProperty('name');

      expect(item).toHaveProperty('serviceBar');
      expect(item.serviceBar).toHaveProperty('id', testBarId);
      expect(item.serviceBar).toHaveProperty('name');
    });

    it('menu item details should be visible and complete', async () => {
      const response = await request(app).get(`/api/v1/menu-items/${testMenuItemId}`);

      const item = response.body.data;
      expect(item.name).toBe('Test Menu Item');
      expect(item.description).toBe('A delicious test item');
      expect(item.price).toBe(12.99);
      expect(item.available).toBe(true);
      expect(item.dietary.vegetarian).toBe(true);
      expect(item.dietary.vegan).toBe(false);
      expect(item.dietary.glutenFree).toBe(true);
    });
  });

  describe('Response Structure Consistency', () => {
    it('all successful responses should follow the same structure', async () => {
      const endpoints = [
        '/api/v1/categories',
        `/api/v1/bars/${testBarId}/menu`,
        `/api/v1/bars/${testBarId}/menu/${testCategoryId}`,
        `/api/v1/menu-items/${testMenuItemId}`,
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
      const endpoints = [
        `/api/v1/bars/${fakeId}/menu`,
        `/api/v1/menu-items/${fakeId}`,
      ];

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
