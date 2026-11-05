import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import {
  type CategoryFilter,
  type EditorialCollection,
} from '../utils/storeLogic';
import {
  GlowingDiya,
  DiyaWithMarigold,
  DiwaliMandala,
} from './DiwaliThemeDecorations';

interface HeroAndBannersProps {
  activeCategory: CategoryFilter;
  activeEditorial: EditorialCollection;
  onSelectCategory: (cat: CategoryFilter) => void;
  onSelectEditorial: (ed: EditorialCollection) => void;
  onOpenPodStudio: () => void;
}

const CATEGORY_SHOWCASE: {
  id: CategoryFilter;
  label: string;
  badge?: string;
  image: string;
}[] = [
  { id: 'JEANS', label: 'JEANS', image: '/assets/nova/cat-jeans.png' },
  { id: 'SWEATERS', label: 'SWEATERS', image: '/assets/nova/cat-sweaters.png' },
  { id: 'JACKETS', label: 'JACKETS', image: '/assets/nova/cat-jackets.png' },
  { id: 'POLOS', label: 'POLO TEE', image: '/assets/nova/cat-polos.png' },
  {
    id: 'PLUS SIZE',
    label: 'FULL SLEEVE',
    badge: 'FESTIVE FIT',
    image: '/assets/nova/cat-plus-size.png',
  },
  { id: 'T-SHIRTS', label: 'T-SHIRTS', image: '/assets/nova/cat-polos.png' },
];

export const HeroAndBanners: React.FC<HeroAndBannersProps> = ({
  activeCategory,
  activeEditorial,
  onSelectCategory,
  onSelectEditorial,
  onOpenPodStudio,
}) => {
  const [heroSlide, setHeroSlide] = useState(0);
  const [selectedCatHighlight, setSelectedCatHighlight] = useState<CategoryFilter>('JEANS');
  const catScrollRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    const el = document.getElementById('trending-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHeroPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeroSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleHeroNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeroSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (catScrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      catScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="w-full bg-[#FAF7F2]">
      {/* 1. HERO BANNER CAROUSEL (Diwali Festive Collection) */}
      <section
        aria-label="Featured Campaign Carousel"
        className="max-w-[1800px] mx-auto px-2 sm:px-6 md:px-8 pt-2 pb-5"
      >
        <div className="relative w-full overflow-hidden bg-[#ECE8E1] select-none group shadow-sm">
          {heroSlide === 0 && (
            <div
              onClick={() => {
                onSelectEditorial('FLANNEL_EDIT');
                scrollToCatalog();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectEditorial('FLANNEL_EDIT');
                  scrollToCatalog();
                }
              }}
              aria-label="Shop The Flannel Edit — Festive Collection"
              className="relative w-full cursor-pointer overflow-hidden"
            >
              {/* Festive ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-amber-700/15 pointer-events-none z-10" />

              {/* Base Hero Image */}
              <img
                src="/assets/nova/hero-flannel.png"
                alt="The Flannel Edit — Festive Collection"
                referrerPolicy="no-referrer"
                className="w-full h-auto block object-cover max-h-[640px]"
              />

              {/* "FESTIVE COLLECTION" Badge Overlay on Center Text */}
              <div className="absolute top-[52%] sm:top-[50%] left-[50%] sm:left-[58%] -translate-x-1/2 sm:-translate-x-0 z-20 pointer-events-none text-center sm:text-left">
                <span className="inline-block text-[9px] sm:text-xs md:text-sm font-semibold tracking-[0.24em] uppercase text-[#8C3A00] bg-[#FAF3E8]/90 px-2 sm:px-3 py-0.5 sm:py-1 border border-[#E8C29D] shadow-sm">
                  ✨ FESTIVE COLLECTION
                </span>
              </div>

              {/* Diwali Burning Diyas & Festive Warmth on Right Corner */}
              <div className="absolute bottom-2 sm:bottom-4 right-3 sm:right-10 z-20 hidden xs:flex items-end gap-2 pointer-events-none drop-shadow-md">
                <DiyaWithMarigold size={76} />
              </div>

              {/* Mobile Diya Badge at top right */}
              <div className="absolute top-2 right-2 z-20 xs:hidden pointer-events-none">
                <GlowingDiya size={42} />
              </div>
            </div>
          )}

          {heroSlide === 1 && (
            <div
              onClick={onOpenPodStudio}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onOpenPodStudio();
              }}
              aria-label="Launch Custom Print on Demand Studio"
              className="relative w-full aspect-[16/9] sm:aspect-[1767/780] bg-gradient-to-r from-[#EAE7E1] via-[#F2EFE9] to-[#EAE7E1] flex items-center justify-between px-4 sm:px-12 lg:px-24 cursor-pointer overflow-hidden"
            >
              <img
                src="/assets/nova/hero-model-left.png"
                alt="Novaire Full Look Model"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain hidden md:block"
              />
              <div className="flex flex-col items-center sm:items-start justify-center z-10 mx-auto sm:mx-0 text-center sm:text-left py-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B45309] mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>DIWALI ATELIER SPECIAL</span>
                </span>
                <span className="font-sans-ui text-lg sm:text-3xl lg:text-[46px] font-light tracking-[0.08em] text-[#111111] leading-none mb-1">
                  THE
                </span>
                <div className="border-[1.5px] border-[#111111] px-3 sm:px-5 py-1 sm:py-2 my-1 bg-[#FAF7F2]">
                  <span className="font-sans-ui text-xl sm:text-4xl lg:text-[56px] font-normal tracking-[0.06em] text-[#111111] leading-none">
                    CUSTOM POD
                  </span>
                </div>
                <span className="font-sans-ui text-lg sm:text-3xl lg:text-[46px] font-light tracking-[0.08em] text-[#111111] leading-none mt-1">
                  STUDIO
                </span>
                <span className="mt-3 sm:mt-4 inline-block bg-[#111111] text-white text-[9px] sm:text-xs font-semibold uppercase tracking-[0.18em] px-3 sm:px-4 py-1.5 sm:py-2">
                  DESIGN YOUR FESTIVE GARMENT →
                </span>
              </div>
              <img
                src="/assets/nova/hero-model-right.png"
                alt="Novaire Close-Up Flannel Model"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain hidden sm:block"
              />
            </div>
          )}

          {heroSlide === 2 && (
            <div
              onClick={() => {
                onSelectCategory('SWEATERS');
                scrollToCatalog();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectCategory('SWEATERS');
                  scrollToCatalog();
                }
              }}
              aria-label="Shop Heavyweight Knitwear Archive"
              className="relative w-full aspect-[16/9] sm:aspect-[1767/780] bg-gradient-to-r from-[#EAE7E1] via-[#F2EFE9] to-[#EAE7E1] flex items-center justify-between px-4 sm:px-12 lg:px-24 cursor-pointer overflow-hidden"
            >
              <img
                src="/assets/nova/hero-model-left.png"
                alt="Novaire Menswear Model"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain hidden md:block"
              />
              <div className="flex flex-col items-center sm:items-start justify-center z-10 mx-auto sm:mx-0 text-center sm:text-left py-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B45309] mb-1">
                  CELEBRATION ARCHIVE
                </span>
                <span className="font-sans-ui text-lg sm:text-3xl lg:text-[46px] font-light tracking-[0.08em] text-[#111111] leading-none mb-1">
                  THE
                </span>
                <div className="border-[1.5px] border-[#111111] px-3 sm:px-5 py-1 sm:py-2 my-1 bg-[#FAF7F2]">
                  <span className="font-sans-ui text-xl sm:text-4xl lg:text-[56px] font-normal tracking-[0.06em] text-[#111111] leading-none">
                    KNITWEAR
                  </span>
                </div>
                <span className="font-sans-ui text-lg sm:text-3xl lg:text-[46px] font-light tracking-[0.08em] text-[#111111] leading-none mt-1">
                  ARCHIVE
                </span>
                <span className="mt-3 sm:mt-4 inline-block bg-[#111111] text-white text-[9px] sm:text-xs font-semibold uppercase tracking-[0.18em] px-3 sm:px-4 py-1.5 sm:py-2">
                  EXPLORE 260 GSM KNITS →
                </span>
              </div>
              <img
                src="/assets/nova/hero-model-right.png"
                alt="Novaire Menswear Close-up"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain hidden sm:block"
              />
            </div>
          )}

          {/* Left & Right Carousel Arrows */}
          <button
            type="button"
            onClick={handleHeroPrev}
            aria-label="Previous campaign slide"
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-neutral-800 bg-[#FAF7F2]/90 hover:bg-white rounded-full shadow-md transition-all cursor-pointer z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleHeroNext}
            aria-label="Next campaign slide"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-neutral-800 bg-[#FAF7F2]/90 hover:bg-white rounded-full shadow-md transition-all cursor-pointer z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION (Responsive Horizontal Scroll matching Image 4) */}
      <section
        aria-label="Shop By Category"
        className="max-w-[1800px] mx-auto px-3 sm:px-6 md:px-8 pt-1 pb-6 w-full"
      >
        {/* Heading: SHOP BY / CATEGORY with extending bottom line */}
        <div className="mb-4 sm:mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm sm:text-lg font-light tracking-[0.04em] uppercase text-[#333333] leading-tight">
              SHOP BY
            </p>
            <h2 className="text-lg sm:text-[22px] font-bold tracking-[0.03em] uppercase text-[#111111] leading-none">
              CATEGORY
            </h2>
            <div className="w-36 sm:w-48 h-[1.5px] bg-[#111111] mt-1.5" />
          </div>

          {/* Scroll Controls for Categories */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              aria-label="Scroll categories left"
              className="w-7 h-7 rounded-full bg-[#EFE8DE] hover:bg-[#E5DDCF] flex items-center justify-center text-[#111111] cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              aria-label="Scroll categories right"
              className="w-7 h-7 rounded-full bg-[#EFE8DE] hover:bg-[#E5DDCF] flex items-center justify-center text-[#111111] cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsive Horizontal Strip of Categories matching Image 4 */}
        <div
          ref={catScrollRef}
          className="flex items-end gap-3 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-3 px-1 w-full"
        >
          {CATEGORY_SHOWCASE.map((cat) => {
            const isSelected =
              activeCategory === cat.id ||
              (activeCategory === 'ALL' && selectedCatHighlight === cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCatHighlight(cat.id);
                  onSelectCategory(cat.id);
                  scrollToCatalog();
                }}
                className="group flex flex-col items-center text-center focus:outline-none cursor-pointer shrink-0 snap-start min-w-[95px] sm:min-w-[125px] md:min-w-[145px] transition-transform duration-200"
              >
                {/* Category Header on top */}
                <div className="flex flex-col items-center justify-center mb-2 min-h-[26px]">
                  <span className="text-[11px] sm:text-[13px] font-bold tracking-[0.05em] uppercase text-[#111111] group-hover:text-[#B45309] transition-colors whitespace-nowrap">
                    {cat.label}
                  </span>
                  {cat.badge && (
                    <span className="text-[7.5px] font-medium tracking-wider uppercase text-[#B45309] border border-[#E8C29D] bg-[#FFF9F3] px-1 py-0.2 mt-0.5 whitespace-nowrap">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Floating Cutout Image */}
                <div className="h-28 sm:h-36 md:h-44 w-full flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1.5">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                  />
                </div>

                {/* SHOP ALL Underline Indicator */}
                <div className="h-5 mt-2 flex items-center justify-center">
                  <span
                    className={`text-[9.5px] sm:text-[10px] font-semibold tracking-[0.08em] uppercase transition-opacity ${
                      isSelected
                        ? 'text-[#111111] underline underline-offset-4 decoration-[#111111] opacity-100 font-bold'
                        : 'text-neutral-500 opacity-60 group-hover:opacity-100'
                    }`}
                  >
                    SHOP ALL
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. LAST FEW BESTSELLERS LEFT — UP TO 30% OFF BANNER (With Diwali Diya, Marigold, & Mandala) */}
      <section
        aria-label="Last Few Bestsellers Left Promotion"
        className="max-w-[1800px] mx-auto px-2 sm:px-6 md:px-8 pb-5"
      >
        <div
          onClick={() => {
            onSelectEditorial(
              activeEditorial === 'BESTSELLERS_SALE' ? 'ALL' : 'BESTSELLERS_SALE'
            );
            scrollToCatalog();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectEditorial('BESTSELLERS_SALE');
              scrollToCatalog();
            }
          }}
          aria-label="Filter Bestsellers Up To 30% Off — Diwali Special"
          className="relative w-full overflow-hidden bg-[#ECE8E1] cursor-pointer group shadow-sm border border-[#E5DFD4]"
        >
          {/* Base Bestsellers Banner Image */}
          <img
            src="/assets/nova/bestsellers-banner.png"
            alt="Last Few Bestsellers Left — Up To 30% Off"
            referrerPolicy="no-referrer"
            className="w-full h-auto block object-cover group-hover:scale-[1.008] transition-transform duration-300"
          />

          {/* Left Diwali Diya & Marigold Overlay matching Image 4 */}
          <div className="absolute bottom-2 sm:bottom-6 left-3 sm:left-8 z-10 pointer-events-none drop-shadow-lg">
            <DiyaWithMarigold size={72} />
          </div>

          {/* Right Golden Mandala Watermark Overlay matching Image 4 */}
          <div className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 z-10 pointer-events-none">
            <DiwaliMandala size={180} opacity={0.3} color="#D97706" />
          </div>
        </div>
      </section>

      {/* 4. THREE-COLUMN EDITORIAL FEATURE GRID (Diwali Festive Shirts) */}
      <section
        aria-label="Curated Shirt Collections"
        className="max-w-[1800px] mx-auto px-2 sm:px-6 md:px-8 pb-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
          {/* Card 1: FORMAL SHIRTS */}
          <div
            onClick={() => {
              onSelectEditorial(
                activeEditorial === 'FORMAL_SHIRTS' ? 'ALL' : 'FORMAL_SHIRTS'
              );
              scrollToCatalog();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectEditorial('FORMAL_SHIRTS');
                scrollToCatalog();
              }
            }}
            aria-label="Formal Shirts — For Days That Mean Business"
            className="relative overflow-hidden cursor-pointer group bg-[#ECE8E1] border border-[#E5DFD4]"
          >
            <img
              src="/assets/nova/editorial-formal.png"
              alt="Formal Shirts — Season Special"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-cover group-hover:scale-[1.015] transition-transform duration-300"
            />
          </div>

          {/* Card 2: HAND EMBROIDERED */}
          <div
            onClick={() => {
              onSelectEditorial(
                activeEditorial === 'HAND_EMBROIDERED' ? 'ALL' : 'HAND_EMBROIDERED'
              );
              scrollToCatalog();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectEditorial('HAND_EMBROIDERED');
                scrollToCatalog();
              }
            }}
            aria-label="Hand Embroidered — Celebration Suits & Shirts"
            className="relative overflow-hidden cursor-pointer group bg-[#ECE8E1] border border-[#E5DFD4]"
          >
            <img
              src="/assets/nova/editorial-embroidered.png"
              alt="Hand Embroidered — Celebration Suits & Shirts"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-cover group-hover:scale-[1.015] transition-transform duration-300"
            />
          </div>

          {/* Card 3: JACQUARD SHIRTS */}
          <div
            onClick={() => {
              onSelectEditorial(
                activeEditorial === 'JACQUARD_SHIRTS' ? 'ALL' : 'JACQUARD_SHIRTS'
              );
              scrollToCatalog();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectEditorial('JACQUARD_SHIRTS');
                scrollToCatalog();
              }
            }}
            aria-label="Jacquard Shirts — Festive Edit"
            className="relative overflow-hidden cursor-pointer group bg-[#ECE8E1] border border-[#E5DFD4] sm:col-span-2 md:col-span-1"
          >
            <img
              src="/assets/nova/editorial-jacquard.png"
              alt="Jacquard Shirts — Festive Edit"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-cover group-hover:scale-[1.015] transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* 5. FOUR-TILE COMPACT PROMO STRIP (2x2 on mobile, 4 in a row on tablet/desktop) */}
      <section
        aria-label="Bundle Offers and Accessories"
        className="max-w-[1240px] mx-auto px-2 sm:px-6 pb-7"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => {
              onSelectEditorial(
                activeEditorial === 'BUNDLE_BOTTOMWEAR' ? 'ALL' : 'BUNDLE_BOTTOMWEAR'
              );
              scrollToCatalog();
            }}
            aria-label="2 Bottom Wear for ₹2899"
            className="overflow-hidden cursor-pointer group focus:outline-none border border-[#E5DFD4] bg-[#ECE8E1]"
          >
            <img
              src="/assets/nova/promo-bottomwear.png"
              alt="2 Bottom Wear ₹2899"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-200"
            />
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectEditorial('BESTSELLERS_SALE');
              scrollToCatalog();
            }}
            aria-label="Perfumes 50% Off"
            className="overflow-hidden cursor-pointer group focus:outline-none border border-[#E5DFD4] bg-[#ECE8E1]"
          >
            <img
              src="/assets/nova/promo-perfumes.png"
              alt="Perfumes 50% Off"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-200"
            />
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectEditorial('BESTSELLERS_SALE');
              scrollToCatalog();
            }}
            aria-label="Sunglasses ₹999"
            className="overflow-hidden cursor-pointer group focus:outline-none border border-[#E5DFD4] bg-[#ECE8E1]"
          >
            <img
              src="/assets/nova/promo-sunglasses.png"
              alt="Sunglasses ₹999"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-200"
            />
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectEditorial(
                activeEditorial === 'BUNDLE_TOPWEAR' ? 'ALL' : 'BUNDLE_TOPWEAR'
              );
              scrollToCatalog();
            }}
            aria-label="3 Top Wear for ₹2699"
            className="overflow-hidden cursor-pointer group focus:outline-none border border-[#E5DFD4] bg-[#ECE8E1]"
          >
            <img
              src="/assets/nova/promo-topwear.png"
              alt="3 Top Wear ₹2699"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-200"
            />
          </button>
        </div>
      </section>
    </div>
  );
};
