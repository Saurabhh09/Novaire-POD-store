import React, { useState } from 'react';
import {
  ArrowUp,
  Store,
  Truck,
  ShieldCheck,
  Printer,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Code2,
  Package,
  SlidersHorizontal,
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
      <footer className="bg-[#111111] text-white mt-14 border-t border-neutral-800">
        {/* Top Value & POD Fulfillment Guarantee Strip */}
        <div className="border-b border-neutral-800 bg-[#181818]">
          <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <Printer className="w-5 h-5 text-[#E85D3F] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                  ON-DEMAND ATELIER PRINT
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Custom DTG HD prints, puff screen ink &amp; 3D satin embroidery crafted to order.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Truck className="w-5 h-5 text-[#E85D3F] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                  48-HOUR GLOBAL DISPATCH
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Free express shipping on orders above ₹1999 across India, US, UK &amp; EU hubs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-[#E85D3F] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                  240–320 GSM HEAVYWEIGHT
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  100% combed compact-spun cotton, brushed check flannels &amp; merino-touch knits.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <RefreshCw className="w-5 h-5 text-[#E85D3F] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                  14-DAY EASY EXCHANGES
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Instant size exchanges and Shopify-backed buyer protection on every order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main 5-Column Editorial Footer */}
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Col 1: Brand Identity (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-block font-display text-3xl font-bold tracking-[0.2em] uppercase text-white"
              >
                NOVAIRE
              </a>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                Global Print-on-Demand &amp; Contemporary Menswear Studio. Integrated with Shopify OS 2.0 for bespoke apparel customization, zero-inventory waste, and architectural everyday silhouettes.
              </p>

              <div className="pt-2">
                <label
                  htmlFor="footer-currency"
                  className="block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 mb-1.5"
                >
                  STOREFRONT CURRENCY
                </label>
                <select
                  id="footer-currency"
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                  className="bg-neutral-900 border border-neutral-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-white cursor-pointer"
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
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white mb-4">
                SHOP CATEGORIES
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEditorial('FLANNEL_EDIT');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    The Flannel Edit
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
                    Formal &amp; Stretch Shirts
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('SWEATERS');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Elevated Polo Sweaters
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
                    Jackets &amp; Tweed Overshirts
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
                    Baggy &amp; Straight Fit Jeans
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('PLUS SIZE');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Plus Size (XXL to 5XL)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Print-on-Demand & Shopify Architecture (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white mb-4">
                POD &amp; SHOPIFY
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <button
                    type="button"
                    onClick={onOpenPodStudio}
                    className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#E85D3F]" />
                    <span>Custom POD Design Lab</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenShopifyAdmin('ADMIN')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Shopify Admin &amp; Orders</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenShopifyAdmin('LIQUID')}
                    className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Liquid &amp; JSON Templates</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenShopifyAdmin('STACK')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Shopify CLI Workflow
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEditorial('HAND_EMBROIDERED');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    3D Satin Embroidery Edit
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenStoresModal}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Global Fulfillment Studios
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Customer Support (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white mb-4">
                CLIENT CARE
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
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
                    onClick={() => {
                      onSelectEditorial('BESTSELLERS_SALE');
                      scrollToCatalog();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Bestsellers Archive (30% Off)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenStoresModal}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Offline Experience Stores
                  </button>
                </li>
                <li>
                  <span className="text-neutral-500">care@novaire.studio</span>
                </li>
                <li>
                  <span className="text-neutral-500 font-mono-code">+91 80 4568 2026</span>
                </li>
              </ul>
            </div>

            {/* Col 5: Newsletter Signup (3 cols) */}
            <div className="lg:col-span-3">
              <h4 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white mb-4">
                JOIN THE NOVAIRE CLUB
              </h4>
              <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                Subscribe for early access to limited flannel drops, custom embroidery releases, and an instant <strong className="text-white">15% OFF</strong> welcome code.
              </p>

              {!subscribed ? (
                <form onSubmit={handleSubscribe} noValidate className="space-y-2">
                  <div className="flex">
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
                      placeholder="Enter your email address"
                      className="w-full bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe to newsletter"
                      className="bg-white text-[#111111] px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <span>JOIN</span>
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
                <div className="p-3.5 bg-neutral-900 border border-neutral-700 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Welcome to the Novaire Club!</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Use promo code{' '}
                    <span className="font-mono-code font-bold text-white bg-neutral-800 px-1.5 py-0.5">
                      NOVA15
                    </span>{' '}
                    at Shopify Checkout for 15% OFF.
                  </p>
                </div>
              )}

              {/* Payment & Trust Row */}
              <div className="mt-6 pt-5 border-t border-neutral-800">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-2">
                  SHOPIFY CHECKOUT · GLOBAL PAYMENTS
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-code text-neutral-300">
                  <span className="border border-neutral-700 px-2 py-0.5">SHOP PAY</span>
                  <span className="border border-neutral-700 px-2 py-0.5">VISA / MC</span>
                  <span className="border border-neutral-700 px-2 py-0.5">UPI</span>
                  <span className="border border-neutral-700 px-2 py-0.5">APPLE PAY</span>
                  <span className="border border-neutral-700 px-2 py-0.5">COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Technical Architecture Bar */}
        <div className="border-t border-neutral-800 bg-[#0B0B0B]">
          <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <p>
              © {new Date().getFullYear()} NOVAIRE APPAREL STUDIO. ALL RIGHTS RESERVED. POWERED BY SHOPIFY OS 2.0 &amp; LIQUID.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onOpenShopifyAdmin('STACK')}
                className="text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                HTML5 · CSS3 · JS · Liquid · JSON · Lucide · Shopify CLI Stack
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom-Right Action Controls matching reference image */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="w-8 h-8 bg-[#E85D3F] hover:bg-[#d14c2f] text-white shadow-md flex items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={onOpenStoresModal}
          aria-label="View Novaire Offline Stores and POD Hubs"
          className="bg-white hover:bg-neutral-50 text-[#111111] border border-neutral-200 shadow-lg rounded-xl px-3 py-2 flex flex-col items-center justify-center gap-0.5 transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Store className="w-4 h-4 stroke-[1.75] text-[#111111]" />
          <span className="text-[10px] font-medium text-[#111111] leading-none">
            Stores
          </span>
        </button>
      </div>
    </>
  );
};
