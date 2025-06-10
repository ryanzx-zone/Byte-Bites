import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';

const API_BASE_URL = 'http://10.0.2.2:5000'; // Android emulator Flask server

export default function Homescreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    if (!query.trim()) {
      Alert.alert('Please enter a search term.');
      return;
    }

    try {
      const fullUrl = `${API_BASE_URL}/recipes/search?q=${encodeURIComponent(query)}`;
      console.log('Fetching:', fullUrl);

      const response = await fetch(fullUrl);
      const data = await response.json();

      if (response.ok) {
        setRecipes(data.results || []);
      } else {
        console.error('Server error:', data);
        Alert.alert('Error from server:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Network request failed. Is Flask running at 10.0.2.2:5000?');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Search</Text>

      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Search for recipes..."
      />

      <Button title="Search" onPress={fetchRecipes} />

      <FlatList
        data={recipes}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <View style={styles.contentRow}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.recipeTitle}>{item.title}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Button
                title="View Recipe"
                onPress={() => {
                  console.log('BUTTON CLICKED:', item.id);
                  navigation.navigate('RecipeDetail', { id: item.id });
                }}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  recipeItem: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 6,
  },
  recipeTitle: {
    fontSize: 16,
    flexShrink: 1,
  }
});
