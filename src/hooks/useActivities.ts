import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContextBase';

interface Activity {
  id: number;
  user_id: number;
  activity_type: string;
  description: string;
  entity_type?: string;
  entity_id?: number;
  created_at: string;
}

export const useActivities = (limit: number = 50) => {
  const { user, token } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    if (user && token) {
      fetchActivities();
    }
  }, [user, token]);

  const fetchActivities = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/activities?limit=${limit}&offset=0`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { activities, isLoading, refetch: fetchActivities };
};
