import React, { useState } from 'react';
import { STORE_SETTINGS } from '../config/settings';
import { Menu, X, ShoppingBag, ShieldCheck, Plus } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  isAdmin?: boolean;
  onOpenAdminAuth: () => void;
  onOpenAddProduct?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  isAdmin,
  onOpenAdminAuth,
  onOpenAddProduct,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#F4ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a href="#" className="flex flex-col whitespace-nowrap shrink-0 group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#9E1A17] group-hover:text-[#7B1311] transition-colors">
              {STORE_SETTINGS.brandName}
            </span>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide text-[#1B4D3E] italic">
              "{STORE_SETTINGS.tagline}"
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">
            <a href="#home" className="hover:text-[#9E1A17] transition-colors whitespace-nowrap shrink-0">
              Home
            </a>
            <a href="#shop" className="hover:text-[#9E1A17] transition-colors whitespace-nowrap shrink-0">
              Our Pickles & Snacks
            </a>
            <a href="#story" className="hover:text-[#9E1A17] transition-colors whitespace-nowrap shrink-0">
              Our Story
            </a>
            <a href="#contact" className="hover:text-[#9E1A17] transition-colors whitespace-nowrap shrink-0">
              Contact
            </a>
          </nav>

          {/* Zone 3: Actions (Admin & Cart) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAdmin && onOpenAddProduct && (
              <button
                type="button"
                onClick={onOpenAddProduct}
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAdminAuth}
              title={isAdmin ? 'Admin Portal (Signed In)' : 'Owner / Admin Login'}
              className={`p-2.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-green-100 text-green-900 border border-green-200'
                  : 'text-gray-600 hover:text-black hover:bg-[#F4ECE0]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#1B4D3E]" />
              <span className="hidden lg:inline">{isAdmin ? 'Admin' : 'Owner'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 bg-[#9E1A17] hover:bg-[#7B1311] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-[#9E1A17] text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                {cartCount}
              </span>
            </button>

            {/* Mobile hamburger button */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-gray-700 hover:bg-[#F4ECE0] focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6EE] border-b border-[#F4ECE0] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-800 hover:bg-[#F4ECE0] rounded-lg"
          >
            Home
          </a>
          <a
            href="#shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-800 hover:bg-[#F4ECE0] rounded-lg"
          >
            Our Pickles & Snacks (Veg, Non-Veg, Snacks)
          </a>
          <a
            href="#story"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-800 hover:bg-[#F4ECE0] rounded-lg"
          >
            Our Story & Heritage
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-800 hover:bg-[#F4ECE0] rounded-lg"
          >
            Contact & WhatsApp
          </a>

          {isAdmin && onOpenAddProduct && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddProduct();
              }}
              className="w-full mt-2 inline-flex justify-center items-center gap-2 bg-[#1B4D3E] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product to Firestore</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdminAuth();
            }}
            className="w-full inline-flex justify-center items-center gap-2 bg-[#FAF6EE] border border-[#EADBCA] text-gray-800 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-[#1B4D3E]" />
            <span>{isAdmin ? 'Admin Portal (Signed In)' : 'Owner / Admin Login'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCart();
            }}
            className="w-full mt-2 inline-flex justify-center items-center gap-2 bg-[#9E1A17] text-white px-5 py-3 rounded-xl font-semibold text-sm shadow"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Open Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
          </button>
        </div>
      )}
    </header>
  );
};

