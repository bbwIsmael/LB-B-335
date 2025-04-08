import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { useLocation } from '@/hooks/useLocation';

interface SearchBarProps {
  onLocationSelect: (city: string, lat: number, lon: number) => void;
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { searchLocation } = useLocation();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    const location = await searchLocation(query);
    if (location) {
      onLocationSelect(location.city, location.latitude, location.longitude);
    }
    setIsSearching(false);
    setQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search size={20} color="#98989D" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          placeholderTextColor="#98989D"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <X size={20} color="#98989D" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.searchButton, isSearching && styles.searchingButton]}
        onPress={handleSearch}
        disabled={isSearching || !query.trim()}>
        {isSearching ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Search size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  searchIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    paddingHorizontal: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    padding: 8,
    marginRight: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingButton: {
    opacity: 0.7,
  },
});