import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase project configuration provided by the user
export const firebaseConfig = {
  apiKey: "AIzaSyCgQm1fjesC93QHYNWxM5Zw8JrUFE_Y768",
  authDomain: "pm-dapper-8ba88.firebaseapp.com",
  projectId: "pm-dapper-8ba88",
  storageBucket: "pm-dapper-8ba88.firebasestorage.app",
  messagingSenderId: "799590049902",
  appId: "1:799590049902:web:c441e89d33de2afd609e7f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
