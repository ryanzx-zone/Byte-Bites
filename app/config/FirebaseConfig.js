import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCbF_kdkbOn7n5DuA1GxFkp_ozd_0XU8EU",
  authDomain: "byte-bites-83d89.firebaseapp.com",
  projectId: "byte-bites-83d89",
  storageBucket: "byte-bites-83d89.appspot.com",
  messagingSenderId: "561023147661",
  appId: "1:561023147661:web:945a4c046b547d59cbccc4",
  measurementId: "G-76QGGJ3738"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
