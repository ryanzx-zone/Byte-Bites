import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Mywelcomescreen from './Mywelcomescreen';
import Homescreen from './Homescreen';
import RecipeDetailScreen from './RecipeDetailScreen';
import { app } from './firebase';
import { getAuth } from 'firebase/auth';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    try {
      const auth = getAuth(app);
      const unsubscribe = auth.onAuthStateChanged(() => {
        setIsFirebaseReady(true);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setIsFirebaseReady(true);
    }
  }, []);

  if (!isFirebaseReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Mywelcomescreen} />
          <Stack.Screen name="Home" component={Homescreen} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}