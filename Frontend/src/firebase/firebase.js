// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQdEEqolVcu24yAAd4ay-NEKYm8jVRf04",
  authDomain: "college-40d9d.firebaseapp.com",
  projectId: "college-40d9d",
  storageBucket: "college-40d9d.firebasestorage.app",
  messagingSenderId: "742112503207",
  appId: "1:742112503207:web:a1fa25c7295212fab94282",
  measurementId: "G-85SFB7FKX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { app, auth, analytics };