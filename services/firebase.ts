import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5hFmiqJPaKnUUxXQspzpFfIbFtHwm_c8",
  authDomain: "yebda-auto-ecole.firebaseapp.com",
  projectId: "yebda-auto-ecole",
  storageBucket: "yebda-auto-ecole.firebasestorage.app",
  messagingSenderId: "497595697311",
  appId: "1:497595697311:web:14c347348ac2b6c30d3aaa",
  measurementId: "G-QKD4YLKW9K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
