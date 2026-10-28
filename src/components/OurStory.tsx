import React from 'react';
import { STORE_SETTINGS } from '../config/settings';
import storyImg from '../assets/images/hero_pickle_jaadi_1793172291402.jpg';

export const OurStory: React.FC = () => {
  return (
    <section id="story" className="py-20 bg-[#FAF6EE] border-t border-b border-[#F4ECE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Imagery */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={storyImg}
                alt="Traditional Indian homemade pickling craft"
                className="w-full h-[380px] sm:h-[440px] object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-4 hidden sm:block bg-white p-5 rounded-2xl shadow-xl border border-[#F4ECE0] max-w-xs">
              <p className="font-serif italic text-sm text-[#9E1A17] leading-relaxed">
                "Inti Ruchi, Prathi Mudda Lo — Bringing authentic home warmth to every single meal."
              </p>
            </div>
          </div>

          {/* Right: Narrative */}
          <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
            <span className="text-xs font-bold text-[#9E1A17] uppercase tracking-widest">
              Our Kitchen Heritage
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Homemade Care, Seasonal Harvests & Generational Recipes
            </h2>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              At <strong className="font-semibold text-gray-900">{STORE_SETTINGS.brandName}</strong>, 
              pickling is not an industrial factory process. It is a slow, respectful kitchen tradition rooted in the vibrant culinary culture of Andhra and Telangana homes.
            </p>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Every season, we pick raw unblemished mangoes, tender gongura leaves, and fresh pungent red chillies. Spices are gently roasted over modest flames and stone-ground to release their deepest essential oils. Preserved using cold-pressed sesame oil and unrefined rock salt, every batch is matured in glazed ceramic jaadi jars.
            </p>

            <div className="pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#EADBCA] shadow-sm">
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                  We prepare our pickles in small, manageable domestic batches so that the aroma, crunch, and authentic spice balance remain as comforting as lunch at home.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
