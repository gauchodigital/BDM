import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Config web pública (mismo enfoque que VSR: va en el cliente).
 * Las env NEXT_PUBLIC_FIREBASE_* pueden override si existen.
 */
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAQ_s-JpgJmyenZoe-F5bl1Z9CVePZcr1M",
  authDomain: "venueapp---production-20d0c.firebaseapp.com",
  projectId: "venueapp---production-20d0c",
  storageBucket: "venueapp---production-20d0c.firebasestorage.app",
  messagingSenderId: "277764872800",
  appId: "1:277764872800:web:52121f6ddaae2b86e94105",
};

const config = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
    DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ||
    DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
    DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ||
    DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ||
    DEFAULT_FIREBASE_CONFIG.appId,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.appId,
  );
}

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(config);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  return a ? getAuth(a) : null;
}

export function getFirebaseDb(): Firestore | null {
  const a = getFirebaseApp();
  return a ? getFirestore(a) : null;
}
