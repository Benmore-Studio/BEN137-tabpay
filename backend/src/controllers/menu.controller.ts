import { Request, Response } from 'express';
import { prisma } from '../app';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/v1/categories
 * List all active categories sorted by sortOrder
 */
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { menuItems: true },
      },
    },
  });

  const categoriesWithCount = categories.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    sortOrder: category.sortOrder,
    itemCount: category._count.menuItems,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }));

  res.json({
    success: true,
    data: categoriesWithCount,
  });
});

/**
 * GET /api/v1/bars/:barId/menu
 * Get full menu for a service bar (all categories with items)
 */
export const getServiceBarMenu = asyncHandler(async (req: Request, res: Response) => {
  const { barId } = req.params;

  // Check if service bar exists
  const serviceBar = await prisma.serviceBar.findUnique({
    where: { id: barId },
  });

  if (!serviceBar) {
    throw new AppError('Service bar not found', 404, 'SERVICE_BAR_NOT_FOUND');
  }

  // Get all categories with their menu items for this service bar
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      menuItems: {
        some: {
          serviceBarId: barId,
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
    include: {
      menuItems: {
        where: {
          serviceBarId: barId,
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  const menu = categories.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    sortOrder: category.sortOrder,
    items: category.menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      available: item.available,
      dietary: {
        vegetarian: item.isVegetarian,
        vegan: item.isVegan,
        glutenFree: item.isGlutenFree,
      },
    })),
  }));

  res.json({
    success: true,
    data: menu,
  });
});

/**
 * GET /api/v1/bars/:barId/menu/:categoryId
 * Get items by category for a service bar
 */
export const getServiceBarMenuByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { barId, categoryId } = req.params;

    // Check if service bar exists
    const serviceBar = await prisma.serviceBar.findUnique({
      where: { id: barId },
    });

    if (!serviceBar) {
      throw new AppError('Service bar not found', 404, 'SERVICE_BAR_NOT_FOUND');
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    }

    // Get menu items for this category and service bar
    const menuItems = await prisma.menuItem.findMany({
      where: {
        serviceBarId: barId,
        categoryId: categoryId,
      },
      orderBy: { sortOrder: 'asc' },
    });

    const items = menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      available: item.available,
      dietary: {
        vegetarian: item.isVegetarian,
        vegan: item.isVegan,
        glutenFree: item.isGlutenFree,
      },
      categoryId: item.categoryId,
    }));

    res.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          icon: category.icon,
        },
        items,
      },
    });
  }
);

/**
 * GET /api/v1/menu-items/:id
 * Get menu item details with modifiers
 */
export const getMenuItemById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const menuItem = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
      serviceBar: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
      modifiers: {
        include: {
          modifier: {
            include: {
              options: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!menuItem) {
    throw new AppError('Menu item not found', 404, 'MENU_ITEM_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: Number(menuItem.price),
      imageUrl: menuItem.imageUrl,
      available: menuItem.available,
      dietary: {
        vegetarian: menuItem.isVegetarian,
        vegan: menuItem.isVegan,
        glutenFree: menuItem.isGlutenFree,
      },
      category: menuItem.category,
      serviceBar: menuItem.serviceBar,
      modifiers: menuItem.modifiers.map((mi) => ({
        id: mi.modifier.id,
        name: mi.modifier.name,
        required: mi.modifier.required,
        maxSelections: mi.modifier.maxSelections,
        options: mi.modifier.options.map((option) => ({
          id: option.id,
          name: option.name,
          priceAdjustment: Number(option.priceAdjustment),
          isDefault: option.isDefault,
        })),
      })),
      createdAt: menuItem.createdAt,
      updatedAt: menuItem.updatedAt,
    },
  });
});
