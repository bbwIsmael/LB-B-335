import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { usePreferences } from '@/hooks/usePreferences';
import { WeatherCard } from '@/components/WeatherCard';
import { SearchBar } from '@/components/SearchBar';
import { useState, useCallback } from 'react';

export default function HomeScreen() {
  const { location, error: locationError, loading: locationLoading } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { weather, loading: weatherLoading, error: weatherError } = useWeather(selectedLocation || location);
  const { preferences } = usePreferences();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleLocationSelect = (city: string, latitude: number, longitude: number) => {
    setSelectedLocation({ city, latitude, longitude });
  };

  if (locationLoading || weatherLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading weather data...</Text>
      </View>
    );
  }

  if (locationError || weatherError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          {locationError || weatherError}
        </Text>
      </View>
    );
  }

  if (!weather || (!location && !selectedLocation)) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No weather data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#0A84FF"
        />
      }
    >
      <SearchBar onLocationSelect={handleLocationSelect} />
      <Text style={styles.city}>{selectedLocation?.city || location?.city}</Text>
      <WeatherCard weather={weather} preferences={preferences} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingTop: 60,
  },
  city: {
    fontSize: 34,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#98989D',
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FF453A',
    textAlign: 'center',
    marginTop: 20,
  },
});