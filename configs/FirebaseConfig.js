import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"; // To persist authentication state

const firebaseConfig = {
  apiKey: "AIzaSyB0AuM-87Jw0BgsGVEcId0JmJrbiMw1meQ",
  authDomain: "tripmate-mobile.firebaseapp.com",
  projectId: "tripmate-mobile",
  storageBucket: "tripmate-mobile.firebasestorage.app",
  messagingSenderId: "2068682933",
  appId: "1:2068682933:web:bb7ada677f33494a7c86fc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase Auth with persistence using AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Firestore initialization
export const db = getFirestore(app);
