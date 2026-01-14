import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Order } from '../types';
import { getOrderHistory, saveOrder as saveOrderToStorage } from '../utils/orderStorage';

interface OrderHistoryContextType {
  orders: Order[];
  loading: boolean;
  activeOrderIds: string[];
  addOrder: (order: Order) => void;
  getRecentOrders: (limit: number) => Order[];
  refreshOrders: () => void;
  addActiveOrderId: (orderId: string) => void;
  clearActiveOrders: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

const ACTIVE_ORDERS_KEY = 'tabpay_active_orders';

export function OrderHistoryProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderIds, setActiveOrderIds] = useState<string[]>(() => {
    // Load from localStorage on init
    const stored = localStorage.getItem(ACTIVE_ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Load orders on mount
  useEffect(() => {
    const loadOrders = () => {
      setLoading(true);
      const loadedOrders = getOrderHistory();
      setOrders(loadedOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  const addOrder = (order: Order) => {
    // Save to localStorage
    saveOrderToStorage(order);

    // Update state
    setOrders((prev) => [order, ...prev]);
  };

  const getRecentOrders = (limit: number): Order[] => {
    return orders.slice(0, limit);
  };

  const refreshOrders = () => {
    const loadedOrders = getOrderHistory();
    setOrders(loadedOrders);
  };

  const addActiveOrderId = (orderId: string) => {
    setActiveOrderIds((prev) => {
      // Avoid duplicates
      if (prev.includes(orderId)) return prev;
      const updated = [...prev, orderId];
      localStorage.setItem(ACTIVE_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearActiveOrders = () => {
    setActiveOrderIds([]);
    localStorage.removeItem(ACTIVE_ORDERS_KEY);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    // Update in state
    setOrders((prev) => {
      const updated = prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      );
      // Also update localStorage
      localStorage.setItem('tabpay_order_history', JSON.stringify(updated));
      return updated;
    });

    // If order is no longer active, remove from activeOrderIds
    if (status === 'delivered' || status === 'cancelled') {
      setActiveOrderIds((prev) => {
        const updated = prev.filter((id) => id !== orderId);
        localStorage.setItem(ACTIVE_ORDERS_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <OrderHistoryContext.Provider
      value={{
        orders,
        loading,
        activeOrderIds,
        addOrder,
        getRecentOrders,
        refreshOrders,
        addActiveOrderId,
        clearActiveOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
}

export function useOrderHistory() {
  const context = useContext(OrderHistoryContext);
  if (!context) {
    throw new Error('useOrderHistory must be used within an OrderHistoryProvider');
  }
  return context;
}
