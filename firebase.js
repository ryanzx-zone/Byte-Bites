import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC99aUAfc9r_4K3HnUVLlxAiRU-H9SBvzM",
  authDomain: "byte-bites-835b6.firebaseapp.com",
  projectId: "byte-bites-835b6",
  storageBucket: "byte-bites-835b6.appspot.com",
  messagingSenderId: "12430000954",
  appId: "1:12430000954:web:8791e13b98cbaa4d40c603",
  measurementId: "G-G60X18QHTL"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);