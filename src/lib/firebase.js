// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZQeiddGf7xRdODmDGMrm6l9LmrC3sh-s",
  authDomain: "rallytyper-64b60.firebaseapp.com",
  projectId: "rallytyper-64b60",
  storageBucket: "rallytyper-64b60.firebasestorage.app",
  messagingSenderId: "1072372633580",
  appId: "1:1072372633580:web:dc8453392d775efb9d3ac9",
  measurementId: "G-GFLB78DFX1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export services so they can be used in other files
export { db };
