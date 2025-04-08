import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { LocationData } from '@/types/weather';

const GEOAPIFY_API_KEY = '28b3400429204e47b1d254efa9c5c7d0';

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function getCityName(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      return data.features[0].properties.city;
    } catch (err) {
      console.error('Error getting city name:', err);
      return 'Unknown City';
    }
  }

  async function searchLocation(query: string): Promise<LocationData | null> {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          query
        )}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const location = data.features[0];
        return {
          city: location.properties.city,
          latitude: location.properties.lat,
          longitude: location.properties.lon,
        };
      }
      return null;
    } catch (err) {
      console.error('Error searching location:', err);
      return null;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const city = await getCityName(location.coords.latitude, location.coords.longitude);
        
        setLocation({
          city,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        setError('Error getting location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, error, loading, searchLocation };
}