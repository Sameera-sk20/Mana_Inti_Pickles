import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore, isFirebaseConfigured } from '../lib/firebase';
import { STORE_SETTINGS } from '../config/settings';
import { SAMPLE_PRODUCTS } from '../data/products';
import { Product, ProductCategory, DietaryType, SpiceLevel, PickleWeight } from '../types/product';

export interface ProductsResponse {
  products: Product[];
  isFromFirestore: boolean;
  isEmpty: boolean;
  error?: string;
}

export type ProductInput = Omit<Product, 'id' | 'isSampleData'>;

/**
 * Intelligent helper to merge Firestore products with the full 18-product base catalog.
 * ROOT CAUSE FIX:
 * Previously, when Firestore contained 1 or 2 products (e.g., when the owner edited one
 * product or marked it Out of Stock), getProductsFromFirestore returned ONLY those 1 or 2
 * documents, causing all other 16-17 pickles and snacks to vanish from the site.
 *
 * This merger ensures:
 * 1. All products across Veg Pickles, Non-Veg Pickles, and Snacks are ALWAYS displayed.
 * 2. Any modifications made by the owner in Firestore (e.g. Out of Stock, custom prices,
 *    uploaded camera photos) override the matching product.
 * 3. Any brand new products added by the owner are appended seamlessly.
 * 4. Marking ONE product out-of-stock affects ONLY that product; all other products stay visible.
 */
export function mergeProductsWithFirestore(firestoreProducts: Product[]): Product[] {
  const usedFirestoreIds = new Set<string>();

  const merged: Product[] = SAMPLE_PRODUCTS.map((sample) => {
    // 1. Direct ID match
    const directMatch = firestoreProducts.find((fp) => fp.id === sample.id);
    if (directMatch) {
      usedFirestoreIds.add(directMatch.id);
      return {
        ...sample,
        ...directMatch,
        isSampleData: false,
      };
    }

    // 2. Keyword & name matching to link Firestore documents to their base sample product
    const nameMatch = firestoreProducts.find((fp) => {
      if (usedFirestoreIds.has(fp.id)) return false;
      const fn = fp.name.toLowerCase().trim().replace(/[-_]/g, ' ');
      const sn = sample.name.toLowerCase().trim().replace(/[-_]/g, ' ');
      const sid = sample.id.toLowerCase().replace(/[-_]/g, ' ');

      if (fn === sn || fn === sid) return true;

      // Safe domain-specific keyword associations
      if (sid.includes('mango') && (fn.includes('mango') || fn.includes('avakaya'))) return true;
      if (sid.includes('mirapakaya') && (fn.includes('mirapakaya') || fn.includes('chilli'))) return true;
      if (sid === 'gongura-pickle' && fn.includes('gongura') && !fn.includes('chicken')) return true;
      if (sid.includes('lemon') && (fn.includes('lemon') || fn.includes('nimma'))) return true;
      if (sid.includes('tomato') && (fn.includes('tomato') || fn.includes('tamata'))) return true;
      if (sid.includes('mixed-veg') && (fn.includes('mixed') || fn.includes('veggie') || fn.includes('vegetable'))) return true;
      if (sid === 'mutton-pickle' && fn.includes('mutton') && !fn.includes('bone')) return true;
      if (sid.includes('mutton-bone') && fn.includes('mutton') && fn.includes('bone')) return true;
      if (sid.includes('fish') && fn.includes('fish')) return true;
      if (sid.includes('crab') && fn.includes('crab')) return true;
      if (sid.includes('boneless-chicken') && fn.includes('chicken') && fn.includes('boneless')) return true;
      if (sid.includes('chicken-keema') && (fn.includes('keema') || fn.includes('kheema'))) return true;
      if (sid.includes('gongura-chicken') && fn.includes('gongura') && fn.includes('chicken')) return true;
      if (sid.includes('chegodilu') && fn.includes('chegodilu')) return true;
      if (sid.includes('pappu-chekkalu') && (fn.includes('pappu') || fn.includes('chekkalu')) && !fn.includes('beetroot')) return true;
      if (sid === 'chakralu' && fn.includes('chakralu') && !fn.includes('beetroot')) return true;
      if (sid.includes('beetroot-chekkalu') && fn.includes('beetroot') && fn.includes('chekkalu')) return true;
      if (sid.includes('beetroot-chakralu') && fn.includes('beetroot') && fn.includes('chakralu')) return true;

      return false;
    });

    if (nameMatch) {
      usedFirestoreIds.add(nameMatch.id);
      return {
        ...sample,
        ...nameMatch,
        // Preserve the Firestore document ID so future updates target this document directly
        id: nameMatch.id,
        isSampleData: false,
      };
    }

    return sample;
  });

  // 3. Brand new custom products added in Firestore that do not map to any base item
  const customProducts = firestoreProducts.filter((fp) => !usedFirestoreIds.has(fp.id));

  return [...merged, ...customProducts];
}

/**
 * Loads products from Firebase Firestore using getDocs().
 * Returns the full merged catalog preserving all products and custom stock/price updates.
 */
export async function getProductsFromFirestore(): Promise<ProductsResponse> {
  // If user explicitly enabled offline demo data mode in settings
  if (STORE_SETTINGS.useDemoData) {
    return {
      products: SAMPLE_PRODUCTS,
      isFromFirestore: false,
      isEmpty: false,
    };
  }

  if (!isFirebaseConfigured()) {
    return {
      products: SAMPLE_PRODUCTS,
      isFromFirestore: false,
      isEmpty: false,
      error: 'Firebase is not yet configured. Please check your Firebase settings in settings.ts.',
    };
  }

  const db = getFirebaseFirestore();
  if (!db) {
    return {
      products: SAMPLE_PRODUCTS,
      isFromFirestore: false,
      isEmpty: false,
      error: 'Could not initialize Cloud Firestore instance.',
    };
  }

  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      // If collection is empty, return base products with flag
      return {
        products: SAMPLE_PRODUCTS,
        isFromFirestore: true,
        isEmpty: true,
      };
    }

    const firestoreProducts: Product[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || 'Unnamed Pickle',
        regionalName: data.regionalName || '',
        category: (data.category as ProductCategory) || 'veg-pickles',
        dietaryType: (data.dietaryType as DietaryType) || 'veg',
        shortDescription: data.shortDescription || '',
        detailedDescription: data.detailedDescription || '',
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        imageUrl: data.imageUrl || '',
        pricing: (data.pricing as Record<PickleWeight, number>) || {
          '250g': 150,
          '500g': 300,
          '1kg': 580,
        },
        isAvailable: typeof data.isAvailable === 'boolean' ? data.isAvailable : true,
        spiceLevel: (data.spiceLevel as SpiceLevel) || 'Medium',
        highlightNote: data.highlightNote || undefined,
        isSampleData: false,
      };
    });

    // Merge with full catalog so no products are ever hidden when one is edited or marked out of stock
    const mergedProducts = mergeProductsWithFirestore(firestoreProducts);

    return {
      products: mergedProducts,
      isFromFirestore: true,
      isEmpty: false,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch products from Firestore';
    console.error('Firestore getDocs error:', error);
    return {
      products: SAMPLE_PRODUCTS,
      isFromFirestore: false,
      isEmpty: false,
      error: errorMsg,
    };
  }
}

/**
 * Backward compatibility alias for existing code
 */
export const loadProducts = getProductsFromFirestore;

/**
 * Adds a new product to Cloud Firestore using addDoc().
 */
export async function addProductToFirestore(product: ProductInput): Promise<{ id: string }> {
  const db = getFirebaseFirestore();
  if (!db) {
    throw new Error('Firestore is not initialized. Check your Firebase credentials.');
  }

  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id };
}

/**
 * Saves or updates a product in Cloud Firestore using setDoc with merge: true.
 * Works seamlessly whether the product already has a Firestore document or is an initial
 * catalog item being saved to Firestore for the first time.
 */
export async function saveProductToFirestore(
  id: string,
  product: ProductInput
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const docRef = doc(db, 'products', id);
  await setDoc(
    docRef,
    {
      ...product,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Updates an existing product in Cloud Firestore using updateDoc().
 */
export async function updateProductInFirestore(
  id: string,
  updates: Partial<ProductInput>
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const docRef = doc(db, 'products', id);
  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Quick toggle for product stock status in Cloud Firestore.
 * Updates ONLY this specific product without affecting any other products.
 */
export async function toggleProductStockStatus(
  id: string,
  isAvailable: boolean
): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const docRef = doc(db, 'products', id);
  await setDoc(
    docRef,
    {
      isAvailable,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Deletes a product from Cloud Firestore using deleteDoc().
 */
export async function deleteProductFromFirestore(id: string): Promise<void> {
  const db = getFirebaseFirestore();
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}

/**
 * Seeds the initial 18 Mana Inti authentic products into Cloud Firestore.
 */
export async function seedSampleProductsToFirestore(): Promise<{ seededCount: number }> {
  const db = getFirebaseFirestore();
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  let count = 0;
  for (const sample of SAMPLE_PRODUCTS) {
    const { isSampleData: _, ...productData } = sample;
    const docRef = doc(db, 'products', sample.id);
    await setDoc(
      docRef,
      {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    count++;
  }

  return { seededCount: count };
}

/**
 * Diagnostic helper to test connection to Firestore and read products collection.
 */
export async function testFirestoreConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  docCount: number;
  message: string;
}> {
  if (!isFirebaseConfigured()) {
    return {
      configured: false,
      connected: false,
      docCount: 0,
      message: 'Firebase configuration values are missing in settings or environment.',
    };
  }

  const db = getFirebaseFirestore();
  if (!db) {
    return {
      configured: true,
      connected: false,
      docCount: 0,
      message: 'Failed to initialize Firestore instance.',
    };
  }

  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return {
      configured: true,
      connected: true,
      docCount: snapshot.size,
      message: snapshot.empty
        ? 'Connected to Firestore successfully! Note: The "products" collection is currently empty.'
        : `Connected to Firestore successfully! Found ${snapshot.size} product documents.`,
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      docCount: 0,
      message: error instanceof Error ? error.message : 'Unknown Firestore error occurred.',
    };
  }
}
