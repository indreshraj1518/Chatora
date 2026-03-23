import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔥 tera config
const firebaseConfig = {
  apiKey: "AIzaSyCamjH8bIAMTt2BHmpR8vx4VUTE-usiEzU",
  authDomain: "chatora-24ae6.firebaseapp.com",
  projectId: "chatora-24ae6",
  storageBucket: "chatora-24ae6.firebasestorage.app",
  messagingSenderId: "524951195563",
  appId: "1:524951195563:web:fde1202f670fac049c0cee",
  measurementId: "G-6QWDRN8YJ4"
};

// 🔥 init
const app = initializeApp(firebaseConfig);

// 🔐 auth (OTP के लिए)
export const auth = getAuth(app);