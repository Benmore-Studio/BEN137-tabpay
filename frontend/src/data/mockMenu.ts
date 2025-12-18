import type { MenuItem, MenuCategory, Modifier } from '../types';

export const categories: MenuCategory[] = [
  { id: 'beer-wine', name: 'Beer & Wine', order: 1 },
  { id: 'cocktails', name: 'Cocktails', order: 2 },
  { id: 'non-alcoholic', name: 'Non-Alcoholic', order: 3 },
  { id: 'appetizers', name: 'Appetizers', order: 4 },
  { id: 'snacks', name: 'Snacks', order: 5 },
  { id: 'desserts', name: 'Desserts', order: 6 },
];

const drinkSizeModifier: Modifier = {
  id: 'drink-size',
  name: 'Size',
  required: true,
  options: [
    { id: 'small', name: 'Small', priceAdjustment: 0 },
    { id: 'medium', name: 'Medium', priceAdjustment: 1.5 },
    { id: 'large', name: 'Large', priceAdjustment: 3.0 },
  ],
};

const iceModifier: Modifier = {
  id: 'ice',
  name: 'Ice',
  required: false,
  options: [
    { id: 'light-ice', name: 'Light Ice', priceAdjustment: 0 },
    { id: 'normal-ice', name: 'Normal Ice', priceAdjustment: 0 },
    { id: 'extra-ice', name: 'Extra Ice', priceAdjustment: 0 },
    { id: 'no-ice', name: 'No Ice', priceAdjustment: 0 },
  ],
};

const garnishModifier: Modifier = {
  id: 'garnish',
  name: 'Garnish',
  required: false,
  maxSelections: 2,
  options: [
    { id: 'lime', name: 'Lime', priceAdjustment: 0 },
    { id: 'lemon', name: 'Lemon', priceAdjustment: 0 },
    { id: 'orange', name: 'Orange', priceAdjustment: 0 },
    { id: 'cherry', name: 'Cherry', priceAdjustment: 0.5 },
    { id: 'olive', name: 'Olive', priceAdjustment: 0 },
  ],
};

export const menuItems: MenuItem[] = [
  // Beer & Wine
  {
    id: 'bw-001',
    name: 'Craft IPA',
    description: 'Local craft IPA with citrus and pine notes. Bold and refreshing.',
    price: 8.5,
    category: 'beer-wine',
    available: true,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&h=600&fit=crop',
  },
  {
    id: 'bw-002',
    name: 'House Lager',
    description: 'Crisp, clean lager perfect for any occasion.',
    price: 6.0,
    category: 'beer-wine',
    available: true,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=600&fit=crop',
  },
  {
    id: 'bw-003',
    name: 'Cabernet Sauvignon',
    description: 'Full-bodied red with dark fruit and oak undertones. Glass pour.',
    price: 12.0,
    category: 'beer-wine',
    available: true,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
  },
  {
    id: 'bw-004',
    name: 'Chardonnay',
    description: 'Buttery white wine with hints of vanilla and apple. Glass pour.',
    price: 11.0,
    category: 'beer-wine',
    available: true,
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&h=600&fit=crop',
  },
  {
    id: 'bw-005',
    name: 'Prosecco',
    description: 'Light and bubbly Italian sparkling wine. Perfect for celebrations.',
    price: 10.0,
    category: 'beer-wine',
    available: false,
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop',
  },

  // Cocktails
  {
    id: 'ct-001',
    name: 'Classic Margarita',
    description: 'Tequila, lime juice, and triple sec. Served on the rocks with a salted rim.',
    price: 14.0,
    category: 'cocktails',
    available: true,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop',
    modifiers: [iceModifier, garnishModifier],
  },
  {
    id: 'ct-002',
    name: 'Old Fashioned',
    description: 'Bourbon, bitters, sugar, and orange peel. A timeless classic.',
    price: 15.0,
    category: 'cocktails',
    available: true,
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
    modifiers: [garnishModifier],
  },
  {
    id: 'ct-003',
    name: 'Mojito',
    description: 'Fresh mint, lime, rum, and soda. Light and refreshing.',
    price: 13.0,
    category: 'cocktails',
    available: true,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop',
    modifiers: [iceModifier],
  },
  {
    id: 'ct-004',
    name: 'Espresso Martini',
    description: 'Vodka, coffee liqueur, and fresh espresso. Rich and energizing.',
    price: 16.0,
    category: 'cocktails',
    available: true,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop',
  },
  {
    id: 'ct-005',
    name: 'Whiskey Sour',
    description: 'Bourbon, lemon juice, and simple syrup with egg white foam.',
    price: 14.0,
    category: 'cocktails',
    available: true,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&h=600&fit=crop',
    modifiers: [garnishModifier],
  },

  // Non-Alcoholic
  {
    id: 'na-001',
    name: 'Fresh Lemonade',
    description: 'House-made lemonade with a hint of mint.',
    price: 5.0,
    category: 'non-alcoholic',
    available: true,
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=800&h=600&fit=crop',
    modifiers: [drinkSizeModifier, iceModifier],
    dietary: { vegan: true, glutenFree: true },
  },
  {
    id: 'na-002',
    name: 'Iced Coffee',
    description: 'Cold brew coffee served over ice with optional cream.',
    price: 5.5,
    category: 'non-alcoholic',
    available: true,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop',
    modifiers: [drinkSizeModifier, iceModifier],
    dietary: { vegan: true, glutenFree: true },
  },
  {
    id: 'na-003',
    name: 'Virgin Mojito',
    description: 'All the refreshing mint and lime, none of the alcohol.',
    price: 7.0,
    category: 'non-alcoholic',
    available: true,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
    modifiers: [iceModifier],
    dietary: { vegan: true, glutenFree: true },
  },
  {
    id: 'na-004',
    name: 'Sparkling Water',
    description: 'Premium sparkling mineral water with optional citrus.',
    price: 4.0,
    category: 'non-alcoholic',
    available: true,
    dietary: { vegan: true, glutenFree: true },
  },

  // Appetizers
  {
    id: 'ap-001',
    name: 'Loaded Nachos',
    description: 'Crispy tortilla chips with melted cheese, jalape\u00f1os, sour cream, and guacamole.',
    price: 16.0,
    category: 'appetizers',
    available: true,
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&h=600&fit=crop',
    dietary: { vegetarian: true },
  },
  {
    id: 'ap-002',
    name: 'Wings Basket',
    description: 'Crispy chicken wings tossed in your choice of buffalo, BBQ, or garlic parmesan.',
    price: 18.0,
    category: 'appetizers',
    available: true,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&h=600&fit=crop',
    modifiers: [
      {
        id: 'wing-sauce',
        name: 'Sauce',
        required: true,
        options: [
          { id: 'buffalo', name: 'Buffalo', priceAdjustment: 0 },
          { id: 'bbq', name: 'BBQ', priceAdjustment: 0 },
          { id: 'garlic-parm', name: 'Garlic Parmesan', priceAdjustment: 0 },
          { id: 'honey-sriracha', name: 'Honey Sriracha', priceAdjustment: 1.0 },
        ],
      },
    ],
  },
  {
    id: 'ap-003',
    name: 'Spinach Artichoke Dip',
    description: 'Creamy spinach and artichoke dip served with warm pita chips.',
    price: 14.0,
    category: 'appetizers',
    available: true,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&h=600&fit=crop',
    dietary: { vegetarian: true },
  },
  {
    id: 'ap-004',
    name: 'Mozzarella Sticks',
    description: 'Golden fried mozzarella with marinara dipping sauce.',
    price: 12.0,
    category: 'appetizers',
    available: true,
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&h=600&fit=crop',
    dietary: { vegetarian: true },
  },

  // Snacks
  {
    id: 'sn-001',
    name: 'Truffle Fries',
    description: 'Crispy fries tossed in truffle oil and parmesan with garlic aioli.',
    price: 10.0,
    category: 'snacks',
    available: true,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&h=600&fit=crop',
    dietary: { vegetarian: true },
  },
  {
    id: 'sn-002',
    name: 'Pretzel Bites',
    description: 'Warm soft pretzel bites with beer cheese dip.',
    price: 9.0,
    category: 'snacks',
    available: true,
    image: 'https://images.unsplash.com/photo-1534420807854-4a69d945a918?w=800&h=600&fit=crop',
    dietary: { vegetarian: true },
  },
  {
    id: 'sn-003',
    name: 'Mixed Nuts',
    description: 'Roasted and salted premium nut blend.',
    price: 6.0,
    category: 'snacks',
    available: true,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=600&fit=crop',
    dietary: { vegan: true, glutenFree: true },
  },
  {
    id: 'sn-004',
    name: 'Edamame',
    description: 'Steamed edamame pods with sea salt.',
    price: 7.0,
    category: 'snacks',
    available: true,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&h=600&fit=crop',
    dietary: { vegan: true, glutenFree: true },
  },

  // Desserts
  {
    id: 'ds-001',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
    price: 12.0,
    category: 'desserts',
    available: true,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop',
    dietary: { vegetarian: true },
  },
  {
    id: 'ds-002',
    name: 'New York Cheesecake',
    description: 'Classic creamy cheesecake with graham cracker crust and berry compote.',
    price: 10.0,
    category: 'desserts',
    available: true,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop',
    dietary: { vegetarian: true },
  },
  {
    id: 'ds-003',
    name: 'Ice Cream Sundae',
    description: 'Three scoops of vanilla ice cream with chocolate sauce, whipped cream, and a cherry.',
    price: 8.0,
    category: 'desserts',
    available: true,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop',
    dietary: { vegetarian: true, glutenFree: true },
  },
  {
    id: 'ds-004',
    name: 'Brownie Bites',
    description: 'Rich chocolate brownie bites dusted with powdered sugar.',
    price: 7.0,
    category: 'desserts',
    available: true,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=600&fit=crop',
    dietary: { vegetarian: true },
  },
];

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((item) => item.category === categoryId);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getCategoryItemCount(categoryId: string): number {
  return menuItems.filter((item) => item.category === categoryId).length;
}
