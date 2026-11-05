import React, { useState } from 'react';
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  User,
  X,
  Sparkles,
  Code2,
  Package,
  SlidersHorizontal,
  ArrowRight,
  Globe,
} from 'lucide-react';
import {
  type CategoryFilter,
  type CurrencyCode,
  CURRENCY_CONFIG,
} from '../utils/storeLogic';

interface HeaderProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenShopifyAdmin: (initialTab?: 'STACK' | 'ADMIN' | 'LIQUID') => void;
  onOpenPodStudio: () => void;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenShopifyAdmin,
  onOpenPodStudio,
  currency,
  onCurrencyChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navCategories: CategoryFilter[] = [
    'ALL',
    'SHIRTS',
    'SWEATERS',
    'JACKETS',
    'JEANS',
    'TROUSERS',
    'POLOS',
    'HOODIES',
    'PLUS SIZE',
  ];

  const handleCategoryClick = (cat: CategoryFilter) => {
    onSelectCategory(cat);
    setMenuOpen(false);
    const el = document.getElementById('trending-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 transition-colors">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left Zone: Hamburger Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-2 text-[#111111] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 stroke-[1.75]" />
            </button>
            <button
              type="button"
              onClick={onOpenPodStudio}
              className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#111111] hover:text-neutral-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>POD Custom Studio</span>
            </button>
          </div>

          {/* Center Zone: Brand Wordmark matching reference SNITCH stencil/geometric aesthetic */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('ALL');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-2xl sm:text-[28px] font-bold tracking-[0.18em] uppercase text-[#111111] whitespace-nowrap shrink-0 select-none"
          >
            NOVAIRE
          </a>

          {/* Right Zone: Search, Bag, Wishlist, Account/Shopify Admin */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Global Currency Switcher */}
            <div className="hidden md:flex items-center mr-1">
              <label htmlFor="currency-select" className="sr-only">
                Select Currency
              </label>
              <select
                id="currency-select"
                aria-label="Select Currency"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="text-[11px] font-medium tracking-wider uppercase bg-neutral-100 hover:bg-neutral-200/80 text-[#111111] rounded px-2 py-1 border border-transparent focus:border-neutral-400 focus:outline-none cursor-pointer"
              >
                {Object.keys(CURRENCY_CONFIG).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCY_CONFIG[code as CurrencyCode].label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Toggle product search"
              className="p-2 text-[#111111] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.75]" />
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative p-2 text-[#111111] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#111111] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Wishlist with ${wishlistCount} saved items`}
              className="relative p-2 text-[#111111] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#E85D3F] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenShopifyAdmin('ADMIN')}
              aria-label="Shopify Admin and Liquid Architecture"
              title="Shopify Admin & Liquid Theme Studio"
              className="p-2 text-[#111111] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
            >
              <User className="w-[18px] h-[18px] stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 sm:px-8 py-3 animate-fade-slide">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Novaire catalog (e.g., Flannel, Polo Sweater, Baggy Jeans, Leather Jacket, SKU)..."
                aria-label="Search Novaire catalog"
                className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs sm:text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#111111]"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-xs font-medium text-neutral-500 hover:text-[#111111] whitespace-nowrap cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search bar"
                className="p-1.5 text-neutral-500 hover:text-[#111111] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Left Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            aria-label="Store navigation drawer"
            className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-fade-slide"
          >
            <div>
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <span className="font-display text-2xl font-bold tracking-[0.18em] uppercase">
                  NOVAIRE
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-neutral-500 hover:text-[#111111] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* POD Highlight Action */}
              <div className="p-5 bg-[#F5F5F3] border-b border-neutral-200">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-1">
                  GLOBAL PRINT-ON-DEMAND
                </p>
                <p className="text-xs text-neutral-700 mb-3 leading-relaxed">
                  Customize any shirt, flannel, hoodie, or jacket with DTG HD print, puff ink, or 3D satin embroidery.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPodStudio();
                  }}
                  className="w-full py-2.5 px-4 bg-[#111111] text-white text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch POD Customizer</span>
                </button>
              </div>

              {/* Categories List */}
              <div className="px-6 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 mb-3">
                  SHOP BY CATEGORY
                </p>
                <ul className="space-y-1">
                  {navCategories.map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left py-2 px-2.5 text-xs font-semibold tracking-wider uppercase flex items-center justify-between transition-colors cursor-pointer ${
                          activeCategory === cat
                            ? 'bg-[#111111] text-white'
                            : 'text-[#111111] hover:bg-neutral-100'
                        }`}
                      >
                        <span>{cat}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shopify & Tech Flow Shortcuts */}
              <div className="px-6 py-4 border-t border-neutral-200">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 mb-3">
                  SHOPIFY OS 2.0 INTEGRATION
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenShopifyAdmin('ADMIN');
                    }}
                    className="w-full py-2 px-3 border border-neutral-300 text-left text-xs font-medium text-[#111111] hover:border-[#111111] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-neutral-600" />
                    <span>Shopify Admin (Products & Orders)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenShopifyAdmin('LIQUID');
                    }}
                    className="w-full py-2 px-3 border border-neutral-300 text-left text-xs font-medium text-[#111111] hover:border-[#111111] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Code2 className="w-4 h-4 text-neutral-600" />
                    <span>Liquid & JSON Templates</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenShopifyAdmin('STACK');
                    }}
                    className="w-full py-2 px-3 border border-neutral-300 text-left text-xs font-medium text-[#111111] hover:border-[#111111] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-neutral-600" />
                    <span>Technical Stack Architecture</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Currency Switcher in Drawer Footer */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <label
                htmlFor="drawer-currency"
                className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5"
              >
                GLOBAL CHECKOUT CURRENCY
              </label>
              <select
                id="drawer-currency"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs font-semibold text-[#111111]"
              >
                {Object.keys(CURRENCY_CONFIG).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCY_CONFIG[code as CurrencyCode].label}
                  </option>
                ))}
              </select>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
