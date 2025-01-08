import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzfca6MdWGAH9aaNBSCHm0jJ42rDURcPw",
  authDomain: "my-web-apps-19f87.firebaseapp.com",
  projectId: "my-web-apps-19f87",
  storageBucket: "my-web-apps-19f87.firebasestorage.app",
  messagingSenderId: "45583342919",
  appId: "1:45583342919:web:95e7fcbdcf6d3564af4062",
  measurementId: "G-M53C79ESGR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
