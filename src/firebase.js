import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgNA9903RaBxK477Glho7o41AsOI6Giyk",
  authDomain: "chat-app-360be.firebaseapp.com",
  projectId: "chat-app-360be",
  storageBucket: "chat-app-360be.appspot.com",
  messagingSenderId: "102454176792",
  appId: "1:102454176792:web:27e0597e99207ab323276d",
  measurementId: "G-F28P0X36DK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth}