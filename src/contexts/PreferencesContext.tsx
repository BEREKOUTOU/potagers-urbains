import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContextBase';

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklySummary: boolean;
  language: string;
  timezone: string;
}

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
    language: 'fr',
    timezone: 'Europe/Paris',
  });
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    if (user && token) {
      fetchPreferences();
    }
  }, [user, token]);

  const fetchPreferences = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences({
          emailNotifications: data.preferences.email_notifications,
          pushNotifications: data.preferences.push_notifications,
          weeklySummary: data.preferences.weekly_summary,
          language: data.preferences.language,
          timezone: data.preferences.timezone,
        });
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(prefs),
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences({
          emailNotifications: data.preferences.email_notifications,
          pushNotifications: data.preferences.push_notifications,
          weeklySummary: data.preferences.weekly_summary,
          language: data.preferences.language,
          timezone: data.preferences.timezone,
        });
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, isLoading }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};
