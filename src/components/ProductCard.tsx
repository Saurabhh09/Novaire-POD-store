import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import {
  type Product,
  type CurrencyCode,
  formatPrice,
} from '../utils/storeLogic';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenProductModal: (product: Product, initialSwatch?: string) => void;
  onQuickAdd: (product: Product, swatch: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onOpenProductModal,
  onQuickAdd,
}) => {
  const [selectedSwatch, setSelectedSwatch] = useState<string>(
    product.swatches[0] || '#111111'
  );
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group flex flex-col bg-white">
      {/* Studio Product Image Container */}
      <div
        onClick={() => onOpenProductModal(product, selectedSwatch)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpenProductModal(product, selectedSwatch);
          }
        }}
        aria-label={`View ${product.title}`}
        className="relative w-full aspect-[336/567] bg-[#EFEFEF] overflow-hidden cursor-pointer"
      >
        {!imgError ? (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-neutral-100 text-neutral-500">
            <span className="font-display text-lg uppercase tracking-widest text-neutral-800">
              NOVAIRE
            </span>
            <span className="text-xs mt-1">{product.title}</span>
          </div>
        )}

        {/* Top-Right Wishlist Heart Button matching reference */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-neutral-700 hover:text-[#111111] transition-colors cursor-pointer z-10"
        >
          <Heart
            className={`w-4 h-4 stroke-[1.6] ${
              isWishlisted ? 'fill-[#E85D3F] text-[#E85D3F]' : ''
            }`}
          />
        </button>

        {/* Subtle Hover POD Customizer Bar */}
        {product.podReady && (
          <div className="absolute inset-x-0 bottom-0 bg-black/75 text-white text-[10px] font-medium uppercase tracking-[0.14em] py-1.5 px-2.5 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            Customize POD / Select Size
          </div>
        )}
      </div>

      {/* Product Metadata Below Photo matching exact reference typography */}
      <div className="pt-2 pb-1 flex flex-col">
        <div className="flex items-start justify-between gap-1">
          <h3
            onClick={() => onOpenProductModal(product, selectedSwatch)}
            className="text-[11.5px] sm:text-[12px] font-normal text-[#222222] leading-tight truncate cursor-pointer hover:underline"
            title={product.title}
          >
            {product.title}
          </h3>
          <button
            type="button"
            onClick={() => onQuickAdd(product, selectedSwatch)}
            aria-label={`Quick add ${product.title} (${product.sku})`}
            title="Quick Add to Bag"
            className="text-neutral-600 hover:text-[#111111] p-0.5 -mr-0.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[1.75]" />
          </button>
        </div>

        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-[11.5px] sm:text-[12px] font-bold text-[#111111] tabular-nums">
            {formatPrice(product.priceInr, currency)}
          </span>
        </div>

        {/* Color Swatches Row matching reference */}
        <div className="mt-1.5 flex items-center gap-1">
          {product.swatches.map((hex, index) => {
            const isActive = selectedSwatch === hex;
            return (
              <button
                key={`${product.id}-swatch-${index}`}
                type="button"
                onClick={() => setSelectedSwatch(hex)}
                aria-label={`Select color ${hex} for ${product.title} (${product.sku})`}
                style={{ backgroundColor: hex }}
                className={`w-[9px] h-[9px] border transition-transform cursor-pointer ${
                  isActive
                    ? 'border-[#111111] ring-1 ring-[#111111] ring-offset-1'
                    : 'border-neutral-300'
                }`}
              />
            );
          })}
          {product.extraColorsCount && product.extraColorsCount > 0 && (
            <span className="text-[10px] text-neutral-500 font-medium leading-none ml-0.5 tabular-nums">
              +{product.extraColorsCount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
