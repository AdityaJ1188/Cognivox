import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database"; // use compat version here!

const app = firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL // make sure this is in .env
});

// Auth and Realtime DB from compat SDK
export const auth = app.auth();
export const database = app.database(); // 👈 this works now

export default app;
