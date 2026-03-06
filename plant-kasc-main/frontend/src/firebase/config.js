// Firebase Configuration & Initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBk9ga9M5v4GMVNJS2xqAM_rPKMDnV-rVs",
    authDomain: "plant-disease-kasc.firebaseapp.com",
    projectId: "plant-disease-kasc",
    storageBucket: "plant-disease-kasc.firebasestorage.app",
    messagingSenderId: "895879183566",
    appId: "1:895879183566:web:312b8f221d848ea1b7e49f"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}
export { analytics };

export default app;
