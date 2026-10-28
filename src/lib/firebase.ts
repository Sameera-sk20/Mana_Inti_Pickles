import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { FIREBASE_CONFIG } from '../config/settings';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let firebaseStorage: FirebaseStorage | null = null;

/**
 * Checks whether valid Firebase credentials have been supplied in settings or environment.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.apiKey.trim().length > 5 &&
    !FIREBASE_CONFIG.apiKey.includes('YOUR_')
  );
}

/**
 * Returns or initializes the FirebaseApp instance.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (firebaseApp) return firebaseApp;
  if (!isFirebaseConfigured()) return null;

  try {
    firebaseApp = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();
    return firebaseApp;
  } catch (error) {
    console.warn('Firebase initialization error:', error);
    return null;
  }
}

/**
 * Initializes and returns the Firestore instance, or null if unconfigured.
 */
export function getFirebaseFirestore(): Firestore | null {
  if (firestoreDb) return firestoreDb;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    firestoreDb = getFirestore(app);
    return firestoreDb;
  } catch (error) {
    console.warn('Firestore initialization error:', error);
    return null;
  }
}

/**
 * Initializes and returns the Firebase Auth instance, or null if unconfigured.
 */
export function getFirebaseAuth(): Auth | null {
  if (firebaseAuth) return firebaseAuth;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    firebaseAuth = getAuth(app);
    return firebaseAuth;
  } catch (error) {
    console.warn('Firebase Auth initialization error:', error);
    return null;
  }
}

/**
 * Initializes and returns the Firebase Storage instance, or null if unconfigured.
 */
export function getFirebaseStorage(): FirebaseStorage | null {
  if (firebaseStorage) return firebaseStorage;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    firebaseStorage = getStorage(app);
    return firebaseStorage;
  } catch (error) {
    console.warn('Firebase Storage initialization error:', error);
    return null;
  }
}

export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirebaseFirestore();
export const auth = getFirebaseAuth();
export const storage = getFirebaseStorage();

