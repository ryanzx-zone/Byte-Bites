import React, { useEffect, useState } from 'react';
import {Text, View, Image, ScrollView, StyleSheet, ActivityIndicator, Alert, Platform, StatusBar, SafeAreaView, TouchableOpacity, Dimensions, } from 'react-native';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://ioh5g0e3ih.execute-api.ap-southeast-1.amazonaws.com/Prod';

export default function RecipeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState({});

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

  const toggleStep = (index) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (!recipe) return <Text>No recipe data found.</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{recipe.title}</Text>
        <Image source={{ uri: recipe.image }} style={styles.image} />

        <Text style={[styles.section, { marginTop: height * 0.03 }]}>Ingredients:</Text>
        {recipe.extendedIngredients?.map((ing, index) => (
          <Text key={index} style={styles.ingredientText}>
            • {ing.original}
          </Text>
        ))}

        <View style={styles.instructionRow}>
          <Text style={[styles.section, { marginTop: height * 0.04 }]}>Instructions:</Text>
          <TouchableOpacity
            style={styles.TimerButton}
            onPress={() => navigation.navigate('Timer')}
          >
            <Text style={styles.timerButtonText}>Timer</Text>
          </TouchableOpacity>
        </View>

        {recipe.analyzedInstructions?.[0]?.steps?.length ? (
          recipe.analyzedInstructions[0].steps.map((stepObj, index) => {
            const fullText = `${index + 1}. ${stepObj.step}`;
            const isExpanded = expandedSteps[index];
            const truncated = fullText.length > 40 ? fullText.slice(0, 40).trim() + '...' : fullText;

            return (
              <View key={index} style={{ marginBottom: height * 0.015 }}>
                <Text style={styles.instructionText}>
                  {isExpanded ? fullText : truncated}
                </Text>
                {fullText.length > 40 && (
                  <TouchableOpacity onPress={() => toggleStep(index)}>
                    <Text style={styles.toggleText}>
                      {isExpanded ? 'Show less' : 'Show more'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : recipe.instructions ? (
          recipe.instructions
            .replace(/<[^>]*>/g, '') 
            .split('. ')
            .filter((sentence) => sentence.trim().length > 0)
            .map((sentence, index) => {
              const fullText = `${index + 1}. ${sentence.trim()}${ sentence.trim().endsWith('.') ? '' : '.' }`;
              const isExpanded = expandedSteps[index];
              const truncated = fullText.length > 40 ? fullText.slice(0, 40).trim() + '...' : fullText;

              return (
                <View key={index} style={{ marginBottom: height * 0.015 }}>
                  <Text style={styles.instructionText}>
                    {isExpanded ? fullText : truncated}
                  </Text>
                  {fullText.length > 40 && (
                    <TouchableOpacity onPress={() => toggleStep(index)}>
                      <Text style={styles.toggleText}>
                        {isExpanded ? 'Show less' : 'Show more'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
        ) : (
          <Text style={styles.instructionText}>No instructions provided.</Text>
        )}
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
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    paddingBottom: height * 0.04,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  image: {
    width: '100%',
    height: height * 0.35,
    borderRadius: 10,
    marginBottom: height * 0.025,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ingredientText: {
    fontSize: 15,
    marginBottom: height * 0.005,
    lineHeight: height * 0.03,
  },
  instructionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.025,
    marginBottom: height * 0.01,
  },
  TimerButton: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 8,
    marginLeft: width * 0.025,
    backgroundColor: '#eb11ee',
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    fontSize: 15,
    lineHeight: height * 0.04,
  },
  toggleText: {
    fontSize: 14,
    marginTop: height * 0.02,
    color: '#007BFF',
  },
});
