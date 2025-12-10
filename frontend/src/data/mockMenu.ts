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
    image: '/images/craft-ipa.jpg',
  },
  {
    id: 'bw-002',
    name: 'House Lager',
    description: 'Crisp, clean lager perfect for any occasion.',
    price: 6.0,
    category: 'beer-wine',
    available: true,
    image: '/images/house-lager.jpg',
  },
  {
    id: 'bw-003',
    name: 'Cabernet Sauvignon',
    description: 'Full-bodied red with dark fruit and oak undertones. Glass pour.',
    price: 12.0,
    category: 'beer-wine',
    available: true,
    image: '/images/cabernet.jpg',
  },
  {
    id: 'bw-004',
    name: 'Chardonnay',
    description: 'Buttery white wine with hints of vanilla and apple. Glass pour.',
    price: 11.0,
    category: 'beer-wine',
    available: true,
    image: '/images/chardonnay.jpg',
  },
  {
    id: 'bw-005',
    name: 'Prosecco',
    description: 'Light and bubbly Italian sparkling wine. Perfect for celebrations.',
    price: 10.0,
    category: 'beer-wine',
    available: false,
  },

  // Cocktails
  {
    id: 'ct-001',
    name: 'Classic Margarita',
    description: 'Tequila, lime juice, and triple sec. Served on the rocks with a salted rim.',
    price: 14.0,
    category: 'cocktails',
    available: true,
    image: '/images/margarita.jpg',
    modifiers: [iceModifier, garnishModifier],
  },
  {
    id: 'ct-002',
    name: 'Old Fashioned',
    description: 'Bourbon, bitters, sugar, and orange peel. A timeless classic.',
    price: 15.0,
    category: 'cocktails',
    available: true,
    image: '/images/old-fashioned.jpg',
    modifiers: [garnishModifier],
  },
  {
    id: 'ct-003',
    name: 'Mojito',
    description: 'Fresh mint, lime, rum, and soda. Light and refreshing.',
    price: 13.0,
    category: 'cocktails',
    available: true,
    image: '/images/mojito.jpg',
    modifiers: [iceModifier],
  },
  {
    id: 'ct-004',
    name: 'Espresso Martini',
    description: 'Vodka, coffee liqueur, and fresh espresso. Rich and energizing.',
    price: 16.0,
    category: 'cocktails',
    available: true,
    image: '/images/espresso-martini.jpg',
  },
  {
    id: 'ct-005',
    name: 'Whiskey Sour',
    description: 'Bourbon, lemon juice, and simple syrup with egg white foam.',
    price: 14.0,
    category: 'cocktails',
    available: true,
    image: '/images/whiskey-sour.jpg',
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
    image: '/images/lemonade.jpg',
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
    image: '/images/iced-coffee.jpg',
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
    image: '/images/virgin-mojito.jpg',
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
    image: '/images/nachos.jpg',
    dietary: { vegetarian: true },
  },
  {
    id: 'ap-002',
    name: 'Wings Basket',
    description: 'Crispy chicken wings tossed in your choice of buffalo, BBQ, or garlic parmesan.',
    price: 18.0,
    category: 'appetizers',
    available: true,
    image: '/images/wings.jpg',
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
    image: '/images/spinach-dip.jpg',
    dietary: { vegetarian: true },
  },
  {
    id: 'ap-004',
    name: 'Mozzarella Sticks',
    description: 'Golden fried mozzarella with marinara dipping sauce.',
    price: 12.0,
    category: 'appetizers',
    available: true,
    image: '/images/mozz-sticks.jpg',
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
    image: '/images/truffle-fries.jpg',
    dietary: { vegetarian: true },
  },
  {
    id: 'sn-002',
    name: 'Pretzel Bites',
    description: 'Warm soft pretzel bites with beer cheese dip.',
    price: 9.0,
    category: 'snacks',
    available: true,
    image: '/images/pretzel-bites.jpg',
    dietary: { vegetarian: true },
  },
  {
    id: 'sn-003',
    name: 'Mixed Nuts',
    description: 'Roasted and salted premium nut blend.',
    price: 6.0,
    category: 'snacks',
    available: true,
    dietary: { vegan: true, glutenFree: true },
  },
  {
    id: 'sn-004',
    name: 'Edamame',
    description: 'Steamed edamame pods with sea salt.',
    price: 7.0,
    category: 'snacks',
    available: true,
    image: '/images/edamame.jpg',
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
    image: '/images/lava-cake.jpg',
    dietary: { vegetarian: true },
  },
  {
    id: 'ds-002',
    name: 'New York Cheesecake',
    description: 'Classic creamy cheesecake with graham cracker crust and berry compote.',
    price: 10.0,
    category: 'desserts',
    available: true,
    image: '/images/cheesecake.jpg',
    dietary: { vegetarian: true },
  },
  {
    id: 'ds-003',
    name: 'Ice Cream Sundae',
    description: 'Three scoops of vanilla ice cream with chocolate sauce, whipped cream, and a cherry.',
    price: 8.0,
    category: 'desserts',
    available: true,
    image: '/images/sundae.jpg',
    dietary: { vegetarian: true, glutenFree: true },
  },
  {
    id: 'ds-004',
    name: 'Brownie Bites',
    description: 'Rich chocolate brownie bites dusted with powdered sugar.',
    price: 7.0,
    category: 'desserts',
    available: true,
    image: '/images/brownie-bites.jpg',
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
