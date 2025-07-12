import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert, } from "react-native";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/FirebaseConfig";

const { height, width } = Dimensions.get("window");

function Mealplanner({ navigation }) {
  const [mealPlan, setMealPlan] = useState({});
  const [loading, setLoading] = useState(true);

  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", ];
  const meals = ["breakfast", "lunch", "dinner"];

  const createEmptyMealPlan = () =>
    week.reduce((acc, day) => {
      acc[day] = { breakfast: "", lunch: "", dinner: "" };
      return acc;
    }, {});

  const fetchMealPlan = async () => {
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();

        if (data.mealPlans) {
          setMealPlan(data.mealPlans);
        } else {
          const newPlan = createEmptyMealPlan();
          await updateDoc(userDocRef, { mealPlans: newPlan });
          setMealPlan(newPlan);
        }
      } else {
        const newPlan = createEmptyMealPlan();
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date().toISOString(),
          mealPlans: newPlan,
        });
        setMealPlan(newPlan);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveMealPlan = async (updatedMealPlan) => {
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { mealPlans: updatedMealPlan });
    } catch (error) {
      console.log("Error saving meal plan:", error);
    }
  };

  const handleInputChange = (day, meal, value) => {
    const updated = {
      ...mealPlan,
      [day]: {
        ...mealPlan[day],
        [meal]: value,
      },
    };
    setMealPlan(updated);
    saveMealPlan(updated);
  };

  const clearAll = () => {
    const emptyPlan = createEmptyMealPlan();
    setMealPlan(emptyPlan);
    saveMealPlan(emptyPlan);
  };

  const mealDayBox = (day) => (
    <View key={day} style={styles.dayBox}>
      <Text style={styles.dayLabel}>{day}</Text>
      <View style={styles.mealInputsContainer}>
        {meals.map((meal) => (
          <TextInput
            key={`${day}-${meal}`}
            style={styles.mealInput}
            placeholder={meal.charAt(0).toUpperCase() + meal.slice(1)}
            value={mealPlan[day]?.[meal] || ""}
            onChangeText={(text) => handleInputChange(day, meal, text)}
          />
        ))}
      </View>
    </View>
  );

  useEffect(() => {
    fetchMealPlan();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: height * 0.5, textAlign: "center" }}>
          Loading Meal Plan...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Meal Planner</Text>
        <TouchableOpacity
          style={styles.trackerButton}
          onPress={() => navigation.navigate("CT")}
        >
          <Text style={styles.trackerButtonText}>Calorie Tracker</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <View style={styles.clearButtonContainer}>
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {week.map(mealDayBox)}

        <View style={styles.bottomContainer}>
          <Text style={styles.helperText}>
            Don’t know what to eat? Need some meal inspirations? Tap here now!
          </Text>

          <TouchableOpacity
            style={styles.featureBox}
            onPress={() => navigation.navigate("RecipeSearch")}
          >
            <Text style={styles.featureText}>Recipe Search</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
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
    color: "#fff" 
  },
  trackerButton: {
    position: "absolute",
    right: width * 0.04,
    bottom: height * 0.005,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 10,
    elevation: 3,
  },
  trackerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#eb11ee",
  },
  scrollArea: {
    paddingHorizontal: width * 0.025,
    paddingTop: height * 0.015,
    paddingBottom: height * 0.03,
  },
  clearButtonContainer: {
    alignItems: "flex-end",
    marginBottom: height * 0.01,
    marginRight: width * 0.025,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#eb11ee",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  dayBox: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    marginBottom: height * 0.012,
    padding: width * 0.025,
    alignItems: "flex-start",
  },
  dayLabel: {
    width: width * 0.23,
    fontWeight: "bold",
    fontSize: 16,
    marginRight: width * 0.01,
    color: "#333",
    paddingTop: height * 0.005,
  },
  mealInputsContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  mealInput: {
    marginBottom: height * 0.005,
    padding: height * 0.013,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  bottomContainer: {
    marginTop: height * 0.02,
    alignItems: "center",
    paddingHorizontal: width * 0.07,
  },
  helperText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginBottom: height * 0.015,
  },
  featureBox: {
    width: "100%",
    height: height * 0.065,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#eb11ee",
  },
  featureText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});

export default Mealplanner;
