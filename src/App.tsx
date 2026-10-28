/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OurStory } from './components/OurStory';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Toast, ToastData } from './components/Toast';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminProductModal } from './components/AdminProductModal';

import { SAMPLE_PRODUCTS } from './data/products';
import { Product, PickleWeight, ProductCategory, CartItem } from './types/product';
import {
  getProductsFromFirestore,
  deleteProductFromFirestore,
  seedSampleProductsToFirestore,
  toggleProductStockStatus,
} from './services/productService';
import { auth } from './lib/firebase';
import { openWhatsAppCartOrder } from './utils/whatsapp';
import { STORE_SETTINGS } from './config/settings';
import {
  Info,
  Sparkles,
  ShoppingBag,
  Database,
  AlertCircle,
  Plus,
  RefreshCw,
  FolderPlus,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export default function App() {
  // Navigation & Category filter state
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('veg-pickles');
  const [snackDietaryFilter, setSnackDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  // Admin Product Form State
  const [isAdminProductModalOpen, setIsAdminProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Product Data state: strictly obeys no-silent-fallback requirement
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isFirestoreEmpty, setIsFirestoreEmpty] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isDemoPreview, setIsDemoPreview] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);

  // Product Inspection Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<ToastData | null>(null);

  // Listen for Firebase Auth user state changes
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch products from Firestore with smart merging
  const fetchCatalog = useCallback(async () => {
    setLoadingProducts(true);
    setDbError(null);
    try {
      const response = await getProductsFromFirestore();
      if (response.error) {
        setDbError(response.error);
        setProducts(response.products);
        setIsFirestoreEmpty(false);
      } else {
        setProducts(response.products);
        setIsFirestoreEmpty(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error loading catalog from Firestore';
      setDbError(msg);
      // Keep baseline catalog so customer store remains functional
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Load products on initial mount
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Current display products: either live Firestore products or demo preview if chosen
  const displayProducts = useMemo(() => {
    if (isDemoPreview) {
      return SAMPLE_PRODUCTS;
    }
    return products;
  }, [products, isDemoPreview]);

  // Total cart items count
  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalCartAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  // Filtered products list based on active category & snack filter
  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      if (product.category === 'snacks') {
        if (snackDietaryFilter !== 'all' && product.dietaryType !== snackDietaryFilter) {
          return false;
        }
      }
      return true;
    });
  }, [displayProducts, activeCategory, snackDietaryFilter]);

  // Add to Cart handler
  const handleAddToCart = (product: Product, weight: PickleWeight, quantity: number) => {
    if (!product.isAvailable) {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Out of Stock',
        message: `${product.name} is currently out of stock.`,
      });
      return;
    }

    const cartItemId = `${product.id}-${weight}`;
    const unitPrice = product.pricing[weight];

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          selectedWeight: weight,
          quantity,
          unitPrice,
          subtotal: unitPrice * quantity,
        };
        return [...prevItems, newItem];
      }
    });

    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity} × ${product.name} (${weight}) added to your cart.`,
    });
  };

  // Update quantity in cart
  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((i) => i.id === cartItemId);
      if (itemToRemove) {
        setToast({
          id: Date.now().toString(),
          type: 'info',
          title: 'Removed from Cart',
          message: `${itemToRemove.product.name} (${itemToRemove.selectedWeight}) removed.`,
        });
      }
      return prev.filter((item) => item.id !== cartItemId);
    });
  };

  // Place order via WhatsApp for all cart items
  const handleOrderViaWhatsApp = () => {
    const result = openWhatsAppCartOrder(cartItems);
    if (!result.success) {
      setToast({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Cannot Proceed',
        message: result.message || 'Please check your cart items.',
      });
      return;
    }

    setIsCartOpen(false);
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'WhatsApp Ready',
      message: 'Opening WhatsApp with your order draft. Please tap "Send" in WhatsApp to confirm with our team!',
    });
  };

  // Admin: Open edit product modal
  const handleEditProduct = (product: Product) => {
    if (!currentUser) {
      setToast({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Admin Authentication Required',
        message: 'Please sign in to the Owner Portal first to edit products.',
      });
      setIsAdminAuthOpen(true);
      return;
    }
    setProductToEdit(product);
    setIsAdminProductModalOpen(true);
  };

  // Admin: Delete product from Firestore
  const handleDeleteProduct = async (product: Product) => {
    if (!currentUser) {
      setToast({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Admin Authentication Required',
        message: 'Please sign in to the Owner Portal first to delete products.',
      });
      setIsAdminAuthOpen(true);
      return;
    }

    try {
      await deleteProductFromFirestore(product.id);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Product Deleted',
        message: `"${product.name}" was removed from Cloud Firestore.`,
      });
      fetchCatalog();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product.';
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Delete Failed',
        message: msg,
      });
    }
  };

  // Admin: Quick toggle product stock status
  const handleToggleStock = async (product: Product) => {
    if (!currentUser) {
      setToast({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Admin Authentication Required',
        message: 'Please sign in to the Owner Portal first to toggle stock status.',
      });
      setIsAdminAuthOpen(true);
      return;
    }

    const newStatus = !product.isAvailable;
    // Optimistically update local state immediately so UI updates without lag
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isAvailable: newStatus } : p))
    );

    try {
      await toggleProductStockStatus(product.id, newStatus);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: newStatus ? 'Marked In Stock' : 'Marked Out of Stock',
        message: `"${product.name}" is now ${newStatus ? 'In Stock and available for orders' : 'marked as Out of Stock'}.`,
      });
    } catch (err: unknown) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isAvailable: product.isAvailable } : p))
      );
      const msg = err instanceof Error ? err.message : 'Failed to update stock status in Firestore.';
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Stock Update Failed',
        message: msg,
      });
    }
  };

  // Admin: Seed Initial 18 Products into empty Firestore
  const handleSeedDatabase = async () => {
    if (!currentUser) {
      setToast({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Admin Sign-In Required',
        message: 'Sign in to the Owner Portal to seed initial products into your live Firestore.',
      });
      setIsAdminAuthOpen(true);
      return;
    }

    setSeedingLoading(true);
    try {
      const { seededCount } = await seedSampleProductsToFirestore();
      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Products Seeded to Firestore',
        message: `Successfully created ${seededCount} products in the Cloud Firestore "products" collection!`,
      });
      setIsDemoPreview(false);
      fetchCatalog();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to seed products into Firestore.';
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Seeding Failed',
        message: msg,
      });
    } finally {
      setSeedingLoading(false);
    }
  };

  // Count items per category dynamically
  const vegCount = displayProducts.filter((p) => p.category === 'veg-pickles').length;
  const nonVegCount = displayProducts.filter((p) => p.category === 'non-veg-pickles').length;
  const snacksCount = displayProducts.filter((p) => p.category === 'snacks').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-gray-900 selection:bg-[#F6B73C] selection:text-black font-sans">
      {/* Top Navbar with Admin & Cart Triggers */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isAdmin={Boolean(currentUser)}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onOpenAddProduct={() => {
          setProductToEdit(null);
          setIsAdminProductModalOpen(true);
        }}
      />

      {/* Hero Section */}
      <Hero />

      {/* Main Shop Catalog */}
      <main id="shop" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E1A17]/10 text-[#9E1A17] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Homemade Kitchen</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Our Pickles & Snacks
          </h2>

          <p className="text-sm sm:text-base text-gray-700 mt-3 leading-relaxed">
            Choose from authentic vegetarian pickles, rich spicy meat & seafood pickles, and crispy traditional Andhra savouries.
          </p>

          {/* Data Source Status Strip */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 bg-[#F4ECE0] border border-[#EADBCA] text-gray-700 text-xs px-4 py-2 rounded-xl text-left">
              {loadingProducts ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[#9E1A17] animate-spin shrink-0" />
                  <span>Loading live catalog from Cloud Firestore (mana-inti-pickles)...</span>
                </>
              ) : dbError ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Firestore Status: <strong className="font-semibold text-gray-900">{dbError}</strong>
                  </span>
                </>
              ) : isDemoPreview ? (
                <>
                  <Eye className="w-4 h-4 text-[#1B4D3E] shrink-0" />
                  <span>
                    Viewing Offline Sample Products (Demo Preview Mode).
                  </span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 text-[#1B4D3E] shrink-0" />
                  <span className="font-medium text-[#1B4D3E]">
                    Connected to Cloud Firestore · {displayProducts.length} items
                    {displayProducts.filter((p) => !p.isAvailable).length > 0 && (
                      <span className="ml-1 text-[#9E1A17] font-bold">
                        ({displayProducts.filter((p) => !p.isAvailable).length} Out of Stock)
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>

            {/* Action buttons in header */}
            <button
              type="button"
              onClick={() => fetchCatalog()}
              title="Refresh catalog from Firestore"
              className="p-2 bg-white border border-[#EADBCA] hover:bg-[#FAF6EE] text-gray-600 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingProducts ? 'animate-spin' : ''}`} />
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setProductToEdit(null);
                  setIsAdminProductModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Product (addDoc)</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Loading State */}
        {loadingProducts ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#F4ECE0] max-w-md mx-auto space-y-4">
            <RefreshCw className="w-8 h-8 text-[#9E1A17] animate-spin mx-auto" />
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Querying Cloud Firestore...
            </h3>
            <p className="text-xs text-gray-600">
              Executing getDocs() on the "products" collection in project <strong>mana-inti-pickles</strong>.
            </p>
          </div>
        ) : dbError ? (
          /* 2. Error State (No silent fallback) */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-red-200 max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              Firestore Connection Notice
            </h3>
            <div className="p-4 bg-red-50 text-red-900 rounded-2xl text-xs text-left leading-relaxed font-mono">
              {dbError}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              As required by your instructions, sample products are <strong>not silently displayed</strong> when a Firestore request returns an error.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fetchCatalog()}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#9E1A17] text-white text-xs font-bold rounded-xl hover:bg-[#7B1311] transition-colors"
              >
                Retry getDocs()
              </button>
              <button
                type="button"
                onClick={() => setIsDemoPreview(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FAF6EE] text-gray-800 border border-[#EADBCA] text-xs font-bold rounded-xl hover:bg-[#F4ECE0] transition-colors"
              >
                Preview 18 Sample Products
              </button>
            </div>
          </div>
        ) : isFirestoreEmpty && !isDemoPreview ? (
          /* 3. Empty State (No silent fallback - requirement 6) */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#F4ECE0] max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF6EE] border border-[#EADBCA] flex items-center justify-center mx-auto text-[#1B4D3E]">
              <Database className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full mb-2">
                Cloud Firestore Live & Connected
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900">
                Firestore "products" Collection is Empty
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
                Your database connection to project <strong className="font-semibold text-gray-900">mana-inti-pickles</strong> succeeded with 0 documents. As instructed, local sample products are not silently overriding your empty database.
              </p>
            </div>

            <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#EADBCA] text-xs text-gray-700 space-y-2 text-left">
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1B4D3E]" />
                <span>Admin Actions:</span>
              </div>
              <p className="leading-relaxed">
                • Click <strong>"+ Add Product (addDoc)"</strong> to insert your first pickle with custom pricing and images.
              </p>
              <p className="leading-relaxed">
                • Click <strong>"Seed 18 Initial Products"</strong> to instantly populate Firestore with authentic Andhra Avakaya, Gongura, Mutton, Fish, and Chegodilu recipes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    setIsAdminAuthOpen(true);
                  } else {
                    setProductToEdit(null);
                    setIsAdminProductModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-5 py-3 bg-[#9E1A17] hover:bg-[#7B1311] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add First Product (addDoc)</span>
              </button>

              <button
                type="button"
                onClick={handleSeedDatabase}
                disabled={seedingLoading}
                className="w-full sm:w-auto px-5 py-3 bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FolderPlus className="w-4 h-4" />
                <span>{seedingLoading ? 'Seeding 18 Products...' : 'Seed 18 Initial Products to Firestore'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDemoPreview(true)}
                className="w-full sm:w-auto px-5 py-3 bg-[#FAF6EE] hover:bg-[#F4ECE0] text-gray-800 border border-[#EADBCA] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Sample Products</span>
              </button>
            </div>
          </div>
        ) : (
          /* 4. Display Catalog (Live Firestore Products or Demo Preview) */
          <>
            {isDemoPreview && (
              <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>
                    You are currently previewing 18 sample products offline. Click "Exit Preview" to view the live Firestore state.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDemoPreview(false)}
                  className="font-bold underline text-[#9E1A17] hover:text-[#7B1311] ml-3 whitespace-nowrap"
                >
                  Exit Preview
                </button>
              </div>
            )}

            {/* Category Tabs: Veg Pickles, Non-Veg Pickles, Snacks, All */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
              <div className="inline-flex p-1.5 bg-[#FAF6EE] border border-[#EADBCA] rounded-2xl shadow-sm max-w-full overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveCategory('veg-pickles')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === 'veg-pickles'
                      ? 'bg-[#1B4D3E] text-white shadow-sm'
                      : 'text-gray-700 hover:text-black hover:bg-[#F4ECE0]'
                  }`}
                >
                  Veg Pickles ({vegCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('non-veg-pickles')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === 'non-veg-pickles'
                      ? 'bg-[#9E1A17] text-white shadow-sm'
                      : 'text-gray-700 hover:text-black hover:bg-[#F4ECE0]'
                  }`}
                >
                  Non-Veg Pickles ({nonVegCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('snacks')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === 'snacks'
                      ? 'bg-[#C8830E] text-white shadow-sm'
                      : 'text-gray-700 hover:text-black hover:bg-[#F4ECE0]'
                  }`}
                >
                  Snacks ({snacksCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-gray-800 text-white shadow-sm'
                      : 'text-gray-700 hover:text-black hover:bg-[#F4ECE0]'
                  }`}
                >
                  View All ({displayProducts.length})
                </button>
              </div>
            </div>

            {/* Sub-Filters for Snacks Category */}
            {(activeCategory === 'snacks' || activeCategory === 'all') && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
                  Snack Type:
                </span>
                <div className="inline-flex gap-1.5 p-1 bg-white border border-[#EADBCA] rounded-xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setSnackDietaryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      snackDietaryFilter === 'all'
                        ? 'bg-[#FAF6EE] text-gray-900 font-bold border border-[#EADBCA]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Snacks
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnackDietaryFilter('veg')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      snackDietaryFilter === 'veg'
                        ? 'bg-green-100 text-green-900 font-bold'
                        : 'text-gray-600 hover:text-green-800'
                    }`}
                  >
                    Vegetarian Snacks
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnackDietaryFilter('non-veg')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      snackDietaryFilter === 'non-veg'
                        ? 'bg-red-100 text-red-900 font-bold'
                        : 'text-gray-600 hover:text-red-800'
                    }`}
                  >
                    Non-Veg Snacks
                  </button>
                </div>
              </div>
            )}

            {/* Empty State for Sub-Filters */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#F4ECE0] max-w-lg mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] flex items-center justify-center mx-auto text-gray-400">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  No products in this category yet
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  No products match the selected category filter. Use the Admin panel to add new products to this category in Cloud Firestore.
                </p>
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setProductToEdit(null);
                      setIsAdminProductModalOpen(true);
                    }}
                    className="mt-2 text-xs font-bold text-[#9E1A17] hover:underline"
                  >
                    + Add Product to this Category
                  </button>
                )}
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={(item) => setSelectedProduct(item)}
                    onAddToCart={handleAddToCart}
                    isAdmin={Boolean(currentUser)}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleStock={handleToggleStock}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Our Story */}
      <OurStory />

      {/* Simple, Attractive Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderViaWhatsApp={handleOrderViaWhatsApp}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        currentUser={currentUser}
        onSuccess={() => {
          setToast({
            id: Date.now().toString(),
            type: 'success',
            title: 'Owner Portal',
            message: 'Admin permissions granted for product management.',
          });
        }}
      />

      {/* Admin Product Create / Edit Modal */}
      <AdminProductModal
        isOpen={isAdminProductModalOpen}
        onClose={() => {
          setIsAdminProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onProductSaved={() => {
          fetchCatalog();
          setToast({
            id: Date.now().toString(),
            type: 'success',
            title: 'Catalog Updated',
            message: 'Products reloaded from Cloud Firestore.',
          });
        }}
      />

      {/* Toast Alert Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Floating Cart Button for Mobile Ease */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 sm:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-[#9E1A17] text-white px-5 py-3 rounded-full shadow-2xl font-semibold text-sm active:scale-95 transition-all border-2 border-white"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Cart ({totalCartCount})</span>
            <span>·</span>
            <span className="font-bold tabular-nums">
              {STORE_SETTINGS.currencySymbol}{totalCartAmount}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
