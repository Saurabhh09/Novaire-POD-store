import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  type CategoryFilter,
  type EditorialCollection,
} from '../utils/storeLogic';

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
  { id: 'POLOS', label: 'POLOS', image: '/assets/nova/cat-polos.png' },
  {
    id: 'PLUS SIZE',
    label: 'PLUS SIZE',
    badge: 'SIZES XXL TO 5XL',
    image: '/assets/nova/cat-plus-size.png',
  },
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

  return (
    <div id="top" className="w-full bg-white">
      {/* 1. HERO BANNER CAROUSEL */}
      <section
        aria-label="Featured Campaign Carousel"
        className="max-w-[1800px] mx-auto px-3 sm:px-7 pt-2 pb-6"
      >
        <div className="relative w-full overflow-hidden bg-[#EBEDF0] select-none group">
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
              aria-label="Shop The Flannel Edit Collection"
              className="relative w-full cursor-pointer"
            >
              <img
                src="/assets/nova/hero-flannel.png"
                alt="The Flannel Edit — Novaire Studio Menswear Campaign"
                referrerPolicy="no-referrer"
                className="w-full h-auto block object-cover"
              />
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
              className="relative w-full aspect-[1767/836] bg-[#EAECEF] flex items-center justify-between px-6 sm:px-16 lg:px-28 cursor-pointer overflow-hidden"
            >
              <img
                src="/assets/nova/hero-model-left.png"
                alt="Novaire Full Look Model"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain hidden sm:block"
              />
              <div className="flex flex-col items-start justify-center z-10 mx-auto sm:mx-0">
                <span className="font-sans-ui text-xl sm:text-4xl lg:text-[52px] font-light tracking-[0.08em] text-[#111111] leading-none mb-1">
                  THE
                </span>
                <div className="border-[1.5px] border-[#111111] px-3 sm:px-5 py-1 sm:py-2 my-1">
                  <span className="font-sans-ui text-2xl sm:text-5xl lg:text-[64px] font-normal tracking-[0.06em] text-[#111111] leading-none">
                    CUSTOM POD
                  </span>
                </div>
                <span className="font-sans-ui text-xl sm:text-4xl lg:text-[52px] font-light tracking-[0.08em] text-[#111111] leading-none mt-1">
                  STUDIO
                </span>
                <span className="mt-4 inline-block bg-[#111111] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] px-4 py-2">
                  DESIGN YOUR GARMENT →
                </span>
              </div>
              <img
                src="/assets/nova/hero-model-right.png"
                alt="Novaire Close-Up Flannel Model"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain"
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
              className="relative w-full aspect-[1767/836] bg-[#EAECEF] flex items-center justify-between px-6 sm:px-16 lg:px-28 cursor-pointer overflow-hidden"
            >
              <img
                src="/assets/nova/hero-model-left.png"
                alt="Novaire Menswear Model"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain hidden sm:block"
              />
              <div className="flex flex-col items-start justify-center z-10 mx-auto sm:mx-0">
                <span className="font-sans-ui text-xl sm:text-4xl lg:text-[52px] font-light tracking-[0.08em] text-[#111111] leading-none mb-1">
                  THE
                </span>
                <div className="border-[1.5px] border-[#111111] px-3 sm:px-5 py-1 sm:py-2 my-1">
                  <span className="font-sans-ui text-2xl sm:text-5xl lg:text-[64px] font-normal tracking-[0.06em] text-[#111111] leading-none">
                    KNITWEAR
                  </span>
                </div>
                <span className="font-sans-ui text-xl sm:text-4xl lg:text-[52px] font-light tracking-[0.08em] text-[#111111] leading-none mt-1">
                  ARCHIVE
                </span>
                <span className="mt-4 inline-block bg-[#111111] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] px-4 py-2">
                  EXPLORE 260 GSM KNITS →
                </span>
              </div>
              <img
                src="/assets/nova/hero-model-right.png"
                alt="Novaire Menswear Close-up"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain"
              />
            </div>
          )}

          {/* Left & Right Carousel Arrows matching reference image */}
          <button
            type="button"
            onClick={handleHeroPrev}
            aria-label="Previous campaign slide"
            className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-neutral-600 hover:text-[#111111] bg-[#EBEDF0] hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleHeroNext}
            aria-label="Next campaign slide"
            className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-neutral-600 hover:text-[#111111] bg-[#EBEDF0] hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section
        aria-label="Shop By Category"
        className="max-w-[1800px] mx-auto px-4 sm:px-8 pt-1 pb-6"
      >
        {/* Heading: SHOP BY / CATEGORY with extending bottom line */}
        <div className="mb-5">
          <p className="text-lg sm:text-[21px] font-light tracking-[0.04em] uppercase text-[#222222] leading-tight">
            SHOP BY
          </p>
          <div className="flex items-end">
            <h2 className="text-xl sm:text-[23px] font-bold tracking-[0.03em] uppercase text-[#111111] leading-none">
              CATEGORY
            </h2>
          </div>
          <div className="w-44 sm:w-52 h-[1.5px] bg-[#111111] mt-1.5" />
        </div>

        {/* 5 Category Cutouts Row */}
        <div className="relative flex items-center justify-between gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 w-full max-w-[1620px] mx-auto items-end">
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
                  className="group flex flex-col items-center text-center focus:outline-none cursor-pointer"
                >
                  {/* Category Header + Optional SIZES XXL TO 5XL Box */}
                  <div className="flex items-center justify-center gap-2 mb-3 min-h-[24px]">
                    <span className="text-xs sm:text-[14px] font-bold tracking-[0.04em] uppercase text-[#111111] group-hover:text-neutral-600 transition-colors whitespace-nowrap">
                      {cat.label}
                    </span>
                    {cat.badge && (
                      <span className="text-[8px] font-medium tracking-wider uppercase text-neutral-500 border border-neutral-300 px-1.5 py-0.5 whitespace-nowrap">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  {/* Floating Cutout Image */}
                  <div className="h-36 sm:h-44 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      referrerPolicy="no-referrer"
                      className="max-h-full w-auto object-contain"
                    />
                  </div>

                  {/* SHOP ALL Underline Indicator */}
                  <div className="h-6 mt-2 flex items-center justify-center">
                    <span
                      className={`text-[10px] font-semibold tracking-[0.08em] uppercase transition-opacity ${
                        isSelected
                          ? 'text-[#111111] underline underline-offset-4 decoration-[#111111] opacity-100'
                          : 'text-neutral-500 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      SHOP ALL
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button matching reference image */}
          <button
            type="button"
            onClick={() => {
              const order: CategoryFilter[] = [
                'JEANS',
                'SWEATERS',
                'JACKETS',
                'POLOS',
                'PLUS SIZE',
              ];
              const nextIdx =
                (order.indexOf(selectedCatHighlight) + 1) % order.length;
              const nextCat = order[nextIdx];
              setSelectedCatHighlight(nextCat);
              onSelectCategory(nextCat);
            }}
            aria-label="Cycle next category"
            className="hidden lg:flex w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 items-center justify-center text-[#111111] shrink-0 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. LAST FEW BESTSELLERS LEFT — UP TO 30% OFF BANNER */}
      <section
        aria-label="Last Few Bestsellers Left Promotion"
        className="max-w-[1800px] mx-auto px-3 sm:px-7 pb-4"
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
          aria-label="Filter Bestsellers Up To 30% Off"
          className="relative w-full overflow-hidden bg-[#ECEEEF] cursor-pointer group"
        >
          <img
            src="/assets/nova/bestsellers-banner.png"
            alt="Last Few Bestsellers Left — Up To 30% Off"
            referrerPolicy="no-referrer"
            className="w-full h-auto block object-cover group-hover:scale-[1.005] transition-transform duration-300"
          />
        </div>
      </section>

      {/* 4. THREE-COLUMN EDITORIAL FEATURE GRID */}
      <section
        aria-label="Curated Shirt Collections"
        className="max-w-[1800px] mx-auto px-3 sm:px-7 pb-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 sm:gap-2">
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
            className="relative overflow-hidden cursor-pointer group"
          >
            <img
              src="/assets/nova/editorial-formal.png"
              alt="Formal Shirts — For Days That Mean Business"
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
            aria-label="Hand Embroidered — Texture That Does The Talking"
            className="relative overflow-hidden cursor-pointer group"
          >
            <img
              src="/assets/nova/editorial-embroidered.png"
              alt="Hand Embroidered — Texture That Does The Talking"
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
            aria-label="Jacquard Shirts — Woven Patterns Rich Texture"
            className="relative overflow-hidden cursor-pointer group"
          >
            <img
              src="/assets/nova/editorial-jacquard.png"
              alt="Jacquard Shirts — Woven Patterns Rich Texture"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-cover group-hover:scale-[1.015] transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* 5. FOUR-TILE COMPACT PROMO STRIP */}
      <section
        aria-label="Bundle Offers and Accessories"
        className="max-w-[1160px] mx-auto px-3 sm:px-6 pb-8"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              onSelectEditorial(
                activeEditorial === 'BUNDLE_BOTTOMWEAR' ? 'ALL' : 'BUNDLE_BOTTOMWEAR'
              );
              scrollToCatalog();
            }}
            aria-label="2 Bottom Wear for ₹2899"
            className="overflow-hidden cursor-pointer group focus:outline-none"
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
            className="overflow-hidden cursor-pointer group focus:outline-none"
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
            className="overflow-hidden cursor-pointer group focus:outline-none"
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
            className="overflow-hidden cursor-pointer group focus:outline-none"
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
