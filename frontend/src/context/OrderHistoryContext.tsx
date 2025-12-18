import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Order } from '../types';
import { getOrderHistory, saveOrder as saveOrderToStorage } from '../utils/orderStorage';

interface OrderHistoryContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Order) => void;
  getRecentOrders: (limit: number) => Order[];
  refreshOrders: () => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

export function OrderHistoryProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <OrderHistoryContext.Provider
      value={{
        orders,
        loading,
        addOrder,
        getRecentOrders,
        refreshOrders,
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
