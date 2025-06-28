import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, SafeAreaView, Platform} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Mywelcomescreen from './app/screens/Mywelcomescreen';
import MyViewImageScreen from './app/screens/MyViewImageScreen';
import Timerscreen from './app/screens/Timerscreen';
import Snapsharescreen from './app/screens/Snapsharescreen';
import CameraScreen from './app/screens/CameraScreen';
import GalleryScreen from './app/screens/GalleryScreen';
import PRecipeSearch from './app/screens/PRecipeSearch';
import RecipeDetailScreen from './app/screens/RecipeDetailScreen';
import PLoginScreen from './app/screens/PLoginScreen';
import { app } from './app/config/FirebaseConfig';
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

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={PLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hello"
          component={Mywelcomescreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={MyViewImageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecipeSearch"
          component={PRecipeSearch}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RecipeDetail" 
          component={RecipeDetailScreen} 
          options={{ headerShown: false }}
          />
        <Stack.Screen
          name="Timer"
          component={Timerscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Snapshare"
          component={Snapsharescreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
