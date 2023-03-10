import admin from "firebase-admin";
import { getApps as adminGetApps } from "firebase-admin/app";
var serviceAccount = require("/Chat-app/chatting-app-5948-firebase-adminsdk-aepta-ceb308a6f7.json");

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

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

if (!(getApps().length > 0)) {
  initializeApp(firebaseConfig);
}

if (!(adminGetApps().length > 0)) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://chatting-app-5948-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

export const firestore = getFirestore();
export const realtimeDatabase = getDatabase();
export const cmmAuth = getAuth();
export const storage = getStorage();

export default admin;
export const auth = admin.auth();
export const database = admin.database();
