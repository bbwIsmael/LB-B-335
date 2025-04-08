import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import { usePreferences } from '@/hooks/usePreferences';

export default function SettingsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const { searchLocation } = useLocation();
  const { preferences, updatePreferences } = usePreferences();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    const location = await searchLocation(searchQuery);
    if (location) {
      await updatePreferences({ defaultLocation: location });
    }
    setSearching(false);
    setSearchQuery('');
  };

  const toggleUnit = () => {
    updatePreferences({
      unit: preferences.unit === 'celsius' ? 'fahrenheit' : 'celsius',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperature Unit</Text>
        <View style={styles.unitToggle}>
          <Text style={styles.unitText}>Celsius</Text>
          <Switch
            value={preferences.unit === 'fahrenheit'}
            onValueChange={toggleUnit}
            trackColor={{ false: '#3A3A3C', true: '#0A84FF' }}
            ios_backgroundColor="#3A3A3C"
          />
          <Text style={styles.unitText}>Fahrenheit</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Location</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter city name"
            placeholderTextColor="#98989D"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>
        {preferences.defaultLocation && (
          <Text style={styles.currentLocation}>
            Current: {preferences.defaultLocation.city}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  section: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  unitText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#98989D',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#3C3C3E',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    backgroundColor: '#3A3A3C',
  },
  searchButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  currentLocation: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#98989D',
  },
});