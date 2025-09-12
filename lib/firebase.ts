// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8d2gALUeT7TIIQCDN4WJe47wwRuzEWHo",
  authDomain: "lecielnew.firebaseapp.com",
  projectId: "lecielnew",
  storageBucket: "lecielnew.firebasestorage.app",
  messagingSenderId: "684192350714",
  appId: "1:684192350714:web:113f24c8c543617527e443",
  measurementId: "G-JKLTDZY5MH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
