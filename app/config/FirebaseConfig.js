// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbF_kdkbOn7n5DuA1GxFkp_ozd_0XU8EU",
  authDomain: "byte-bites-83d89.firebaseapp.com",
  projectId: "byte-bites-83d89",
  storageBucket: "byte-bites-83d89.firebasestorage.app",
  messagingSenderId: "561023147661",
  appId: "1:561023147661:web:945a4c046b547d59cbccc4",
  measurementId: "G-76QGGJ3738"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };