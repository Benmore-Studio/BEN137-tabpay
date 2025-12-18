export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  isAgeVerified: boolean;
  hasPaymentMethod: boolean;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple-pay' | 'google-pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  image?: string;
}

export interface ServiceBar {
  id: string;
  venueId: string;
  name: string;
  location: string;
  activeOrders: number;
  availableServers: number;
  estimatedWaitMinutes: number;
  status: 'low' | 'medium' | 'high';
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SavedLocation {
  id: string;
  label: string;
  venue: Venue;
  location: string;
  isDefault: boolean;
}

export interface UserPreferences {
  defaultTipPercent: number;
  notifications: boolean;
  autoReorder: boolean;
}

export interface UserProfile {
  user: User;
  paymentMethods: PaymentMethod[];
  savedLocations: SavedLocation[];
  preferences: UserPreferences;
}
