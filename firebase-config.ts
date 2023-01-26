// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv9Ob9k25_mF9G44HWcTLRxlAEtHLr-k8",
  authDomain: "chatting-app-5948.firebaseapp.com",
  projectId: "chatting-app-5948",
  storageBucket: "chatting-app-5948.appspot.com",
  messagingSenderId: "951563698636",
  appId: "1:951563698636:web:d17efa90c320f6f982dd69",
  measurementId: "G-WLWS1SN81G",
  databaseURL:
    "https://chatting-app-5948-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore();
export const realtimeDatabase = getDatabase();
export const auth = getAuth();
