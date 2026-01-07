import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  showNotification,
  ORDER_STATUS_MESSAGES,
  type NotificationPermissionState,
} from '../utils/notifications';
import type { OrderStatus } from '../types';

interface NotificationContextType {
  permissionState: NotificationPermissionState;
  requestPermission: () => Promise<boolean>;
  notifyOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  hasPromptedForPermission: boolean;
  setHasPromptedForPermission: (value: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_PROMPTED_KEY = 'tabpay_notification_prompted';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>(
    getNotificationPermission()
  );
  const [hasPromptedForPermission, setHasPromptedForPermissionState] = useState(() => {
    return localStorage.getItem(NOTIFICATION_PROMPTED_KEY) === 'true';
  });

  // Update permission state on mount
  useEffect(() => {
    setPermissionState(getNotificationPermission());
  }, []);

  const setHasPromptedForPermission = useCallback((value: boolean) => {
    setHasPromptedForPermissionState(value);
    localStorage.setItem(NOTIFICATION_PROMPTED_KEY, value.toString());
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const permission = await requestNotificationPermission();
    setPermissionState(getNotificationPermission());
    setHasPromptedForPermission(true);
    return permission === 'granted';
  }, [setHasPromptedForPermission]);

  const notifyOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const message = ORDER_STATUS_MESSAGES[status];
    if (message) {
      await showNotification(message.title, {
        body: `Order #${orderId} - ${message.body}`,
        data: { orderId, status },
      });
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        permissionState,
        requestPermission,
        notifyOrderStatus,
        hasPromptedForPermission,
        setHasPromptedForPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
