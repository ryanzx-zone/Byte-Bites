import React, { useState } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, FlatList, Dimensions, Button, Alert } from "react-native";

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.1.139:5000';

function PRecipeSearch({ navigation }) {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [cookTime, setCookTime] = useState("");
  const [dietary, setDietary] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  const toggleSelection = (item, arraySetter, arrayState) => {
    if (arrayState.includes(item)) {
      arraySetter(arrayState.filter((i) => i !== item));
    } else {
      arraySetter([...arrayState, item]);
    }
  };

  const fetchRecipes = async () => {
    if (!query.trim()) {
      Alert.alert('Please enter a search term.');
      return;
    }

    setLoading(true);

    try {
      const queryParams = new URLSearchParams({ q: query });

      if (cookTime) queryParams.append('cook_time', cookTime);
      if (dietary.length > 0) queryParams.append('dietary', dietary.join(','));
      if (cuisines.length > 0) queryParams.append('cuisines', cuisines.join(','));

      const fullUrl = `${API_BASE_URL}/recipes/search?${queryParams.toString()}`;
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Recipe Search</Text>
        <TouchableOpacity style={styles.timerButton} onPress={() => navigation.navigate('Timer')}>
          <Text style={styles.timerButtonText}>Timer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.secondContainer}>
              <View style={styles.inputWithFilterRow}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ingredients"
                    placeholderTextColor="#999"
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                  />
                  <TouchableOpacity style={styles.iconContainer} onPress={fetchRecipes}>
                    <Image style={styles.searchImage} source={require("../assets/search-icon.png")} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.icon2Container} onPress={() => setShowFilters(!showFilters)}>
                  <Image style={styles.image2} source={require("../assets/filter-icon.jpg")} />
                </TouchableOpacity>
              </View>

              {showFilters && (
                <View style={styles.filterContainer}>
                  <Text style={styles.filterHeading}>Preparation Time</Text>
                  {["<30", "30-60", ">60"].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={styles.checkboxRow}
                      onPress={() => setCookTime(t === cookTime ? "" : t)}
                    >
                      <Text style={styles.checkbox}>
                        {cookTime === t ? "☑" : "☐"}{" "}
                      </Text>
                      <Text>{t === "<30" ? "Less than 30 mins" : t === "30-60" ? "30-60 mins" : "More than 1 hour"}</Text>
                    </TouchableOpacity>
                  ))}

                  <Text style={styles.filterHeading}>Dietary Preferences</Text>
                  {["Vegan", "Vegetarian", "Gluten-free", "Keto", "Paleo", "Others"].map((diet) => (
                    <TouchableOpacity
                      key={diet}
                      style={styles.checkboxRow}
                      onPress={() => toggleSelection(diet, setDietary, dietary)}
                    >
                      <Text style={styles.checkbox}>{dietary.includes(diet) ? "☑" : "☐"} </Text>
                      <Text>{diet}</Text>
                    </TouchableOpacity>
                  ))}

                  <Text style={styles.filterHeading}>Cuisines</Text>
                  {["Chinese", "Western", "Japanese", "Italian", "Mexican", "Others"].map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine}
                      style={styles.checkboxRow}
                      onPress={() => toggleSelection(cuisine, setCuisines, cuisines)}
                    >
                      <Text style={styles.checkbox}>{cuisines.includes(cuisine) ? "☑" : "☐"} </Text>
                      <Text>{cuisine}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity style={styles.filterSearchButton} onPress={fetchRecipes}>
                    <Text style={styles.filterSearchBtnText}>Apply Filters & Search</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {loading && <Text style={{ textAlign: 'center', padding: 10 }}>Loading...</Text>}
          </>
        }
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topContainer: {
    width: "100%",
    paddingHorizontal: width * 0.02,
    height: height * 0.1,
    justifyContent: "flex-end",
    backgroundColor: "#eb11ee",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  timerButton: {
    position: 'absolute',
    right: width * 0.04,
    bottom: height * 0.005,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 10,
    elevation: 3,
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eb11ee',
  },
  secondContainer: {
    marginTop: width * 0.05,
    alignItems: "center",
    width: "100%",
  },
  inputWithFilterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: width * 0.03,
    width: width * 0.8,
    height: height * 0.065,
    backgroundColor: "white",
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: "#000",
  },
  iconContainer: {
    paddingLeft: width * 0.02,
  },
  searchImage: {
    width: width * 0.07,
    height: width * 0.07,
  },
  icon2Container: {
    marginLeft: width * 0.025,
  },
  image2: {
    width: width * 0.09,
    height: width * 0.09,
  },
  filterContainer: {
    width: width * 0.95,
    marginTop: height * 0.02,
    padding: width * 0.05,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  filterHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: width * 0.01,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: width * 0.01,
  },
  checkbox: {
    fontSize: 18,
    marginRight: width * 0.01,
  },
  filterSearchButton: {
    marginTop: width * 0.02,
    paddingVertical: width * 0.025,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#eb11ee",
  },
  filterSearchBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  recipeItem: {
    marginVertical: width * 0.025,
    padding: width * 0.03,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: width * 0.95,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    marginRight: width * 0.03,
    borderRadius: 6,
  },
  recipeTitle: {
    fontSize: 16,
    flexShrink: 1,
  },
});

export default PRecipeSearch;
