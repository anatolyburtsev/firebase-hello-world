// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "legalqa-777ce.firebaseapp.com",
  projectId: "legalqa-777ce",
  storageBucket: "legalqa-777ce.appspot.com",
  messagingSenderId: "989150083224",
  appId: "1:989150083224:web:7ff8a85dee5c924acb38ed",
  measurementId: "G-10JJ5MQP3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

