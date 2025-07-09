import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM9C_A0Uf4zx4YtgcCIiHv8GZfmT9Whcg",
  authDomain: "iedc-sahrdaya.firebaseapp.com",
  projectId: "iedc-sahrdaya",
  storageBucket: "iedc-sahrdaya.firebasestorage.app",
  messagingSenderId: "711834182322",
  appId: "1:711834182322:web:c8eea2ecda59354f139fab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);