import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, } from "react-native";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/FirebaseConfig";

const { height, width } = Dimensions.get("window");

const CalorieTracker = () => {
  const [calorieData, setCalorieData] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalCalories, setTotalCalories] = useState(null);

  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", ];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  const createEmptyCalorieData = () =>
    week.reduce((acc, day) => {
      acc[day] = { Breakfast: "", Lunch: "", Dinner: "" };
      return acc;
    }, {});

  const fetchCalorieData = async () => {
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.calorieTracker) {
          setCalorieData(data.calorieTracker);
        } else {
          const empty = createEmptyCalorieData();
          await updateDoc(docRef, { calorieTracker: empty });
          setCalorieData(empty);
        }
      } else {
        const empty = createEmptyCalorieData();
        await setDoc(docRef, {
          email: user.email,
          createdAt: new Date().toISOString(),
          calorieTracker: empty,
        });
        setCalorieData(empty);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveCalorieData = async (updatedData) => {
    try {
      const user = auth.currentUser;
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { calorieTracker: updatedData });
    } catch (error) {
      console.log("Error saving calorie data:", error);
    }
  };

  const handleInputChange = (day, meal, value) => {
    const updated = {
      ...calorieData,
      [day]: {
        ...calorieData[day],
        [meal]: value,
      },
    };
    setCalorieData(updated);
    saveCalorieData(updated);
  };

  const clearAll = () => {
    const empty = createEmptyCalorieData();
    setCalorieData(empty);
    setTotalCalories(null);
    saveCalorieData(empty);
  };

  const calculateTotalCalories = () => {
    let total = 0;
    for (const day of week) {
      for (const meal of meals) {
        const value = parseInt(calorieData[day]?.[meal] || 0);
        if (!isNaN(value)) total += value;
      }
    }
    setTotalCalories(total);
  };

  const getDailyTotal = (day) => {
    return meals.reduce((sum, meal) => {
      const val = parseInt(calorieData[day]?.[meal] || 0);
      return !isNaN(val) ? sum + val : sum;
    }, 0);
  };

  const renderDayBox = (day) => {
    const dailyTotal = getDailyTotal(day);

    return (
      <View key={day} style={styles.dayBox}>
        <Text style={styles.dayLabel}>{day}</Text>
        {meals.map((meal) => (
          <View key={`${day}-${meal}`} style={styles.mealRow}>
            <Text style={styles.mealText}>{meal}</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Calories"
              keyboardType="numeric"
              value={calorieData[day]?.[meal]?.toString() || ""}
              onChangeText={(text) => handleInputChange(day, meal, text)}
            />
          </View>
        ))}
        <Text style={styles.dailyTotalText}>Total: {dailyTotal} kcal</Text>
      </View>
    );
  };

  useEffect(() => {
    fetchCalorieData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: height * 0.5, textAlign: "center" }}>
          Loading Calorie Tracker...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Calorie Tracker</Text>
      </View>

      <View style={styles.clearButtonContainer}>
        <TouchableOpacity onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {week.map(renderDayBox)}

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={calculateTotalCalories}
        >
          <Text style={styles.calculateButtonText}>
            Calculate Total Calories
          </Text>
        </TouchableOpacity>

        {totalCalories !== null && (
          <View style={styles.totalCaloriesContainer}>
            <Text style={styles.totalCaloriesText}>
              Total Weekly Calories: {totalCalories}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  clearButtonContainer: {
    alignItems: "flex-end",
    marginTop: height * 0.01,
    marginRight: width * 0.04,
    marginBottom: height * 0.01,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#eb11ee",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  scrollArea: {
    paddingHorizontal: width * 0.025,
    paddingBottom: height * 0.1,
  },
  dayBox: {
    padding: width * 0.04,
    borderRadius: 10,
    marginBottom: height * 0.015,
    backgroundColor: "#f5f5f5",
  },
  dayLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.015,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.01,
  },
  mealText: {
    fontSize: 16,
    color: "#444",
    width: "40%",
  },
  inputBox: {
    width: "55%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: width * 0.025,
    backgroundColor: "#fff",
  },
  dailyTotalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    textAlign: "right",
    marginTop: height * 0.01,
  },
  calculateButton: {
    marginTop: height * 0.02,
    backgroundColor: "#eb11ee",
    padding: height * 0.02,
    borderRadius: 10,
    alignItems: "center",
  },
  calculateButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  totalCaloriesContainer: {
    marginTop: height * 0.02,
    paddingBottom: height * 0.04,
    alignItems: "center",
  },
  totalCaloriesText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default CalorieTracker;
