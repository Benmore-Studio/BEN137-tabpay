import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, MenuItem, SelectedModifier, Venue, ServiceBar } from '../types';
import { applyMarkup, PRICING_CONFIG } from '../utils/pricing';

interface CartState {
  items: CartItem[];
  location: string | null;
  locationConfirmed: boolean;
  venue: Venue | null;
  serviceBar: ServiceBar | null;
  queuePosition: number | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'CONFIRM_LOCATION' }
  | { type: 'RESET_LOCATION_CONFIRMATION' }
  | { type: 'SET_VENUE'; payload: Venue }
  | { type: 'SET_SERVICE_BAR'; payload: ServiceBar }
  | { type: 'SET_QUEUE_POSITION'; payload: number }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartContextType {
  items: CartItem[];
  location: string | null;
  locationConfirmed: boolean;
  venue: Venue | null;
  serviceBar: ServiceBar | null;
  queuePosition: number | null;
  itemCount: number;
  subtotal: number;
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    selectedModifiers: SelectedModifier[],
    specialInstructions?: string
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setLocation: (location: string) => void;
  confirmLocation: () => void;
  resetLocationConfirmation: () => void;
  setVenue: (venue: Venue) => void;
  setServiceBar: (serviceBar: ServiceBar) => void;
  setQueuePosition: (position: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tabpay_cart';

function calculateItemPrice(
  basePrice: number,
  quantity: number,
  selectedModifiers: SelectedModifier[]
): number {
  // Apply markup to base price
  const markedUpBasePrice = applyMarkup(basePrice);

  // Apply markup to modifiers if configured
  const modifierTotal = selectedModifiers.reduce((total, modifier) => {
    return (
      total +
      modifier.selectedOptions.reduce((optTotal, opt) => {
        const modPrice = PRICING_CONFIG.applyToModifiers
          ? applyMarkup(opt.priceAdjustment)
          : opt.priceAdjustment;
        return optTotal + modPrice;
      }, 0)
    );
  }, 0);

  return (markedUpBasePrice + modifierTotal) * quantity;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.menuItem.id === action.payload.menuItem.id &&
          JSON.stringify(item.selectedModifiers) ===
            JSON.stringify(action.payload.selectedModifiers) &&
          item.specialInstructions === action.payload.specialInstructions
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingIndex];
        const newQuantity = existingItem.quantity + action.payload.quantity;
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: calculateItemPrice(
            existingItem.menuItem.price,
            newQuantity,
            existingItem.selectedModifiers
          ),
        };
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: action.payload.quantity,
                totalPrice: calculateItemPrice(
                  item.menuItem.price,
                  action.payload.quantity,
                  item.selectedModifiers
                ),
              }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_LOCATION':
      return { ...state, location: action.payload };

    case 'CONFIRM_LOCATION':
      return { ...state, locationConfirmed: true };

    case 'RESET_LOCATION_CONFIRMATION':
      return { ...state, locationConfirmed: false };

    case 'SET_VENUE':
      return { ...state, venue: action.payload };

    case 'SET_SERVICE_BAR':
      return { ...state, serviceBar: action.payload };

    case 'SET_QUEUE_POSITION':
      return { ...state, queuePosition: action.payload };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  location: null,
  locationConfirmed: false,
  venue: null,
  serviceBar: null,
  queuePosition: null,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      } catch (e) {
        console.error('Failed to parse saved cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = state.items.reduce((total, item) => total + item.totalPrice, 0);

  const addItem = (
    menuItem: MenuItem,
    quantity: number,
    selectedModifiers: SelectedModifier[],
    specialInstructions?: string
  ) => {
    const cartItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity,
      selectedModifiers,
      specialInstructions,
      totalPrice: calculateItemPrice(menuItem.price, quantity, selectedModifiers),
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setLocation = (location: string) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
  };

  const confirmLocation = () => {
    dispatch({ type: 'CONFIRM_LOCATION' });
  };

  const resetLocationConfirmation = () => {
    dispatch({ type: 'RESET_LOCATION_CONFIRMATION' });
  };

  const setVenue = (venue: Venue) => {
    dispatch({ type: 'SET_VENUE', payload: venue });
  };

  const setServiceBar = (serviceBar: ServiceBar) => {
    dispatch({ type: 'SET_SERVICE_BAR', payload: serviceBar });
    // Calculate queue position based on active orders
    const position = serviceBar.activeOrders + 1;
    dispatch({ type: 'SET_QUEUE_POSITION', payload: position });
  };

  const setQueuePosition = (position: number) => {
    dispatch({ type: 'SET_QUEUE_POSITION', payload: position });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        location: state.location,
        locationConfirmed: state.locationConfirmed,
        venue: state.venue,
        serviceBar: state.serviceBar,
        queuePosition: state.queuePosition,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setLocation,
        confirmLocation,
        resetLocationConfirmation,
        setVenue,
        setServiceBar,
        setQueuePosition,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
