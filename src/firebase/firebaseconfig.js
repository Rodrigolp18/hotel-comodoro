// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPpRkl6_i809jBxBIFbkx0RXSU6BrNUFI",
  authDomain: "hotel-comodoro.firebaseapp.com",
  projectId: "hotel-comodoro",
  storageBucket: "hotel-comodoro.firebasestorage.app",
  messagingSenderId: "729868031904",
  appId: "1:729868031904:web:268d2b40b40c65f2f7f6c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
