import React, { useState } from 'react';
import {
  ArrowUp,
  Store,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Instagram,
  Youtube,
  Twitter,
} from 'lucide-react';
import {
  type CategoryFilter,
  type EditorialCollection,
  type CurrencyCode,
  CURRENCY_CONFIG,
} from '../utils/storeLogic';

interface FooterProps {
  onSelectCategory: (cat: CategoryFilter) => void;
  onSelectEditorial: (ed: EditorialCollection) => void;
  onOpenPodStudio: () => void;
  onOpenShopifyAdmin: (tab?: 'STACK' | 'ADMIN' | 'LIQUID') => void;
  onOpenStoresModal: () => void;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectEditorial,
  onOpenPodStudio,
  onOpenShopifyAdmin,
  onOpenStoresModal,
  currency,
  onCurrencyChange,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubscribed(true);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('trending-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. FESTIVE VALUE & TRUST GUARANTEE STRIP (Matching Image 4) */}
      <section
        aria-label="Store Guarantees and Services"
        className="bg-[#F5EFE6] border-y border-[#E8DEC9] text-[#111111] py-5 sm:py-6"
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Badge 1: Free Shipping */}
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#111111] shrink-0" />
            <div>
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#111111]">
                FREE SHIPPING
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-600">
                On orders above ₹1,499
              </p>
            </div>
          </div>

          {/* Badge 2: Easy Returns */}
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-[#111111] shrink-0" />
            <div>
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#111111]">
                EASY RETURNS
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-600">
                Hassle-free within 7 days
              </p>
            </div>
          </div>

          {/* Badge 3: Secure Payments */}
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#111111] shrink-0" />
            <div>
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#111111]">
                SECURE PAYMENTS
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-600">
                100% optical encrypted
              </p>
            </div>
          </div>

          {/* Badge 4: Customer Support */}
          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-[#111111] shrink-0" />
            <div>
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#111111]">
                24/7 CUSTOMER SUPPORT
              </h3>
              <p className="text-[10px] sm:text-[11px] text-neutral-600">
                Always here to help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DARK ARCHITECTURAL FOOTER (Matching Image 4) */}
      <footer className="bg-[#111111] text-white border-t border-neutral-800">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Col 1: Brand & Bio (3 cols) */}
            <div className="lg:col-span-3 space-y-3.5">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-block font-display text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white"
              >
                NOVAIRE
              </a>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                A modern clothing brand for everyday style. Timeless designs, premium quality, and versatile collections made for you.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4 pt-1 text-neutral-400">
                <a
                  href="#instagram"
                  aria-label="Follow Novaire on Instagram"
                  className="hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#youtube"
                  aria-label="Subscribe to Novaire on YouTube"
                  className="hover:text-white transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="#twitter"
                  aria-label="Follow Novaire on X"
                  className="hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>

              {/* Currency Selector */}
              <div className="pt-2">
                <label
                  htmlFor="footer-currency"
                  className="block text-[9.5px] font-bold uppercase tracking-[0.16em] text-neutral-500 mb-1"
                >
                  CURRENCY
                </label>
                <select
                  id="footer-currency"
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                  className="bg-neutral-900 border border-neutral-700 text-white text-xs px-2.5 py-1.5 focus:outline-none focus:border-white cursor-pointer"
                >
                  {Object.keys(CURRENCY_CONFIG).map((code) => (
                    <option key={code} value={code}>
                      {CURRENCY_CONFIG[code as CurrencyCode].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Col 2: Shop Categories (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white mb-3 sm:mb-4">
                SHOP CATEGORIES
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('ALL');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Men
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('T-SHIRTS');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    T-Shirts
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('SHIRTS');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Shirts
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('JEANS');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Jeans
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('TROUSERS');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Trousers
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('JACKETS');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Jackets
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Info & Support (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white mb-3 sm:mb-4">
                INFO &amp; SUPPORT
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenShopifyAdmin('ADMIN')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenShopifyAdmin('ADMIN')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Returns &amp; Exchanges
                  </button>
                </li>
                <li>
                  <span className="text-neutral-400">Shipping Information</span>
                </li>
                <li>
                  <span className="text-neutral-400">FAQs</span>
                </li>
                <li>
                  <span className="text-neutral-400">Size Guide</span>
                </li>
                <li>
                  <span className="text-neutral-400">Contact Support</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Quick Links (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white mb-3 sm:mb-4">
                QUICK LINKS
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <span className="text-neutral-400">About Us</span>
                </li>
                <li>
                  <span className="text-neutral-400">Terms &amp; Conditions</span>
                </li>
                <li>
                  <span className="text-neutral-400">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-neutral-400">Warranty</span>
                </li>
                <li>
                  <span className="text-neutral-400">Blog</span>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenStoresModal}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Offline Stores
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: Join The Novaire Club (3 cols) */}
            <div className="lg:col-span-3">
              <h4 className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white mb-3 sm:mb-4">
                JOIN THE NOVAIRE CLUB
              </h4>
              <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                Get 15% off and first dibs on drops, exclusive offers, and style updates.
              </p>

              {!subscribed ? (
                <form onSubmit={handleSubscribe} noValidate className="space-y-2">
                  <div className="flex w-full">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="Enter your email"
                      className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe to newsletter"
                      className="bg-white text-[#111111] px-3.5 py-2 text-xs font-bold uppercase hover:bg-neutral-200 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {emailError && (
                    <p role="alert" className="text-[11px] text-[#E85D3F]">
                      {emailError}
                    </p>
                  )}
                </form>
              ) : (
                <div className="p-3 bg-neutral-900 border border-neutral-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Welcome to the Novaire Club!</span>
                  </div>
                  <p className="text-[10px] text-neutral-300">
                    Use code <span className="font-bold text-white bg-neutral-800 px-1 py-0.2">NOVA15</span> for 15% OFF.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="border-t border-neutral-800 bg-[#0B0B0B]">
          <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
            <p>© 2026 NOVAIRE. All rights reserved.</p>
            <div className="flex items-center gap-3 text-[10px] font-mono-code text-neutral-400">
              <span className="border border-neutral-800 px-2 py-0.5 rounded bg-neutral-900">VISA</span>
              <span className="border border-neutral-800 px-2 py-0.5 rounded bg-neutral-900">Mastercard</span>
              <span className="border border-neutral-800 px-2 py-0.5 rounded bg-neutral-900">RuPay</span>
              <span className="border border-neutral-800 px-2 py-0.5 rounded bg-neutral-900">UPI</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom-Right Action Controls */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="w-8 h-8 bg-[#B45309] hover:bg-[#92400E] text-white shadow-md flex items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer rounded-sm"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={onOpenStoresModal}
          aria-label="View Novaire Offline Stores and POD Hubs"
          className="bg-white hover:bg-neutral-50 text-[#111111] border border-neutral-200 shadow-lg rounded-xl px-2.5 py-1.5 flex flex-col items-center justify-center gap-0.5 transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Store className="w-3.5 h-3.5 stroke-[1.75] text-[#111111]" />
          <span className="text-[9.5px] font-medium text-[#111111] leading-none">
            Stores
          </span>
        </button>
      </div>
    </>
  );
};
