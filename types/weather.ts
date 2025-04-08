export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_80m: number[];
    rain: number[];
    showers: number[];
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface LocationData {
  city: string;
  latitude: number;
  longitude: number;
}

export interface UserPreferences {
  unit: 'celsius' | 'fahrenheit';
  defaultLocation?: LocationData;
}