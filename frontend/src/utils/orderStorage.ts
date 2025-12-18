import type { Order } from '../types';

const ORDER_HISTORY_KEY = 'tabpay_order_history';
const MAX_ORDERS = 50;

/**
 * Save an order to localStorage
 */
export function saveOrder(order: Order): void {
  try {
    const existingOrders = getOrderHistory();

    // Add new order to the beginning
    const updatedOrders = [order, ...existingOrders];

    // Keep only the most recent MAX_ORDERS
    const trimmedOrders = updatedOrders.slice(0, MAX_ORDERS);

    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(trimmedOrders));
  } catch (error) {
    console.error('Failed to save order to localStorage:', error);
  }
}

/**
 * Get all orders from localStorage
 */
export function getOrderHistory(): Order[] {
  try {
    const stored = localStorage.getItem(ORDER_HISTORY_KEY);
    if (!stored) return [];

    const orders = JSON.parse(stored) as Order[];

    // Parse date strings back to Date objects
    return orders.map(order => ({
      ...order,
      createdAt: new Date(order.createdAt),
      scheduledFor: order.scheduledFor ? new Date(order.scheduledFor) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load order history from localStorage:', error);
    return [];
  }
}

/**
 * Get a specific order by ID
 */
export function getOrderById(orderId: string): Order | undefined {
  const orders = getOrderHistory();
  return orders.find(order => order.id === orderId);
}

/**
 * Get the most recent N orders
 */
export function getRecentOrders(limit: number): Order[] {
  const orders = getOrderHistory();
  return orders.slice(0, limit);
}

/**
 * Clear all order history
 */
export function clearOrderHistory(): void {
  try {
    localStorage.removeItem(ORDER_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear order history:', error);
  }
}

/**
 * Get order count
 */
export function getOrderCount(): number {
  const orders = getOrderHistory();
  return orders.length;
}
