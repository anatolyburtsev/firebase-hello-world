// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBduX4VgdqsPHeYs-lQKgat2aZATe7ZGco",
  authDomain: "helloworld-7213e.firebaseapp.com",
  projectId: "helloworld-7213e",
  storageBucket: "helloworld-7213e.appspot.com",
  messagingSenderId: "764318018857",
  appId: "1:764318018857:web:9e38cca2ae8cd7317d9b38",
  measurementId: "G-7DGB1MCLNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

