import React from 'react';
import { STORE_SETTINGS } from '../config/settings';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0E2820] text-[#FAF6EE] pt-14 pb-8 border-t border-[#143B2F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#143B2F]/80">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <span className="font-serif text-2xl font-bold tracking-tight text-white block">
              {STORE_SETTINGS.brandName}
            </span>
            <p className="text-xs font-semibold text-[#F6B73C] italic tracking-wide">
              "{STORE_SETTINGS.tagline}"
            </p>
            <p className="text-xs text-[#FAF6EE]/80 max-w-sm leading-relaxed">
              Authentic South Indian Veg Pickles, Non-Veg Pickles, and Crispy Snacks handcrafted in small domestic batches with cold-pressed oils, native spices, and zero chemical preservatives.
            </p>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6EE]/80">
              <li>
                <a href="#home" className="hover:text-[#F6B73C] transition-colors">Home</a>
              </li>
              <li>
                <a href="#shop" className="hover:text-[#F6B73C] transition-colors">Pickles & Snacks Shop</a>
              </li>
              <li>
                <a href="#story" className="hover:text-[#F6B73C] transition-colors">Our Story & Heritage</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F6B73C] transition-colors">Contact & WhatsApp Orders</a>
              </li>
            </ul>
          </div>

          {/* Demonstration Notice & Legal (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Store Transparency
            </h4>
            <div className="p-3.5 rounded-xl bg-[#143B2F]/60 border border-[#143B2F] text-xs text-[#FAF6EE]/80 leading-relaxed">
              <p className="font-semibold text-[#F6B73C] mb-1">Sample Catalog Notice</p>
              Product stock statuses and prices shown on this storefront are sample demonstration values until updated by the owner. Product data is isolated in a modular data layer ready for future database connection.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#FAF6EE]/60 gap-3">
          <p>© {new Date().getFullYear()} {STORE_SETTINGS.brandName}. All rights reserved.</p>
          <p>Handcrafted with care in Andhra Pradesh & Telangana, India</p>
        </div>
      </div>
    </footer>
  );
};
