// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlGpUSCINE-biEWThQN_INqR5iK1bq0yk",
  authDomain: "crams-5170e.firebaseapp.com",
  projectId: "crams-5170e",
  storageBucket: "crams-5170e.firebasestorage.app",
  messagingSenderId: "1039012613653",
  appId: "1:1039012613653:web:2595ae9043ca6a9705481c",
  measurementId: "G-J30G3EX8Z2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

