import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, LocationData } from '@/types/weather';

const PREFERENCES_KEY = '@weather_preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    unit: 'celsius',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updatePreferences(newPreferences: Partial<UserPreferences>) {
    try {
      const updated = { ...preferences, ...newPreferences };
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      setPreferences(updated);
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  }

  return { preferences, loading, updatePreferences };
}