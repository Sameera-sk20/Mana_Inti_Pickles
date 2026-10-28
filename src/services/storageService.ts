import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage, auth } from '../lib/firebase';
import { STORE_SETTINGS } from '../config/settings';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Uploads a product image (captured via Camera or chosen from Gallery)
 * to Firebase Cloud Storage under `products/`.
 */
export async function uploadProductImage(
  file: File,
  productIdPrefix: string = 'product'
): Promise<UploadResult> {
  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error(
      'Firebase Storage is not initialized. Please ensure Firebase is configured in your project settings.'
    );
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file must be an image (JPEG, PNG, WEBP, etc.).');
  }

  // Validate size (max 10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('Image size exceeds 10MB. Please select a smaller photo or compress it.');
  }

  // Check auth state
  if (!auth?.currentUser) {
    throw new Error(
      'Authentication required: You must be signed in as Owner/Admin to upload photos to Firebase Storage.'
    );
  }

  // Clean filename and create unique storage path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const filePath = `products/${productIdPrefix}_${timestamp}_${sanitizedName}`;

  try {
    const storageRef = ref(storage, filePath);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: auth.currentUser.email || auth.currentUser.uid,
        uploadedAt: new Date().toISOString(),
        store: STORE_SETTINGS.brandName,
      },
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      url: downloadUrl,
      path: filePath,
    };
  } catch (err: unknown) {
    console.error('Firebase Storage upload error:', err);
    const errorMsg = err instanceof Error ? err.message : String(err);

    if (
      errorMsg.includes('unauthorized') ||
      errorMsg.includes('permission') ||
      errorMsg.includes('storage/unauthorized')
    ) {
      throw new Error(
        'Permission Denied in Firebase Storage: Please ensure your Firebase Storage rules allow authenticated admins to upload (allow write: if request.auth != null;).'
      );
    }

    if (
      errorMsg.includes('bucket-not-found') ||
      errorMsg.includes('storage/bucket-not-found') ||
      errorMsg.includes('not exist') ||
      errorMsg.includes('404')
    ) {
      throw new Error(
        'Firebase Storage Bucket Not Found: Please open the Firebase Console (https://console.firebase.google.com/) for project "mana-inti-pickles", navigate to Build > Storage, and click "Get Started" to activate Cloud Storage.'
      );
    }

    throw new Error(`Failed to upload photo to Firebase Storage: ${errorMsg}`);
  }
}
