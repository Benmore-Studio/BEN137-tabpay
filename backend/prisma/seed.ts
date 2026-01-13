import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.orderItemModifier.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favoriteItem.deleteMany();
  await prisma.menuItemModifier.deleteMany();
  await prisma.modifierOption.deleteMany();
  await prisma.modifier.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.serviceBar.deleteMany();
  await prisma.savedLocation.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.venue.deleteMany();

  console.log('Cleared existing data');

  // ============================================================================
  // VENUE
  // ============================================================================
  const venue = await prisma.venue.create({
    data: {
      name: 'Potawatomi Casino',
      address: '1721 W Canal St, Milwaukee, WI 53233',
      description: 'Premier gaming destination in Milwaukee featuring slots, table games, and world-class dining.',
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      isActive: true,
      timezone: 'America/Chicago',
    },
  });
  console.log('Created venue:', venue.name);

  // ============================================================================
  // SERVICE BARS
  // ============================================================================
  const serviceBars = await Promise.all([
    prisma.serviceBar.create({
      data: {
        venueId: venue.id,
        name: 'High Roller Lounge',
        location: 'Main Floor - Near Poker Tables',
        isActive: true,
        activeOrders: 3,
        availableServers: 2,
        estimatedWaitMinutes: 8,
        status: 'low',
      },
    }),
    prisma.serviceBar.create({
      data: {
        venueId: venue.id,
        name: 'Slots Paradise Bar',
        location: 'Slot Machine Area - Section A',
        isActive: true,
        activeOrders: 12,
        availableServers: 3,
        estimatedWaitMinutes: 15,
        status: 'medium',
      },
    }),
    prisma.serviceBar.create({
      data: {
        venueId: venue.id,
        name: 'VIP Sky Lounge',
        location: '2nd Floor - VIP Section',
        isActive: true,
        activeOrders: 2,
        availableServers: 4,
        estimatedWaitMinutes: 5,
        status: 'low',
      },
    }),
    prisma.serviceBar.create({
      data: {
        venueId: venue.id,
        name: 'Sports Book Bar',
        location: 'Sports Betting Area',
        isActive: true,
        activeOrders: 25,
        availableServers: 2,
        estimatedWaitMinutes: 25,
        status: 'high',
      },
    }),
  ]);
  console.log('Created', serviceBars.length, 'service bars');

  // ============================================================================
  // CATEGORIES
  // ============================================================================
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Beer & Wine', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Cocktails', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Non-Alcoholic', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Appetizers', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Snacks', sortOrder: 5 } }),
    prisma.category.create({ data: { name: 'Desserts', sortOrder: 6 } }),
  ]);
  const [beerWine, cocktails, nonAlcoholic, appetizers, snacks, desserts] = categories;
  console.log('Created', categories.length, 'categories');

  // ============================================================================
  // MODIFIERS
  // ============================================================================
  const drinkSizeModifier = await prisma.modifier.create({
    data: {
      name: 'Size',
      required: true,
      maxSelections: 1,
      options: {
        create: [
          { name: 'Small', priceAdjustment: 0, sortOrder: 1, isDefault: true },
          { name: 'Medium', priceAdjustment: 1.5, sortOrder: 2 },
          { name: 'Large', priceAdjustment: 3.0, sortOrder: 3 },
        ],
      },
    },
  });

  const iceModifier = await prisma.modifier.create({
    data: {
      name: 'Ice',
      required: false,
      maxSelections: 1,
      options: {
        create: [
          { name: 'Normal Ice', priceAdjustment: 0, sortOrder: 1, isDefault: true },
          { name: 'Light Ice', priceAdjustment: 0, sortOrder: 2 },
          { name: 'Extra Ice', priceAdjustment: 0, sortOrder: 3 },
          { name: 'No Ice', priceAdjustment: 0, sortOrder: 4 },
        ],
      },
    },
  });

  const garnishModifier = await prisma.modifier.create({
    data: {
      name: 'Garnish',
      required: false,
      maxSelections: 2,
      options: {
        create: [
          { name: 'Lime', priceAdjustment: 0, sortOrder: 1 },
          { name: 'Lemon', priceAdjustment: 0, sortOrder: 2 },
          { name: 'Orange', priceAdjustment: 0, sortOrder: 3 },
          { name: 'Cherry', priceAdjustment: 0.5, sortOrder: 4 },
          { name: 'Olive', priceAdjustment: 0, sortOrder: 5 },
        ],
      },
    },
  });

  const wingSauceModifier = await prisma.modifier.create({
    data: {
      name: 'Sauce',
      required: true,
      maxSelections: 1,
      options: {
        create: [
          { name: 'Buffalo', priceAdjustment: 0, sortOrder: 1, isDefault: true },
          { name: 'BBQ', priceAdjustment: 0, sortOrder: 2 },
          { name: 'Garlic Parmesan', priceAdjustment: 0, sortOrder: 3 },
          { name: 'Honey Sriracha', priceAdjustment: 1.0, sortOrder: 4 },
        ],
      },
    },
  });

  console.log('Created modifiers');

  // Use first service bar for all menu items (in real app, items would be per-bar)
  const primaryBar = serviceBars[0];

  // ============================================================================
  // MENU ITEMS - BEER & WINE
  // ============================================================================
  const beerWineItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: beerWine.id,
        name: 'Craft IPA',
        description: 'Local craft IPA with citrus and pine notes. Bold and refreshing.',
        price: 8.5,
        imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&h=600&fit=crop',
        available: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: beerWine.id,
        name: 'House Lager',
        description: 'Crisp, clean lager perfect for any occasion.',
        price: 6.0,
        imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=600&fit=crop',
        available: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: beerWine.id,
        name: 'Cabernet Sauvignon',
        description: 'Full-bodied red with dark fruit and oak undertones. Glass pour.',
        price: 12.0,
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
        available: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: beerWine.id,
        name: 'Chardonnay',
        description: 'Buttery white wine with hints of vanilla and apple. Glass pour.',
        price: 11.0,
        imageUrl: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&h=600&fit=crop',
        available: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: beerWine.id,
        name: 'Prosecco',
        description: 'Light and bubbly Italian sparkling wine. Perfect for celebrations.',
        price: 10.0,
        imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop',
        available: false, // Unavailable item for testing
      },
    }),
  ]);

  // ============================================================================
  // MENU ITEMS - COCKTAILS
  // ============================================================================
  const cocktailItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: cocktails.id,
        name: 'Classic Margarita',
        description: 'Tequila, lime juice, and triple sec. Served on the rocks with a salted rim.',
        price: 14.0,
        imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop',
        available: true,
        modifiers: {
          create: [
            { modifierId: iceModifier.id, sortOrder: 1 },
            { modifierId: garnishModifier.id, sortOrder: 2 },
          ],
        },
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: cocktails.id,
        name: 'Old Fashioned',
        description: 'Bourbon, bitters, sugar, and orange peel. A timeless classic.',
        price: 15.0,
        imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
        available: true,
        modifiers: {
          create: [{ modifierId: garnishModifier.id, sortOrder: 1 }],
        },
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: cocktails.id,
        name: 'Mojito',
        description: 'Fresh mint, lime, rum, and soda. Light and refreshing.',
        price: 13.0,
        imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop',
        available: true,
        modifiers: {
          create: [{ modifierId: iceModifier.id, sortOrder: 1 }],
        },
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: cocktails.id,
        name: 'Espresso Martini',
        description: 'Vodka, coffee liqueur, and fresh espresso. Rich and energizing.',
        price: 16.0,
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop',
        available: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: cocktails.id,
        name: 'Whiskey Sour',
        description: 'Bourbon, lemon juice, and simple syrup with egg white foam.',
        price: 14.0,
        imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&h=600&fit=crop',
        available: true,
        modifiers: {
          create: [{ modifierId: garnishModifier.id, sortOrder: 1 }],
        },
      },
    }),
  ]);

  // ============================================================================
  // MENU ITEMS - NON-ALCOHOLIC
  // ============================================================================
  const nonAlcoholicItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: nonAlcoholic.id,
        name: 'Fresh Lemonade',
        description: 'House-made lemonade with a hint of mint.',
        price: 5.0,
        imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=800&h=600&fit=crop',
        available: true,
        isVegan: true,
        isGlutenFree: true,
        modifiers: {
          create: [
            { modifierId: drinkSizeModifier.id, sortOrder: 1 },
            { modifierId: iceModifier.id, sortOrder: 2 },
          ],
        },
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: nonAlcoholic.id,
        name: 'Iced Coffee',
        description: 'Cold brew coffee served over ice with optional cream.',
        price: 5.5,
        imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop',
        available: true,
        isVegan: true,
        isGlutenFree: true,
        modifiers: {
          create: [
            { modifierId: drinkSizeModifier.id, sortOrder: 1 },
            { modifierId: iceModifier.id, sortOrder: 2 },
          ],
        },
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: nonAlcoholic.id,
        name: 'Virgin Mojito',
        description: 'All the refreshing mint and lime, none of the alcohol.',
        price: 7.0,
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
        available: true,
        isVegan: true,
        isGlutenFree: true,
        modifiers: {
          create: [{ modifierId: iceModifier.id, sortOrder: 1 }],
        },
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: nonAlcoholic.id,
        name: 'Sparkling Water',
        description: 'Premium sparkling mineral water with optional citrus.',
        price: 4.0,
        available: true,
        isVegan: true,
        isGlutenFree: true,
      },
    }),
  ]);

  // ============================================================================
  // MENU ITEMS - APPETIZERS
  // ============================================================================
  const appetizerItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: appetizers.id,
        name: 'Loaded Nachos',
        description: 'Crispy tortilla chips with melted cheese, jalapeños, sour cream, and guacamole.',
        price: 16.0,
        imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: appetizers.id,
        name: 'Wings Basket',
        description: 'Crispy chicken wings tossed in your choice of buffalo, BBQ, or garlic parmesan.',
        price: 18.0,
        imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&h=600&fit=crop',
        available: true,
        modifiers: {
          create: [{ modifierId: wingSauceModifier.id, sortOrder: 1 }],
        },
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: appetizers.id,
        name: 'Spinach Artichoke Dip',
        description: 'Creamy spinach and artichoke dip served with warm pita chips.',
        price: 14.0,
        imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: appetizers.id,
        name: 'Mozzarella Sticks',
        description: 'Golden fried mozzarella with marinara dipping sauce.',
        price: 12.0,
        imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
      },
    }),
  ]);

  // ============================================================================
  // MENU ITEMS - SNACKS
  // ============================================================================
  const snackItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: snacks.id,
        name: 'Truffle Fries',
        description: 'Crispy fries tossed in truffle oil and parmesan with garlic aioli.',
        price: 10.0,
        imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: snacks.id,
        name: 'Pretzel Bites',
        description: 'Warm soft pretzel bites with beer cheese dip.',
        price: 9.0,
        imageUrl: 'https://images.unsplash.com/photo-1534420807854-4a69d945a918?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: snacks.id,
        name: 'Mixed Nuts',
        description: 'Roasted and salted premium nut blend.',
        price: 6.0,
        imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=600&fit=crop',
        available: true,
        isVegan: true,
        isGlutenFree: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: snacks.id,
        name: 'Edamame',
        description: 'Steamed edamame pods with sea salt.',
        price: 7.0,
        imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&h=600&fit=crop',
        available: true,
        isVegan: true,
        isGlutenFree: true,
      },
    }),
  ]);

  // ============================================================================
  // MENU ITEMS - DESSERTS
  // ============================================================================
  const dessertItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: desserts.id,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
        price: 12.0,
        imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: desserts.id,
        name: 'New York Cheesecake',
        description: 'Classic creamy cheesecake with graham cracker crust and berry compote.',
        price: 10.0,
        imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: desserts.id,
        name: 'Ice Cream Sundae',
        description: 'Three scoops of vanilla ice cream with chocolate sauce, whipped cream, and a cherry.',
        price: 8.0,
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
        isGlutenFree: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        serviceBarId: primaryBar.id,
        categoryId: desserts.id,
        name: 'Brownie Bites',
        description: 'Rich chocolate brownie bites dusted with powdered sugar.',
        price: 7.0,
        imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=600&fit=crop',
        available: true,
        isVegetarian: true,
      },
    }),
  ]);

  const totalItems =
    beerWineItems.length +
    cocktailItems.length +
    nonAlcoholicItems.length +
    appetizerItems.length +
    snackItems.length +
    dessertItems.length;

  console.log('Created', totalItems, 'menu items');

  console.log('\n✅ Database seeded successfully!');
  console.log('\nSummary:');
  console.log('- 1 venue (Potawatomi Casino)');
  console.log('- 4 service bars');
  console.log('- 6 categories');
  console.log('- 4 modifiers with options');
  console.log(`- ${totalItems} menu items`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
