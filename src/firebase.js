// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCETE-swqQsQYIjdj8G_2yJcykJNbH4Dsk",
  authDomain: "ecoshopy-71e7c.firebaseapp.com",
  projectId: "ecoshopy-71e7c",
  storageBucket: "ecoshopy-71e7c.firebasestorage.app",
  messagingSenderId: "467132560340",
  appId: "1:467132560340:web:832af7d3594e6db5ef1c41",
  measurementId: "G-B6EX7QF1RR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
