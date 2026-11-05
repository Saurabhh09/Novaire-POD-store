import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { type CategoryFilter } from '../utils/storeLogic';

interface SeoDirectorySectionProps {
  onSelectCategory: (cat: CategoryFilter) => void;
  onQuickSearch: (term: string) => void;
}

const TOP_CATEGORIES_GRID: { label: string; category?: CategoryFilter; search?: string }[][] = [
  [
    { label: 'T-shirts', category: 'T-SHIRTS' },
    { label: 'Bags', search: 'Jacket' },
    { label: 'Co-ords', search: 'Sweater' },
    { label: 'Shoes', category: 'SHOES' },
  ],
  [
    { label: 'Shirts', category: 'SHIRTS' },
    { label: 'Accessories', search: 'Luxe' },
    { label: 'Hoodies', category: 'HOODIES' },
    { label: 'Sunglasses', search: 'Slim' },
  ],
  [
    { label: 'Joggers', category: 'TROUSERS' },
    { label: 'Belts', search: 'Leather' },
    { label: 'Jackets', category: 'JACKETS' },
  ],
  [
    { label: 'Shorts', category: 'TROUSERS' },
    { label: 'Blazers', category: 'JACKETS' },
    { label: 'Jeans', category: 'JEANS' },
  ],
  [
    { label: 'Trousers', category: 'TROUSERS' },
    { label: 'Boxers', search: 'Cotton' },
    { label: 'Night Suit & Pyjamas', search: 'Linen' },
  ],
  [
    { label: 'Sweatshirts & Hoodies', category: 'SWEATERS' },
    { label: 'Cargo Pants', category: 'TROUSERS' },
    { label: 'Overshirt', search: 'Felt' },
  ],
  [
    { label: 'Sweaters', category: 'SWEATERS' },
    { label: 'Chinos', category: 'TROUSERS' },
    { label: 'Perfumes', search: 'Cotton' },
  ],
];

const POPULAR_SEARCHES_GRID: string[][] = [
  [
    'shirts for men',
    'straight fit jeans',
    'formal shirts',
    'bootcut jeans for men',
    'korean trousers',
    'sling bag for men',
  ],
  [
    'jeans for men',
    'bootcut jeans',
    'crochet shirts',
    'office wear shirts',
    'baggy pants men',
    'cotton shirts for men',
  ],
  [
    'trousers for men',
    'korean pants',
    'striped shirts',
    'korean pants for men',
    'linen pants',
    'cotton shirts for men',
  ],
  [
    'white shirt',
    'gurkha pants',
    'printed shirts',
    'sunglasses for men',
    'chinos for men',
    'kurta for men',
  ],
  [
    'black shirt',
    'cargo pants',
    'formal pants for men',
    'perfume for men',
    'striped shirt men',
  ],
  [
    'overshirt men',
    'linen shirts',
    'concert outfits men',
    'polo t-shirts',
    'embroidery shirt men',
  ],
  [
    'baggy jeans',
    'denim shirts',
    'club wear for men',
    'oversized t-shirts',
    'chelsea boots men',
  ],
];

const POPULAR_ACCESSORIES_GRID: string[][] = [
  [
    'Ravenwood Braided Bracelet',
    'Divine Skull Cross Chain',
    'Debonair Black Bracelet',
    'Abstract Trio Metal Bracelet',
    'Racer Wrap Black Bracelet',
    'Bullet Shell Cross Pendant',
    'Wisewolf Boho Brown Bracelet',
  ],
  [
    'EternalWrap Black Bracelet',
    'Bar of Luxe Chain',
    'Solid Block SS Chain',
    'Battle Square Chain',
    'Mafia SS Chain',
    'Grey Cuboid SS Chain',
  ],
  [
    'Obsidian Blue Braided Bracelet',
    'Rogue Bullet Pendant',
    'HipHopNoir Woven Braided Bracelet',
    'Blacksmith Nail Braided Bracelet',
    'Noir Nautical-Edge Braided Bracelet',
    'Midnight Eclipse Braid Bracelet',
  ],
  [
    'Rustic Rawhide Brown Braided Bracelet',
    "Pirate's Anchor Steel Chain",
    'Metal Mesh Trio Bracelet',
    'Duo Gold & Silver SS Chain',
    'Hexa Beads Bracelet',
    'Black Cuboid SS Chain',
  ],
];

export const SeoDirectorySection: React.FC<SeoDirectorySectionProps> = ({
  onSelectCategory,
  onQuickSearch,
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleSearchTerm = (term: string) => {
    const firstKeyword = term.split(' ')[0];
    onQuickSearch(firstKeyword);
    const el = document.getElementById('trending-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      aria-label="More about shopping at Novaire for men"
      className="max-w-[1720px] mx-auto px-4 sm:px-8 my-8"
    >
      <div className="bg-[#F6F1EB] px-6 sm:px-10 py-7 border border-[#EAE2D7]">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-[13px] font-bold text-[#111111]">
            More about shopping At Novaire for men
          </h2>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label="Toggle store directory details"
            className="p-1 text-neutral-600 hover:text-[#111111] cursor-pointer"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-5 space-y-6 text-[10.5px] leading-[1.65] text-[#333333]">
            {/* TOP CATEGORIES */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                TOP CATEGORIES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {TOP_CATEGORIES_GRID.map((col, cIdx) => (
                  <ul key={cIdx} className="space-y-0.5">
                    {col.map((item, iIdx) => (
                      <li key={iIdx}>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.category) {
                              onSelectCategory(item.category);
                            } else if (item.search) {
                              onQuickSearch(item.search);
                            }
                            const el = document.getElementById('trending-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-left text-[#444444] hover:text-[#111111] hover:underline cursor-pointer"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {/* POPULAR SEARCHES */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                POPULAR SEARCHES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {POPULAR_SEARCHES_GRID.map((col, cIdx) => (
                  <ul key={cIdx} className="space-y-0.5">
                    {col.map((term, tIdx) => (
                      <li key={tIdx}>
                        <button
                          type="button"
                          onClick={() => handleSearchTerm(term)}
                          className="text-left text-[#444444] hover:text-[#111111] hover:underline cursor-pointer"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {/* MOST POPULAR ACCESSORIES */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                MOST POPULAR ACCESSORIES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
                {POPULAR_ACCESSORIES_GRID.map((col, cIdx) => (
                  <ul key={cIdx} className="space-y-0.5">
                    {col.map((acc, aIdx) => (
                      <li key={aIdx}>
                        <button
                          type="button"
                          onClick={() => onSelectCategory('ALL')}
                          className="text-left text-[#444444] hover:text-[#111111] hover:underline cursor-pointer"
                        >
                          {acc}
                        </button>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {/* Editorial Description matching reference */}
            <div className="pt-2 space-y-2.5 max-w-6xl">
              <h3 className="text-sm font-semibold text-[#222222]">
                The NOVAIRE Shopping Experience - Where Digital Meets Style
              </h3>
              <p className="text-[11px] text-[#555555]">
                At NOVAIRE, we redefine the modern print-on-demand and menswear shopping experience, merging seamless Shopify digital convenience with custom atelier craftsmanship. Whether you&apos;re customizing a single heavyweight flannel or ordering global streetwear drops, we ensure a smooth, stylish, and zero-waste journey tailored for today&apos;s fashion-forward men.
              </p>
              <p className="text-[11px] text-[#555555]">
                Our direct-to-consumer (D2C) print-on-demand architecture eliminates traditional retail overproduction, giving you complete control over how and where you engage with our trend-driven menswear collections. From effortless online browsing to live DTG &amp; embroidery customization, NOVAIRE lets you shop on your terms, at your pace.
              </p>

              <h4 className="text-xs font-semibold text-[#333333] pt-1">
                Shop Anytime, Anywhere – The Digital Shopping Experience
              </h4>
              <p className="text-[11px] text-[#555555]">
                <strong className="text-[#111111]">1. 24/7 Accessibility – Fashion at Your Fingertips:</strong> Gone are the days of restrictive store hours. NOVAIRE&apos;s Shopify-powered storefront allows you to browse, customize, and purchase from our curated menswear collections anytime, anywhere. Whether you&apos;re searching for sharp formalwear, brushed check flannels, or custom-embroidered knitwear, our website provides an intuitive, fast, and stylish experience.
              </p>
              <div className="text-[11px] text-[#555555]">
                <p className="font-semibold text-[#111111] mb-1">
                  Key Features of NOVAIRE Online Shopping:
                </p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>
                    <strong className="text-[#222222]">✓ User-Friendly Navigation</strong> – Explore categories effortlessly, from heavyweight flannels and polo sweaters to wide-leg denim and outerwear.
                  </li>
                  <li>
                    <strong className="text-[#222222]">✓ On-Demand Customization Studio</strong> – Personalize garments with DTG HD graphics, puff ink, or 3D satin embroidery before checkout.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
