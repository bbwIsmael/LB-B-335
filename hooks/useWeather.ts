import { useState, useEffect } from 'react';
import { WeatherData, LocationData } from '@/types/weather';

export function useWeather(location: LocationData | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      if (!location) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m,relative_humidity_2m,wind_speed_80m,rain,showers&current=temperature_2m,relative_humidity_2m,is_day&timezone=auto`
        );
        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Error fetching weather data');
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  return { weather, loading, error };
}