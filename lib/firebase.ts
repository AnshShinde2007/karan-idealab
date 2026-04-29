import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAjH_qe7FG-2oLZ8Flf6X1QQeLZCPIWh0U",
  authDomain: "sky-relief.firebaseapp.com",
  projectId: "sky-relief",
  storageBucket: "sky-relief.firebasestorage.app",
  messagingSenderId: "96320406128",
  appId: "1:96320406128:web:5d0e0f528b25895a9aeab5",
  measurementId: "G-D29MMBRQWD"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics only on the client side
let analytics;
if (typeof window !== "undefined") {
  // isSupported().then((supported) => {
  //   if (supported) {
  //     try {
  //       analytics = getAnalytics(app);
  //     } catch (e) {
  //       console.warn("Analytics failed to initialize", e);
  //     }
  //   }
  // });
}

export { app, db, analytics };
