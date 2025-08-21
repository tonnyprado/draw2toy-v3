// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAjp5Ek6btPy5NdUxJZaPiaJKa_OOCfsY",
  authDomain: "draw2toy-92b00.firebaseapp.com",
  projectId: "draw2toy-92b00",
  storageBucket: "draw2toy-92b00.firebasestorage.app",
  messagingSenderId: "433133000389",
  appId: "1:433133000389:web:4fcd67cb356a5ff8bb42ac",
  measurementId: "G-FQP1WNGK9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
export const storage = getStorage(app);