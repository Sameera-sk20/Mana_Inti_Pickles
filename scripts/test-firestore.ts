import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBy4LTB1bYjx7Pxq5P9TiOnxSqH2opCUeY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'mana-inti-pickles.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'mana-inti-pickles',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'mana-inti-pickles.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '795128976148',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:795128976148:web:9ab095f466a68469492801',
};

async function runTest() {
  console.log('Testing connection to Firebase project:', firebaseConfig.projectId);
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);
    console.log('Firestore initialized successfully.');

    console.log('Querying collection "products"...');
    const snapshot = await getDocs(collection(db, 'products'));
    console.log('CONNECTION_SUCCESS: Connected to Cloud Firestore!');
    console.log('DOCUMENT_COUNT:', snapshot.size);

    if (snapshot.empty) {
      console.log('PRODUCTS_COLLECTION_STATUS: Empty (no documents found in "products" collection).');
    } else {
      console.log('PRODUCTS_COLLECTION_STATUS: Found documents:');
      snapshot.forEach((doc) => {
        console.log(` - Document ID: ${doc.id}, Name: ${doc.data().name || '(no name field)'}`);
      });
    }
    process.exit(0);
  } catch (error: any) {
    console.error('CONNECTION_FAILED:', error.message || error);
    process.exit(1);
  }
}

runTest();
