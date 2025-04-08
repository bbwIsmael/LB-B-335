import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { usePreferences } from '@/hooks/usePreferences';
import { SearchBar } from '@/components/SearchBar';

type ViewMode = 'hourly' | 'daily';

export default function ForecastScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('hourly');
  const { location } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { weather, loading } = useWeather(selectedLocation || location);
  const { preferences } = usePreferences();

  const handleLocationSelect = (city: string, latitude: number, longitude: number) => {
    setSelectedLocation({ city, latitude, longitude });
  };

  if (loading || !weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading forecast data...</Text>
      </View>
    );
  }

  const convertTemp = (temp: number) => {
    if (preferences.unit === 'fahrenheit') {
      return ((temp * 9/5) + 32);
    }
    return temp;
  };

  const hourlyData = {
    labels: weather.hourly.time.slice(0, 24).map((time) => 
      new Date(time).getHours().toString().padStart(2, '0')
    ),
    datasets: [
      {
        data: weather.hourly.temperature_2m.slice(0, 24).map(convertTemp),
        color: () => '#0A84FF',
      },
    ],
  };

  const dailyData = {
    labels: ['Today', 'Tomorrow'],
    datasets: [
      {
        data: [
          convertTemp(weather.daily.temperature_2m_max[0]),
          convertTemp(weather.daily.temperature_2m_max[1]),
        ],
        color: () => '#0A84FF',
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forecast</Text>
        <SearchBar onLocationSelect={handleLocationSelect} />
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'hourly' && styles.activeToggle]}
            onPress={() => setViewMode('hourly')}
          >
            <Text style={[styles.toggleText, viewMode === 'hourly' && styles.activeToggleText]}>
              Hourly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'daily' && styles.activeToggle]}
            onPress={() => setViewMode('daily')}
          >
            <Text style={[styles.toggleText, viewMode === 'daily' && styles.activeToggleText]}>
              Daily
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={viewMode === 'hourly' ? hourlyData : dailyData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#2C2C2E',
            backgroundGradientFrom: '#2C2C2E',
            backgroundGradientTo: '#2C2C2E',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
            labelColor: () => '#98989D',
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#0A84FF',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.current.relative_humidity_2m}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Wind Speed</Text>
          <Text style={styles.detailValue}>{weather.hourly.wind_speed_80m[0]} m/s</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rain</Text>
          <Text style={styles.detailValue}>{weather.hourly.rain[0]} mm</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 2,
    marginTop: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeToggle: {
    backgroundColor: '#3A3A3C',
  },
  toggleText: {
    fontFamily: 'Inter-Regular',
    color: '#98989D',
    fontSize: 15,
  },
  activeToggleText: {
    color: '#0A84FF',
    fontFamily: 'Inter-Bold',
  },
  chartContainer: {
    backgroundColor: '#2C2C2E',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  details: {
    backgroundColor: '#2C2C2E',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    color: '#98989D',
    fontSize: 16,
  },
  detailValue: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#98989D',
    textAlign: 'center',
    marginTop: 20,
  },
});