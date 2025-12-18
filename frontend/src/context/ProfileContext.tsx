import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile, PaymentMethod, SavedLocation, UserPreferences } from '../types/auth';
import { useAuth } from './AuthContext';

const PROFILE_STORAGE_KEY = 'tabpay_user_profile';

interface ProfileContextType {
  profile: UserProfile | null;
  isGuest: boolean;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  addSavedLocation: (location: SavedLocation) => void;
  removeSavedLocation: (id: string) => void;
  setDefaultLocation: (id: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isGuest = !user;

  // Load profile from localStorage on mount
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsedProfile = JSON.parse(stored) as UserProfile;
        // Verify it's for the current user
        if (parsedProfile.user.id === user.id) {
          setProfile(parsedProfile);
        } else {
          // Different user, create new profile
          initializeProfile(user);
        }
      } else {
        // No stored profile, initialize
        initializeProfile(user);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      initializeProfile(user);
    }

    setLoading(false);
  }, [user]);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile && !loading) {
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      } catch (error) {
        console.error('Failed to save profile:', error);
      }
    }
  }, [profile, loading]);

  const initializeProfile = (currentUser: typeof user) => {
    if (!currentUser) return;

    const newProfile: UserProfile = {
      user: currentUser,
      paymentMethods: [],
      savedLocations: [],
      preferences: {
        defaultTipPercent: 15,
        notifications: true,
        autoReorder: false,
      },
    };
    setProfile(newProfile);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!profile) return;
    setProfile({ ...profile, ...data });
  };

  const addPaymentMethod = (method: PaymentMethod) => {
    if (!profile) return;

    // If this is the first payment method, make it default
    const isFirstMethod = profile.paymentMethods.length === 0;
    const newMethod = { ...method, isDefault: isFirstMethod || method.isDefault };

    // If setting as default, unset others
    const updatedMethods = newMethod.isDefault
      ? profile.paymentMethods.map((m) => ({ ...m, isDefault: false }))
      : profile.paymentMethods;

    setProfile({
      ...profile,
      paymentMethods: [...updatedMethods, newMethod],
    });
  };

  const removePaymentMethod = (id: string) => {
    if (!profile) return;

    const filtered = profile.paymentMethods.filter((m) => m.id !== id);

    // If we removed the default and there are others, make the first one default
    const removedDefault = profile.paymentMethods.find((m) => m.id === id)?.isDefault;
    if (removedDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }

    setProfile({
      ...profile,
      paymentMethods: filtered,
    });
  };

  const setDefaultPaymentMethod = (id: string) => {
    if (!profile) return;

    const updated = profile.paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }));

    setProfile({
      ...profile,
      paymentMethods: updated,
    });
  };

  const addSavedLocation = (location: SavedLocation) => {
    if (!profile) return;

    // If this is the first location, make it default
    const isFirstLocation = profile.savedLocations.length === 0;
    const newLocation = { ...location, isDefault: isFirstLocation || location.isDefault };

    // If setting as default, unset others
    const updatedLocations = newLocation.isDefault
      ? profile.savedLocations.map((l) => ({ ...l, isDefault: false }))
      : profile.savedLocations;

    setProfile({
      ...profile,
      savedLocations: [...updatedLocations, newLocation],
    });
  };

  const removeSavedLocation = (id: string) => {
    if (!profile) return;

    const filtered = profile.savedLocations.filter((l) => l.id !== id);

    // If we removed the default and there are others, make the first one default
    const removedDefault = profile.savedLocations.find((l) => l.id === id)?.isDefault;
    if (removedDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }

    setProfile({
      ...profile,
      savedLocations: filtered,
    });
  };

  const setDefaultLocation = (id: string) => {
    if (!profile) return;

    const updated = profile.savedLocations.map((location) => ({
      ...location,
      isDefault: location.id === id,
    }));

    setProfile({
      ...profile,
      savedLocations: updated,
    });
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (!profile) return;

    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        ...preferences,
      },
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isGuest,
        loading,
        updateProfile,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        addSavedLocation,
        removeSavedLocation,
        setDefaultLocation,
        updatePreferences,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
