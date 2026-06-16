import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB65JNCUDNt9Jlcz-mQdDRmdXMDpQuwvpI",
  authDomain: "kayluxury-21c1f.firebaseapp.com",
  projectId: "kayluxury-21c1f",
  storageBucket: "kayluxury-21c1f.firebasestorage.app",
  messagingSenderId: "913501331517",
  appId: "1:913501331517:web:5826b3e588b10018fe8a54",
  measurementId: "G-YG95QMN7KW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
