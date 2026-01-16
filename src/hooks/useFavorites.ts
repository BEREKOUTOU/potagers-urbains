import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContextBase';

interface Favorite {
  id: number;
  user_id: number;
  item_type: 'garden' | 'resource' | 'guide' | 'event';
  item_id: number;
  created_at: string;
}

export const useFavorites = () => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    if (user && token) {
      fetchFavorites();
    }
  }, [user, token]);

  const fetchFavorites = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (itemType: Favorite['item_type'], itemId: number) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ itemType, itemId }),
      });

      if (response.ok) {
        await fetchFavorites();
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (favoriteId: number) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchFavorites();
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      throw error;
    }
  };

  return { favorites, isLoading, addFavorite, removeFavorite, refetch: fetchFavorites };
};
