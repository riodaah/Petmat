import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasFirebaseClientConfig = Object.values(firebaseConfig).every(Boolean);
const firebaseApp = hasFirebaseClientConfig ? initializeApp(firebaseConfig) : null;

if (!hasFirebaseClientConfig) {
  console.warn('⚠️ Firebase Client no configurado en VITE_FIREBASE_*');
}

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = firebaseApp ? new GoogleAuthProvider() : null;
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null;
export { hasFirebaseClientConfig };

export const ALLOWED_ADMIN_EMAIL = 'da.morande@gmail.com';
