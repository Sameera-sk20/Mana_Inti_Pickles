import React, { useState } from 'react';
import { Product, PickleWeight } from '../types/product';
import { STORE_SETTINGS } from '../config/settings';
import { ShoppingCart, Eye, Minus, Plus, Flame, Check, Edit2, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, weight: PickleWeight, quantity: number) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleStock?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
  isAdmin,
  onEdit,
  onDelete,
  onToggleStock,
}) => {
  const [selectedWeight, setSelectedWeight] = useState<PickleWeight>('500g');
  const [quantity, setQuantity] = useState<number>(1);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const unitPrice = product.pricing[selectedWeight];
  const totalPrice = unitPrice * quantity;

  const handleWeightClick = (e: React.MouseEvent, weight: PickleWeight) => {
    e.stopPropagation();
    setSelectedWeight(weight);
  };

  const handleQtyClick = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    onAddToCart(product, selectedWeight, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const isSnack = product.category === 'snacks';
  const unitLabel = isSnack ? 'Pack' : 'Jar';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#F4ECE0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative">
      {/* Admin Action Bar if Authenticated */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-gray-200">
          {onToggleStock && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStock(product);
              }}
              title={product.isAvailable ? 'Click to mark Out of Stock' : 'Click to mark In Stock'}
              className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                product.isAvailable
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${product.isAvailable ? 'bg-green-600' : 'bg-red-600'}`}></span>
              <span>{product.isAvailable ? 'In Stock' : 'Out'}</span>
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              title="Edit Product Details & Photo"
              className="p-1.5 text-gray-700 hover:text-[#9E1A17] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${product.name}" from Firestore?`)) {
                  onDelete(product);
                }
              }}
              title="Delete Product"
              className="p-1.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div>
        {/* Product Image Area */}
        <div
          onClick={() => onOpenDetails(product)}
          className="relative h-60 w-full cursor-pointer overflow-hidden bg-[#FAF6EE] select-none"
        >
          {!imgError ? (
            <img
              src={product.imageUrl}
              alt={`${product.name} showcase`}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FAF6EE] to-[#F4ECE0]">
              <span className="font-serif text-xl font-bold text-[#9E1A17]">{product.name}</span>
              <span className="text-xs text-gray-500 mt-1">{product.regionalName}</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.isAvailable ? (
              <span className="px-2.5 py-1 bg-[#1B4D3E]/90 backdrop-blur-sm text-white text-[11px] font-semibold rounded-md shadow-sm">
                In Stock
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-gray-600/90 backdrop-blur-sm text-white text-[11px] font-semibold rounded-md shadow-sm">
                Out of Stock
              </span>
            )}

            {/* Veg / Non-Veg Indicator */}
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded shadow-sm border ${
                product.dietaryType === 'veg'
                  ? 'bg-green-50 text-green-800 border-green-300'
                  : 'bg-red-50 text-red-800 border-red-300'
              }`}
            >
              {product.dietaryType === 'veg' ? 'Pure Veg' : 'Non-Veg'}
            </span>

            {product.spiceLevel && (
              <span className="px-2 py-0.5 bg-[#EAA21D] text-gray-900 text-[11px] font-bold rounded flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3 text-[#9E1A17]" />
                {product.spiceLevel}
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="absolute bottom-3 right-3 p-2 bg-white/95 hover:bg-white text-gray-700 hover:text-[#9E1A17] rounded-full shadow-md transition-all transform hover:scale-110"
            title="Inspect pickle details"
            aria-label={`View details for ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5">
          <div className="mb-2">
            <h3
              onClick={() => onOpenDetails(product)}
              className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#9E1A17] transition-colors cursor-pointer leading-snug"
            >
              {product.name}
            </h3>
            {product.regionalName && (
              <p className="text-xs font-semibold text-[#1B4D3E]">{product.regionalName}</p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {product.shortDescription}
          </p>

          {/* Weight Selection */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {unitLabel} Weight
              </label>
              <span className="text-[11px] text-gray-500">
                {STORE_SETTINGS.currencySymbol}{unitPrice} each
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['250g', '500g', '1kg'] as PickleWeight[]).map((w) => {
                const isActive = selectedWeight === w;
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={(e) => handleWeightClick(e, w)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all text-center ${
                      isActive
                        ? 'bg-[#9E1A17] border-[#9E1A17] text-white shadow-sm'
                        : 'bg-[#FAF6EE] border-[#EADBCA] text-gray-700 hover:bg-[#F4ECE0]'
                    }`}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price & Quantity Strip */}
          <div className="mt-4 pt-3 border-t border-[#F4ECE0] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-500 block uppercase tracking-wider">
                Price
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[#9E1A17] tabular-nums">
                  {STORE_SETTINGS.currencySymbol}{totalPrice}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-gray-500">
                    ({quantity} × {STORE_SETTINGS.currencySymbol}{unitPrice})
                  </span>
                )}
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center border border-[#EADBCA] rounded-lg bg-[#FAF6EE] p-0.5">
              <button
                type="button"
                onClick={(e) => handleQtyClick(e, -1)}
                disabled={quantity <= 1 || !product.isAvailable}
                className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-gray-900 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => handleQtyClick(e, 1)}
                disabled={quantity >= 10 || !product.isAvailable}
                className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button: Add to Cart */}
      <div className="p-5 pt-0">
        <button
          type="button"
          disabled={!product.isAvailable}
          onClick={handleAdd}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            product.isAvailable
              ? justAdded
                ? 'bg-[#1B4D3E] text-white shadow'
                : 'bg-[#9E1A17] hover:bg-[#7B1311] text-white shadow-sm hover:shadow active:scale-[0.99]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {justAdded ? (
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
  );
};

