/**
 * Web Notifications utility for TabPay
 * Handles push notification permissions and delivery for order status updates
 */

import type { OrderStatus } from '../types';

export interface NotificationPermissionState {
  permission: NotificationPermission;
  isSupported: boolean;
}

/**
 * Check if notifications are supported in this browser
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission state
 */
export function getNotificationPermission(): NotificationPermissionState {
  return {
    permission: isNotificationSupported() ? Notification.permission : 'denied',
    isSupported: isNotificationSupported(),
  };
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Show a notification to the user
 */
export async function showNotification(
  title: string,
  options: NotificationOptions = {}
): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    // Use type assertion for extended notification options supported by service workers
    const notificationOptions = {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'tabpay-order',
      renotify: true,
      ...options,
    } as NotificationOptions;
    await registration.showNotification(title, notificationOptions);
    return true;
  } catch {
    // Fallback to regular Notification API
    try {
      new Notification(title, options);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Predefined notification messages for each order status
 */
export const ORDER_STATUS_MESSAGES: Record<OrderStatus, { title: string; body: string }> = {
  received: {
    title: 'Order Received!',
    body: 'Your order has been received and will be prepared shortly.',
  },
  preparing: {
    title: 'Your Order is Being Prepared',
    body: 'The bar is making your drinks now.',
  },
  delivering: {
    title: 'On the Way!',
    body: 'Your order is being delivered to your location.',
  },
  delivered: {
    title: 'Order Delivered',
    body: 'Enjoy your drinks! Tap to order again.',
  },
  cancelled: {
    title: 'Order Cancelled',
    body: 'Your order has been cancelled.',
  },
};
