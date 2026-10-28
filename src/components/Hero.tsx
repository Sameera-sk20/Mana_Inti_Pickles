import React from 'react';
import heroImg from '../assets/images/hero_pickle_jaadi_1793172291402.jpg';
import { ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { STORE_SETTINGS } from '../config/settings';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#FAF6EE] to-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAA21D]/15 border border-[#EAA21D]/30 text-[#C8830E] text-xs sm:text-sm font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Small-Batch Homemade Andhra Pickles & Traditional Snacks</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15] text-balance">
              Pure Nostalgia in Every Bite. <br />
              <span className="text-[#9E1A17]">“{STORE_SETTINGS.tagline}”</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Made in small family batches using sun-dried native spices, cold-pressed sesame oils, and time-honored recipes. Authentic Veg Pickles, Non-Veg Pickles, and Crispy Snacks delivered directly to your home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a
                href="#shop"
                className="inline-flex justify-center items-center gap-2 bg-[#9E1A17] hover:bg-[#7B1311] text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-[#9E1A17]/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Pickles & Snacks</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#story"
                className="inline-flex justify-center items-center gap-2 bg-white border border-[#EADBCA] hover:bg-[#FAF6EE] text-gray-800 text-base font-medium px-7 py-3.5 rounded-xl transition-colors shadow-sm"
              >
                <span>Our Kitchen Story</span>
              </a>
            </div>

            {/* Trust Markers */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#F4ECE0] text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#1B4D3E] shrink-0" />
                <span>Wood-Pressed Sesame Oil</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#1B4D3E] shrink-0" />
                <span>Zero Synthetic Colors</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                <Heart className="w-4 h-4 text-[#9E1A17] shrink-0" />
                <span>Pure Generational Recipes</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Res Authentic Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Subtle Warm Backdrop Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#EAA21D] to-[#9E1A17] rounded-3xl blur-xl opacity-20 transform -rotate-1"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src={heroImg}
                  alt="Authentic Indian pickle preparation with traditional ceramic jaadi jar, spices and mangoes"
                  className="w-full h-[360px] sm:h-[430px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Photo Scrim with Caption */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white">
                  <span className="text-[#F6B73C] font-semibold text-xs tracking-wider uppercase">Handcrafted Legacy</span>
                  <p className="font-serif text-lg font-bold">Traditional Andhra Ceramic Jaadi</p>
                  <p className="text-xs text-gray-200 mt-0.5">Slow-matured in glazed earthen jars to preserve natural flavor</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
