import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Cloud, Sun, CloudRain, Moon, ChevronRight } from 'lucide-react-native';
import { WeatherData, UserPreferences } from '@/types/weather';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface WeatherCardProps {
  weather: WeatherData;
  preferences: UserPreferences;
}

export function WeatherCard({ weather, preferences }: WeatherCardProps) {
  const router = useRouter();
  const temp = weather.current.temperature_2m;
  const humidity = weather.current.relative_humidity_2m;
  const isDay = weather.current.is_day === 1;

  const convertTemp = (temp: number) => {
    if (preferences.unit === 'fahrenheit') {
      return ((temp * 9/5) + 32).toFixed(1);
    }
    return temp.toFixed(1);
  };

  const getBackgroundImage = () => {
    if (!isDay) return 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?q=80&w=1000';
    if (weather.hourly.rain[0] > 0) return 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1000';
    if (humidity > 80) return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1000';
    return 'https://images.unsplash.com/photo-1622278647429-71cb03bd1311?q=80&w=1000';
  };

  const WeatherIcon = () => {
    if (!isDay) return <Moon size={64} color="#FFFFFF" />;
    if (weather.hourly.rain[0] > 0) return <CloudRain size={64} color="#FFFFFF" />;
    if (humidity > 80) return <Cloud size={64} color="#FFFFFF" />;
    return <Sun size={64} color="#FFFFFF" />;
  };

  const getWeatherDescription = () => {
    if (!isDay) return 'Clear Night';
    if (weather.hourly.rain[0] > 0) return 'Rainy';
    if (humidity > 80) return 'Cloudy';
    return 'Sunny';
  };

  return (
    <TouchableOpacity 
      style={styles.cardWrapper}
      onPress={() => router.push('/forecast')}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: getBackgroundImage() }}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <WeatherIcon />
            <View style={styles.headerRight}>
              <Text style={styles.viewForecast}>View Forecast</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.weatherDescription}>{getWeatherDescription()}</Text>
          
          <Text style={styles.temperature}>
            {convertTemp(temp)}°{preferences.unit === 'celsius' ? 'C' : 'F'}
          </Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{humidity}%</Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Today</Text>
              <View style={styles.minMax}>
                <Text style={styles.detailValue}>
                  H: {convertTemp(weather.daily.temperature_2m_max[0])}°
                </Text>
                <Text style={styles.detailValue}>
                  L: {convertTemp(weather.daily.temperature_2m_min[0])}°
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  card: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewForecast: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  weatherDescription: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 20,
    marginTop: 16,
    opacity: 0.9,
  },
  temperature: {
    fontSize: 72,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginVertical: 16,
  },
  detailsContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 12,
  },
  minMax: {
    flexDirection: 'row',
    gap: 16,
  },
});