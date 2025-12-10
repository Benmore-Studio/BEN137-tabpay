export interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface Modifier {
  id: string;
  name: string;
  options: ModifierOption[];
  required: boolean;
  maxSelections?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  modifiers?: Modifier[];
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedModifier {
  modifierId: string;
  modifierName: string;
  selectedOptions: ModifierOption[];
}

export interface Order {
  id: string;
  items: CartItem[];
  location: string;
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  estimatedDeliveryTime?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'delivering' | 'delivered';
