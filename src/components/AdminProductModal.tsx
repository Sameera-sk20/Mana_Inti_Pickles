import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory, DietaryType, SpiceLevel, PickleWeight } from '../types/product';
import {
  ProductInput,
  addProductToFirestore,
  saveProductToFirestore,
} from '../services/productService';
import { uploadProductImage } from '../services/storageService';
import { STORE_SETTINGS } from '../config/settings';
import {
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  Flame,
  UploadCloud,
  Trash2,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onProductSaved: () => void;
}

// Preset authentic photos available in project assets
const PRESET_IMAGES = [
  { label: 'Avakaya Mango Pickle', path: '/src/assets/images/pickle_mango_avakaya_1793172291198.jpg' },
  { label: 'Pandu Mirapakaya Red Chilli', path: '/src/assets/images/pickle_red_chilli_1793172292271.jpg' },
  { label: 'Andhra Gongura Pickle', path: '/src/assets/images/pickle_andhra_gongura_1793172292859.jpg' },
  { label: 'Lemon Pickle (Nimma)', path: '/src/assets/images/pickle_lemon_nimma_1793172292897.jpg' },
  { label: 'Tomato Pickle', path: '/src/assets/images/pickle_tomato_tamata_1793172307574.jpg' },
  { label: 'Mixed Vegetable Pickle', path: '/src/assets/images/pickle_mixed_veggie_1793172308770.jpg' },
  { label: 'Mutton Pickle', path: '/src/assets/images/pickle_mutton_1793173075352.jpg' },
  { label: 'Boneless Chicken Pickle', path: '/src/assets/images/pickle_boneless_chicken_1793173074637.jpg' },
  { label: 'Fish Pickle', path: '/src/assets/images/pickle_fish_1793173076292.jpg' },
  { label: 'Crab Pickle', path: '/src/assets/images/pickle_crab_1793173076335.jpg' },
  { label: 'Chicken Keema Pickle', path: '/src/assets/images/pickle_chicken_keema_1793173117478.jpg' },
  { label: 'Gongura Chicken Pickle', path: '/src/assets/images/pickle_gongura_chicken_1793173077655.jpg' },
  { label: 'Crispy Chegodilu', path: '/src/assets/images/snack_chegodilu_1793173096907.jpg' },
  { label: 'Pappu Chekkalu', path: '/src/assets/images/snack_pappu_chekkalu_1793173097157.jpg' },
  { label: 'Murukku / Chakralu', path: '/src/assets/images/snack_chakralu_1793173097423.jpg' },
  { label: 'Beetroot Chekkalu', path: '/src/assets/images/snack_beetroot_chekkalu_1793173097654.jpg' },
  { label: 'Beetroot Chakralu', path: '/src/assets/images/snack_beetroot_chakralu_1793173116405.jpg' },
  { label: 'Hero Pickle Ceramic Jaadi', path: '/src/assets/images/hero_pickle_jaadi_1793172291402.jpg' },
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onProductSaved,
}) => {
  const [name, setName] = useState('');
  const [regionalName, setRegionalName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('veg-pickles');
  const [dietaryType, setDietaryType] = useState<DietaryType>('veg');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Medium');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [highlightNote, setHighlightNote] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Jar Weight Pricing
  const [price250g, setPrice250g] = useState<number>(160);
  const [price500g, setPrice500g] = useState<number>(310);
  const [price1kg, setPrice1kg] = useState<number>(590);

  // Photo / Camera State
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].path);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Status & Progress
  const [saving, setSaving] = useState(false);
  const [savingStep, setSavingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hidden Input Refs for Camera and Gallery
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setRegionalName(productToEdit.regionalName || '');
      setCategory(productToEdit.category);
      setDietaryType(productToEdit.dietaryType);
      setSpiceLevel(productToEdit.spiceLevel || 'Medium');
      setShortDescription(productToEdit.shortDescription);
      setDetailedDescription(productToEdit.detailedDescription);
      setIngredientsText(productToEdit.ingredients.join(', '));
      setHighlightNote(productToEdit.highlightNote || '');
      setImageUrl(productToEdit.imageUrl);
      setIsAvailable(productToEdit.isAvailable);
      setPrice250g(productToEdit.pricing['250g'] || 160);
      setPrice500g(productToEdit.pricing['500g'] || 310);
      setPrice1kg(productToEdit.pricing['1kg'] || 590);
      setSelectedFile(null);
      setPreviewBlobUrl(null);
      setShowPresetPicker(false);
    } else {
      setName('');
      setRegionalName('');
      setCategory('veg-pickles');
      setDietaryType('veg');
      setSpiceLevel('Medium');
      setShortDescription('');
      setDetailedDescription('');
      setIngredientsText('Handpicked ingredients, cold-pressed sesame oil, mustard, fenugreek, sea salt');
      setHighlightNote('Generational Andhra recipe, aged naturally in ceramic jaadi');
      setImageUrl(PRESET_IMAGES[0].path);
      setIsAvailable(true);
      setPrice250g(160);
      setPrice500g(310);
      setPrice1kg(590);
      setSelectedFile(null);
      setPreviewBlobUrl(null);
      setShowPresetPicker(false);
    }
    setError(null);
    setSuccess(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    if (newCat === 'non-veg-pickles') {
      setDietaryType('non-veg');
      if (!productToEdit) {
        setPrice250g(340);
        setPrice500g(650);
        setPrice1kg(1250);
      }
    } else if (newCat === 'veg-pickles') {
      setDietaryType('veg');
      if (!productToEdit) {
        setPrice250g(160);
        setPrice500g(310);
        setPrice1kg(590);
      }
    } else if (newCat === 'snacks') {
      if (!productToEdit) {
        setPrice250g(120);
        setPrice500g(230);
        setPrice1kg(440);
      }
    }
  };

  // Handle Photo selection from Camera or Gallery
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Selected image exceeds 10MB limit. Please choose a smaller file.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewBlobUrl(objectUrl);
    setError(null);
  };

  const handleRemovePhoto = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }
    setSelectedFile(null);
    setPreviewBlobUrl(null);
    // Reset to first preset image as clean fallback
    setImageUrl(PRESET_IMAGES[0].path);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!shortDescription.trim()) {
      setError('Short description is required.');
      return;
    }

    const effectiveImageUrl = previewBlobUrl || imageUrl;
    if (!effectiveImageUrl && !selectedFile) {
      setError('Product image is required. Please capture a photo, upload an image, or pick a preset.');
      return;
    }

    const ingredients = ingredientsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const pricing: Record<PickleWeight, number> = {
      '250g': Number(price250g) || 150,
      '500g': Number(price500g) || 300,
      '1kg': Number(price1kg) || 580,
    };

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      let finalImageUrl = imageUrl;

      // PART 2: If the owner took a photo with the camera or uploaded from gallery, upload to Firebase Storage first!
      if (selectedFile) {
        setSavingStep('Uploading captured photo to Firebase Cloud Storage...');
        try {
          const uploadResult = await uploadProductImage(selectedFile, category);
          finalImageUrl = uploadResult.url;
        } catch (uploadErr: unknown) {
          console.error('Photo upload failed:', uploadErr);
          const uploadMsg = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
          // Do not pretend it succeeded if Storage upload fails
          setError(uploadMsg);
          setSaving(false);
          setSavingStep('');
          return;
        }
      }

      setSavingStep('Saving product details to Cloud Firestore...');

      const productData: ProductInput = {
        name: name.trim(),
        regionalName: regionalName.trim() || '',
        category,
        dietaryType,
        spiceLevel,
        shortDescription: shortDescription.trim(),
        detailedDescription: detailedDescription.trim() || shortDescription.trim(),
        ingredients,
        imageUrl: finalImageUrl,
        pricing,
        isAvailable,
        highlightNote: highlightNote.trim() || undefined,
      };

      if (productToEdit && productToEdit.id) {
        // Save/merge using Firestore document ID
        await saveProductToFirestore(productToEdit.id, productData);
        setSuccess(`"${productData.name}" was successfully updated in Cloud Firestore.`);
      } else {
        const { id } = await addProductToFirestore(productData);
        setSuccess(`"${productData.name}" was added to Cloud Firestore with ID: ${id}`);
      }

      setTimeout(() => {
        onProductSaved();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      console.error('Firestore save product error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save product in Firestore.';
      setError(
        msg.includes('permission') || msg.includes('Missing or insufficient permissions')
          ? 'Permission Denied: Please sign in through the Owner Portal to save products. Only authenticated admins can modify the catalog.'
          : msg
      );
    } finally {
      setSaving(false);
      setSavingStep('');
    }
  };

  const activeDisplayImage = previewBlobUrl || imageUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Hidden Mobile Camera Input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Hidden Gallery / File Picker Input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoSelect}
        className="hidden"
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#F4ECE0] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FAF6EE] px-6 py-5 border-b border-[#F4ECE0] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">
              {productToEdit ? 'Edit Product & Stock Status' : 'Add New Product to Store'}
            </h2>
            <p className="text-xs text-gray-600">
              Manage stock, price, descriptions, and capture real product photos.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProduct} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed flex-1">{error}</div>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <div className="font-medium flex-1">{success}</div>
            </div>
          )}

          {/* Section: Stock Status Banner */}
          <div className="p-4 rounded-2xl border transition-colors bg-gradient-to-r from-[#FAF6EE] to-[#F4ECE0] border-[#EADBCA]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 block">
                  Product Availability (Stock Status)
                </span>
                <p className="text-xs text-gray-600 mt-0.5">
                  Toggle whether customers can add this item to their WhatsApp cart.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4D3E]"></div>
              </label>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                  isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-600' : 'bg-red-600'}`}
                ></span>
                {isAvailable ? 'In Stock (Available for ordering)' : 'Out of Stock (Shows "Out of Stock" label)'}
              </span>
              <span className="text-[11px] text-gray-500">
                (Note: Only this product's status will change)
              </span>
            </div>
          </div>

          {/* PART 2: Photo Capture & Gallery Upload Options */}
          <div className="space-y-3 bg-[#FAF6EE]/50 p-4 rounded-2xl border border-[#EADBCA]">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
              Product Photography (Camera & Gallery)
            </label>

            {/* Main Action Buttons: Take Photo & Upload Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border-2 border-[#9E1A17] text-[#9E1A17] hover:bg-[#9E1A17] hover:text-white rounded-2xl font-bold text-xs shadow-sm transition-all active:scale-[0.98]"
              >
                <Camera className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div className="font-bold leading-tight">Take Photo</div>
                  <div className="text-[10px] font-normal opacity-80 leading-tight">
                    Open phone camera
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white rounded-2xl font-bold text-xs shadow-sm transition-all active:scale-[0.98]"
              >
                <UploadCloud className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div className="font-bold leading-tight">Upload Photo</div>
                  <div className="text-[10px] font-normal opacity-80 leading-tight">
                    Select from photo gallery
                  </div>
                </div>
              </button>
            </div>

            {/* Photo Preview Card */}
            {activeDisplayImage && (
              <div className="relative rounded-2xl overflow-hidden border border-[#EADBCA] bg-white p-3 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  <img
                    src={activeDisplayImage}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  {selectedFile && (
                    <span className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[9px] font-semibold py-0.5 text-center rounded">
                      New Photo
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {selectedFile ? selectedFile.name : 'Current Product Image'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {selectedFile ? (
                      <span className="inline-flex items-center gap-1 text-[#1B4D3E] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready to upload to Firebase Storage upon saving
                      </span>
                    ) : activeDisplayImage.startsWith('https://firebasestorage') ? (
                      <span className="text-[#1B4D3E] font-medium">
                        Hosted permanently on Firebase Cloud Storage
                      </span>
                    ) : (
                      <span>Preset artisanal photo</span>
                    )}
                  </div>
                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="text-xs text-[#9E1A17] hover:underline font-bold"
                    >
                      Change Photo
                    </button>
                    <span className="text-gray-300">·</span>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs text-gray-500 hover:text-red-600 font-medium inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsible Preset Photo Selector */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPresetPicker(!showPresetPicker)}
                className="text-xs font-semibold text-gray-600 hover:text-[#9E1A17] inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C8830E]" />
                <span>{showPresetPicker ? 'Hide preset photos' : 'Or choose from authentic recipe presets'}</span>
              </button>

              {showPresetPicker && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewBlobUrl(null);
                          setImageUrl(preset.path);
                        }}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                          imageUrl === preset.path && !selectedFile
                            ? 'border-[#9E1A17] ring-2 ring-[#9E1A17]/30 scale-105'
                            : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.path}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                      Direct Photo URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => {
                        setSelectedFile(null);
                        setPreviewBlobUrl(null);
                        setImageUrl(e.target.value);
                      }}
                      placeholder="https://example.com/pickle.jpg"
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 1: Product Name & Telugu Regional Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Andhra Avakaya Mango Pickle"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Regional / Telugu Name
              </label>
              <input
                type="text"
                value={regionalName}
                onChange={(e) => setRegionalName(e.target.value)}
                placeholder="e.g. ఆంధ్ర సాంప్రదాయ ఆవకాయ"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17] focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 2: Category, Dietary Type, Spice Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17]"
              >
                <option value="veg-pickles">Veg Pickles</option>
                <option value="non-veg-pickles">Non-Veg Pickles</option>
                <option value="snacks">Traditional Snacks</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Dietary Type *
              </label>
              <select
                value={dietaryType}
                onChange={(e) => setDietaryType(e.target.value as DietaryType)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17]"
              >
                <option value="veg">Pure Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#9E1A17]" />
                Spice Level
              </label>
              <select
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(e.target.value as SpiceLevel)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17]"
              >
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Fiery">Fiery</option>
                <option value="Extra Fiery">Extra Fiery (Andhra Fire)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Jar Weight Pricing */}
          <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#EADBCA] space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9E1A17]">
              Jar / Pack Pricing ({STORE_SETTINGS.currencySymbol} INR) *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="block text-[11px] font-semibold text-gray-600 mb-1">250g Jar</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-gray-500 font-bold">
                    {STORE_SETTINGS.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={price250g}
                    onChange={(e) => setPrice250g(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-gray-600 mb-1">500g Jar</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-gray-500 font-bold">
                    {STORE_SETTINGS.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={price500g}
                    onChange={(e) => setPrice500g(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-gray-600 mb-1">1kg Jar</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-gray-500 font-bold">
                    {STORE_SETTINGS.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={price1kg}
                    onChange={(e) => setPrice1kg(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Highlight Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Badge / Highlight Note
            </label>
            <input
              type="text"
              value={highlightNote}
              onChange={(e) => setHighlightNote(e.target.value)}
              placeholder="e.g. Generational recipe, cold-pressed sesame oil"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17]"
            />
          </div>

          {/* Row 5: Short & Detailed Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Short Description (Card Summary) *
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Crisp sun-ripened raw mango cubes cured with Guntur chillies and cold-pressed sesame oil."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Detailed Description / Story
            </label>
            <textarea
              rows={3}
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder="Full description detailing preparation, aging in ceramic jaadis, and culinary pairings..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17]"
            />
          </div>

          {/* Row 6: Ingredients */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Ingredients (Comma Separated)
            </label>
            <input
              type="text"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Raw Mango, Cold-pressed Sesame Oil, Guntur Red Chilli, Roasted Mustard, Fenugreek, Sea Salt"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9E1A17]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#F4ECE0]">
            <div className="text-xs text-gray-500 font-medium">
              {savingStep && (
                <span className="flex items-center gap-1.5 text-[#1B4D3E]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{savingStep}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#9E1A17] hover:bg-[#7B1311] text-white shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>
                  {saving
                    ? 'Saving...'
                    : productToEdit
                    ? 'Save Changes'
                    : 'Add Product'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
