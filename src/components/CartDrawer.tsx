import React, { useEffect } from 'react';
import { CartItem } from '../types/product';
import { STORE_SETTINGS } from '../config/settings';
import { X, Trash2, Minus, Plus, MessageSquare, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onOrderViaWhatsApp: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOrderViaWhatsApp,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF6EE] h-full shadow-2xl flex flex-col border-l border-[#F4ECE0] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#F4ECE0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#9E1A17]/10 text-[#9E1A17] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Your Cart</h2>
              <p className="text-xs text-gray-500">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-[#FAF6EE] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#EADBCA] flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-800">Your Cart is Empty</h3>
              <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                Explore our authentic Veg Pickles, Non-Veg Pickles, and crispy Andhra Snacks to add to your order.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-2 bg-[#9E1A17] hover:bg-[#7B1311] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              return (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#F4ECE0] shadow-sm flex gap-3.5 items-center justify-between"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#FAF6EE]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-gray-900 truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-600">
                      <span className="font-semibold text-[#1B4D3E]">{item.selectedWeight}</span>
                      <span>·</span>
                      <span>
                        {STORE_SETTINGS.currencySymbol}{item.unitPrice} each
                      </span>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#EADBCA] rounded-lg bg-[#FAF6EE] p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:text-black"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 15}
                          className="p-1 text-gray-600 hover:text-black disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-[#9E1A17] tabular-nums">
                        {STORE_SETTINGS.currencySymbol}{itemTotal}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                    title="Remove item"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-[#F4ECE0] space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                Estimated Total:
              </span>
              <span className="font-serif text-2xl font-bold text-[#9E1A17] tabular-nums">
                {STORE_SETTINGS.currencySymbol}{totalAmount}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 leading-normal">
              Sample pricing. When you click below, a pre-composed order message will open directly in WhatsApp to confirm with our kitchen team.
            </p>

            <button
              type="button"
              onClick={onOrderViaWhatsApp}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-[#9E1A17] hover:bg-[#7B1311] text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Order via WhatsApp ({STORE_SETTINGS.currencySymbol}{totalAmount})</span>
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              You must press Send in WhatsApp. Order is confirmed after kitchen verification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
