import React, { useState, useEffect } from 'react';
import { Product, PickleWeight } from '../types/product';
import { STORE_SETTINGS } from '../config/settings';
import { X, ShoppingCart, Minus, Plus, CheckCircle, Flame, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, weight: PickleWeight, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [weight, setWeight] = useState<PickleWeight>('500g');
  const [quantity, setQuantity] = useState<number>(1);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setWeight('500g');
      setQuantity(1);
      setImgError(false);
      setAdded(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const unitPrice = product.pricing[weight];
  const totalPrice = unitPrice * quantity;
  const unitLabel = product.category === 'snacks' ? 'Pack' : 'Jar';

  const handleAdd = () => {
    if (!product.isAvailable) return;
    onAddToCart(product, weight, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#F4ECE0] transform transition-all animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow-md transition-all focus:outline-none"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image */}
          <div className="md:col-span-5 relative bg-[#FAF6EE] min-h-[260px] md:min-h-full">
            {!imgError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#FAF6EE] to-[#F4ECE0]">
                <span className="font-serif text-2xl font-bold text-[#9E1A17]">{product.name}</span>
                <span className="text-sm text-gray-500 mt-1">{product.regionalName}</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span
                className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm ${
                  product.dietaryType === 'veg'
                    ? 'bg-green-700/90 text-white'
                    : 'bg-red-700/90 text-white'
                }`}
              >
                {product.dietaryType === 'veg' ? 'Pure Vegetarian' : 'Non-Vegetarian'}
              </span>

              {product.spiceLevel && (
                <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-semibold rounded-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#F6B73C]" />
                  {product.spiceLevel} Spice
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Information & Add to Cart */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header & Stock status */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      product.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.isAvailable ? 'Sample Stock: Ready' : 'Out of Stock (Sample)'}
                  </span>
                </div>

                <h2 id="product-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                  {product.name}
                </h2>
                {product.regionalName && (
                  <p className="text-sm font-semibold text-[#1B4D3E] mt-0.5">
                    {product.regionalName}
                  </p>
                )}
              </div>

              {/* Craft description */}
              <p className="text-sm text-gray-700 leading-relaxed font-normal">
                {product.detailedDescription}
              </p>

              {/* Ingredients list */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Ingredients & Seasonings
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs bg-[#FAF6EE] border border-[#F4ECE0] text-gray-800 px-2.5 py-1 rounded-md"
                    >
                      <CheckCircle className="w-3 h-3 text-[#1B4D3E]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Weight Selector */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Select {unitLabel} Size:
                  </label>
                  <span className="text-xs text-gray-500">
                    Unit Price: {STORE_SETTINGS.currencySymbol}{unitPrice}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['250g', '500g', '1kg'] as PickleWeight[]).map((w) => {
                    const isActive = weight === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWeight(w)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                          isActive
                            ? 'border-[#9E1A17] bg-[#9E1A17] text-white shadow-sm'
                            : 'border-[#EADBCA] bg-[#FAF6EE] text-gray-700 hover:bg-[#F4ECE0]'
                        }`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Number of {unitLabel}s:
                </span>
                <div className="flex items-center border border-[#EADBCA] rounded-xl bg-[#FAF6EE] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !product.isAvailable}
                    className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-gray-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10 || !product.isAvailable}
                    className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Total & Add to Cart */}
            <div className="pt-6 mt-6 border-t border-[#F4ECE0] space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block">
                    Calculated Sample Total
                  </span>
                  <p className="text-xs text-gray-400">
                    {quantity} × {weight} @ {STORE_SETTINGS.currencySymbol}{unitPrice}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[#9E1A17] tabular-nums">
                    {STORE_SETTINGS.currencySymbol}{totalPrice}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={!product.isAvailable}
                onClick={handleAdd}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all ${
                  product.isAvailable
                    ? added
                      ? 'bg-[#1B4D3E] text-white shadow-md'
                      : 'bg-[#9E1A17] hover:bg-[#7B1311] text-white shadow-md active:scale-[0.99]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.isAvailable ? 'Add to Cart' : 'Currently Out of Stock'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
