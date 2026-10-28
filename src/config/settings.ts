/**
 * Application Settings for Mana Inti Pickles
 * Central business configuration.
 */
export const STORE_SETTINGS = {
  brandName: 'Mana Inti Pickles',
  tagline: 'Inti Ruchi, Prathi Mudda Lo',
  currencySymbol: '₹',
  
  // Business WhatsApp phone number: 9014992914 with India country code 91
  whatsappNumber: '918688781151',
  displayPhoneNumber: '+91 9014992914',
  
  supportEmail: 'orders@manaintipickles.com',
  workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
  location: 'Andhra Pradesh & Telangana, India',
  
  // Set to true to force sample demonstration data from src/data/products.ts
  // Set to false to prioritize live Firestore data when Firebase is configured
  useDemoData: false,
  
  // Display notice indicating sample storefront values
  isDemoStore: true,
};

/**
 * Firebase Web Configuration
 * Values can be provided via Vite environment variables (.env / Secrets)
 * or entered directly below when ready.
 * 
 * NOTE: These are client-side public identifiers required to connect to your project.
 * If these values are empty, the application will automatically and gracefully
 * fall back to the local sample product data in src/data/products.ts.
 */
export const FIREBASE_CONFIG = {
  apiKey:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) ||
    'AIzaSyBy4LTB1bYjx7Pxq5P9TiOnxSqH2opCUeY',
  authDomain:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) ||
    'mana-inti-pickles.firebaseapp.com',
  projectId:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) ||
    'mana-inti-pickles',
  storageBucket:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) ||
    'mana-inti-pickles.firebasestorage.app',
  messagingSenderId:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) ||
    '795128976148',
  appId:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) ||
    '1:795128976148:web:9ab095f466a68469492801',
};

