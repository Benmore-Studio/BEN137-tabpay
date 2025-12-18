import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MenuItem } from '../types';

interface FavoritesContextType {
  favorites: MenuItem[];
  loading: boolean;
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (item: MenuItem) => void;
  addFavorite: (item: MenuItem) => void;
  removeFavorite: (itemId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'tabpay_favorites';
const MAX_FAVORITES = 20;

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as MenuItem[];
          setFavorites(parsed);
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
      setLoading(false);
    };

    loadFavorites();
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, loading]);

  const isFavorite = (itemId: string): boolean => {
    return favorites.some((item) => item.id === itemId);
  };

  const addFavorite = (item: MenuItem) => {
    setFavorites((prev) => {
      // Check if already favorited
      if (prev.some((fav) => fav.id === item.id)) {
        return prev;
      }

      // Add to beginning, limit to MAX_FAVORITES
      const updated = [item, ...prev];
      return updated.slice(0, MAX_FAVORITES);
    });
  };

  const removeFavorite = (itemId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== itemId));
  };

  const toggleFavorite = (item: MenuItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
