import React, { useEffect, useState } from 'react';
import {
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = 'http://10.0.2.2:5000';

export default function RecipeDetailScreen({ route }) {
  const { id } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-recipe/${id}`);
        const data = await response.json();

        if (response.ok) {
          setRecipe(data);
        } else {
          Alert.alert('Error', data.error || 'Failed to load recipe.');
        }
      } catch (error) {
        Alert.alert('Network error', 'Could not fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (!recipe) return <Text>No recipe data found.</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Image source={{ uri: recipe.image }} style={styles.image} />

        <Text style={styles.section}>Ingredients:</Text>
        {recipe.extendedIngredients?.map((ing, index) => (
          <Text key={index}>• {ing.original}</Text>
        ))}

        <Text style={styles.section}>Instructions:</Text>
        <Text>{recipe.instructions?.replace(/<[^>]*>/g, '') || 'No instructions provided.'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
});