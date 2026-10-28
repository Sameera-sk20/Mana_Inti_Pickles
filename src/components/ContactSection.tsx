import React from 'react';
import { STORE_SETTINGS } from '../config/settings';
import { getWhatsAppContactUrl } from '../utils/whatsapp';
import { MessageSquare, MapPin, Clock, Mail } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const whatsappUrl = getWhatsAppContactUrl();

  return (
    <section id="contact" className="py-16 bg-white border-t border-[#F4ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#FAF6EE] to-[#F4ECE0] rounded-3xl p-8 sm:p-12 border border-[#EADBCA] shadow-sm max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold text-[#9E1A17] uppercase tracking-widest block">
            Direct Kitchen Contact
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Order Homemade Pickles & Crispy Snacks
          </h2>

          <p className="text-sm sm:text-base text-gray-700 max-w-xl mx-auto leading-relaxed">
            Have a custom order, festive gifting request, or questions about today's fresh batches? Connect with our kitchen team directly on WhatsApp for prompt assistance.
          </p>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#9E1A17] hover:bg-[#7B1311] text-white font-semibold text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Order via WhatsApp ({STORE_SETTINGS.displayPhoneNumber})</span>
            </a>
            <p className="text-[11px] text-gray-500 mt-2">
              Opens WhatsApp with a pre-filled greeting. Please press Send in WhatsApp.
            </p>
          </div>

          <div className="pt-6 border-t border-[#EADBCA]/70 flex flex-wrap justify-center gap-6 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1B4D3E] shrink-0" />
              <span>{STORE_SETTINGS.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1B4D3E] shrink-0" />
              <span>{STORE_SETTINGS.workingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#1B4D3E] shrink-0" />
              <span>{STORE_SETTINGS.supportEmail}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
