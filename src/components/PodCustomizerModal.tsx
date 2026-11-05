import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  ShoppingBag,
  Zap,
  Shield,
  Award,
  Flame,
  Crown,
} from 'lucide-react';
import {
  type Product,
  type PodCustomization,
  type PrintTechnique,
  type PrintPlacement,
  type CurrencyCode,
  calculatePodUnitPrice,
  formatPrice,
  POD_TECHNIQUE_SURCHARGE_INR,
} from '../utils/storeLogic';

interface PodCustomizerModalProps {
  isOpen: boolean;
  product: Product | null;
  allProducts: Product[];
  initialSwatch?: string;
  initialPodEnabled?: boolean;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    size: string,
    swatch: string,
    quantity: number,
    pod: PodCustomization,
    openCheckoutDirectly?: boolean
  ) => void;
}

const GRAPHIC_PRESETS = [
  { id: 'NONE', label: 'Text Only' },
  { id: 'ARCHIVE_CREST', label: 'Novaire Crest' },
  { id: 'ATELIER_FLAME', label: 'Street Flame' },
  { id: 'CROWN_MONO', label: 'Royal Emblem' },
  { id: 'SHIELD_26', label: 'Division Shield' },
];

export const PodCustomizerModal: React.FC<PodCustomizerModalProps> = ({
  isOpen,
  product,
  allProducts,
  initialSwatch,
  initialPodEnabled = false,
  currency,
  onClose,
  onAddToCart,
}) => {
  const activeProduct = product || allProducts[1] || allProducts[0];

  const [selectedProduct, setSelectedProduct] = useState<Product>(activeProduct);
  const [selectedSize, setSelectedSize] = useState<string>(
    activeProduct.sizes[1] || activeProduct.sizes[0] || 'L'
  );
  const [selectedSwatch, setSelectedSwatch] = useState<string>(
    initialSwatch || activeProduct.swatches[0] || '#111111'
  );
  const [quantity, setQuantity] = useState<number>(1);

  const [pod, setPod] = useState<PodCustomization>({
    enabled: initialPodEnabled,
    technique: initialPodEnabled ? 'DTG_PRINT' : 'NONE',
    placement: 'FRONT_CHEST',
    customText: initialPodEnabled ? 'NOVAIRE EST. 26' : '',
    graphicPreset: 'ARCHIVE_CREST',
    textColor: '#FFFFFF',
    fabricGsm: '240 GSM Heavyweight',
  });

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
      setSelectedSize(product.sizes.includes('L') ? 'L' : product.sizes[0]);
      setSelectedSwatch(initialSwatch || product.swatches[0] || '#111111');
      setQuantity(1);
      setPod((prev) => ({
        ...prev,
        enabled: initialPodEnabled,
        technique: initialPodEnabled ? 'DTG_PRINT' : 'NONE',
        customText: initialPodEnabled ? 'NOVAIRE EST. 26' : prev.customText,
      }));
    }
  }, [product, initialSwatch, initialPodEnabled]);

  if (!isOpen || !selectedProduct) return null;

  const unitPriceInr = calculatePodUnitPrice(selectedProduct.priceInr, pod);
  const totalInr = unitPriceInr * quantity;

  const handleTogglePod = (enabled: boolean) => {
    setPod((prev) => ({
      ...prev,
      enabled,
      technique: enabled && prev.technique === 'NONE' ? 'DTG_PRINT' : enabled ? prev.technique : 'NONE',
      customText: enabled && !prev.customText ? 'NOVAIRE 2026' : prev.customText,
    }));
  };

  // Placement coordinates for live garment preview overlay
  const placementStyle: Record<PrintPlacement, string> = {
    FRONT_CHEST: 'top-[32%] left-[54%] -translate-x-1/2',
    BACK_CENTER: 'top-[36%] left-1/2 -translate-x-1/2 scale-110',
    LEFT_SLEEVE: 'top-[40%] right-[18%] scale-90',
    COLLAR_MONOGRAM: 'top-[21%] left-1/2 -translate-x-1/2 scale-75',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${selectedProduct.title} Product Detail and POD Customizer`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-[2px]"
    >
      <div className="relative bg-white w-full max-w-5xl shadow-2xl border border-neutral-200 overflow-hidden my-auto animate-fade-slide">
        {/* Top Modal Header */}
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold uppercase tracking-[0.16em] text-[#111111]">
              NOVAIRE ATELIER
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs font-mono-code text-neutral-500">
              SKU: {selectedProduct.sku}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product customizer"
            className="p-1.5 text-neutral-500 hover:text-[#111111] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Sticky Garment Gallery & Live POD Overlay (5 cols) */}
          <div className="lg:col-span-5 bg-[#EFEFEF] p-5 flex flex-col items-center justify-between relative">
            {/* Optional Garment Switcher when in POD Studio */}
            <div className="w-full mb-3">
              <label
                htmlFor="studio-garment-select"
                className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1"
              >
                BASE GARMENT CANVAS
              </label>
              <select
                id="studio-garment-select"
                value={selectedProduct.id}
                onChange={(e) => {
                  const found = allProducts.find((p) => p.id === e.target.value);
                  if (found) {
                    setSelectedProduct(found);
                    setSelectedSize(found.sizes[0]);
                    setSelectedSwatch(found.swatches[0]);
                  }
                }}
                className="w-full bg-white border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-[#111111]"
              >
                {allProducts.slice(0, 20).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({formatPrice(p.priceInr, currency)})
                  </option>
                ))}
              </select>
            </div>

            {/* Studio Image + Live Print Overlay */}
            <div className="relative w-full max-w-[340px] aspect-[336/567] bg-[#E8EAED] overflow-hidden shadow-sm border border-neutral-300">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />

              {/* Live POD Visual Overlay */}
              {pod.enabled && pod.technique !== 'NONE' && (
                <div
                  className={`absolute ${placementStyle[pod.placement]} transition-all duration-200 pointer-events-none`}
                >
                  <div
                    style={{ color: pod.textColor }}
                    className="border border-dashed border-white/80 bg-black/55 backdrop-blur-[1px] px-3 py-2 rounded flex flex-col items-center justify-center text-center shadow-lg min-w-[110px]"
                  >
                    {pod.graphicPreset === 'ARCHIVE_CREST' && (
                      <Award className="w-5 h-5 mb-1" />
                    )}
                    {pod.graphicPreset === 'ATELIER_FLAME' && (
                      <Flame className="w-5 h-5 mb-1" />
                    )}
                    {pod.graphicPreset === 'CROWN_MONO' && (
                      <Crown className="w-5 h-5 mb-1" />
                    )}
                    {pod.graphicPreset === 'SHIELD_26' && (
                      <Shield className="w-5 h-5 mb-1" />
                    )}
                    <span className="font-display text-xs font-bold uppercase tracking-[0.18em] leading-tight">
                      {pod.customText || 'NOVAIRE'}
                    </span>
                    <span className="text-[8px] font-mono-code uppercase tracking-widest opacity-80 mt-0.5">
                      {pod.technique.replace('_', ' ')} · {pod.placement.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Selected Swatch Indicator Pill */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-medium text-[#111111] flex items-center gap-1.5 border border-neutral-200">
                <span
                  className="w-2.5 h-2.5 border border-neutral-400"
                  style={{ backgroundColor: selectedSwatch }}
                />
                <span>{selectedProduct.gsm}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 mt-3 text-center">
              {selectedProduct.fabric}
            </p>
          </div>

          {/* Right Column: Contiguous Purchase & POD Configuration Module (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Title & Live Price */}
              <div className="border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                  <span>{selectedProduct.category}</span>
                  <span>·</span>
                  <span>{selectedProduct.gsm}</span>
                  <span>·</span>
                  <span>In Stock (Ships in 48h)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                  {selectedProduct.title}
                </h2>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-xl font-bold text-[#111111] tabular-nums">
                    {formatPrice(unitPriceInr, currency)}
                  </span>
                  {selectedProduct.originalPriceInr && (
                    <span className="text-sm text-neutral-400 line-through tabular-nums">
                      {formatPrice(selectedProduct.originalPriceInr, currency)}
                    </span>
                  )}
                  {pod.enabled && pod.technique !== 'NONE' && (
                    <span className="text-xs font-medium text-[#E85D3F]">
                      (Includes Custom POD +{formatPrice(unitPriceInr - selectedProduct.priceInr, currency)})
                    </span>
                  )}
                </div>
              </div>

              {/* Color Swatches & Size Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                    COLOR VARIANT
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedProduct.swatches.map((hex, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSwatch(hex)}
                        aria-label={`Select color ${hex}`}
                        style={{ backgroundColor: hex }}
                        className={`w-7 h-7 border transition-transform cursor-pointer flex items-center justify-center ${
                          selectedSwatch === hex
                            ? 'border-[#111111] ring-2 ring-[#111111] ring-offset-2'
                            : 'border-neutral-300'
                        }`}
                      >
                        {selectedSwatch === hex && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                    SELECT SIZE
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[38px] h-9 px-2.5 text-xs font-semibold border transition-colors cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-white text-[#111111] border-neutral-300 hover:border-[#111111]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Print-on-Demand (POD) Customization Module */}
              <div className="border border-neutral-200 bg-neutral-50/70 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E85D3F]" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                        CUSTOM PRINT-ON-DEMAND (POD) STUDIO
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Add custom typography, brand crest, or 3D satin embroidery
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={pod.enabled}
                    aria-label="Enable Custom Print on Demand"
                    onClick={() => handleTogglePod(!pod.enabled)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      pod.enabled
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#111111] border-neutral-300 hover:border-[#111111]'
                    }`}
                  >
                    {pod.enabled ? 'POD Enabled ✓' : '+ Customize POD'}
                  </button>
                </div>

                {pod.enabled && (
                  <div className="pt-3 border-t border-neutral-200 space-y-3.5 animate-fade-slide">
                    {/* Technique Selector */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                        1. PRINT / EMBROIDERY TECHNIQUE
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(
                          [
                            ['DTG_PRINT', 'DTG HD Print'],
                            ['PUFF_PRINT', '3D Puff Screen Ink'],
                            ['SATIN_EMBROIDERY', 'Satin Embroidery'],
                          ] as [PrintTechnique, string][]
                        ).map(([tech, label]) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => setPod((prev) => ({ ...prev, technique: tech }))}
                            className={`p-2 text-left border text-xs transition-colors cursor-pointer ${
                              pod.technique === tech
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'bg-white text-[#111111] border-neutral-300'
                            }`}
                          >
                            <div className="font-semibold">{label}</div>
                            <div className="text-[10px] opacity-80 tabular-nums">
                              +{formatPrice(POD_TECHNIQUE_SURCHARGE_INR[tech], currency)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Placement & Graphic Preset */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="pod-placement"
                          className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1"
                        >
                          2. GARMENT PLACEMENT
                        </label>
                        <select
                          id="pod-placement"
                          value={pod.placement}
                          onChange={(e) =>
                            setPod((prev) => ({
                              ...prev,
                              placement: e.target.value as PrintPlacement,
                            }))
                          }
                          className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                        >
                          <option value="FRONT_CHEST">Left Chest Atelier Crest</option>
                          <option value="BACK_CENTER">Oversized Back Center</option>
                          <option value="LEFT_SLEEVE">Left Sleeve Cuff</option>
                          <option value="COLLAR_MONOGRAM">Collar Tip Monogram</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="pod-graphic"
                          className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1"
                        >
                          3. GRAPHIC EMBLEM
                        </label>
                        <select
                          id="pod-graphic"
                          value={pod.graphicPreset}
                          onChange={(e) =>
                            setPod((prev) => ({ ...prev, graphicPreset: e.target.value }))
                          }
                          className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                        >
                          {GRAPHIC_PRESETS.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Custom Text & Fabric Weight */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="pod-custom-text"
                          className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1"
                        >
                          4. CUSTOM TEXT / MONOGRAM
                        </label>
                        <input
                          id="pod-custom-text"
                          type="text"
                          maxLength={24}
                          value={pod.customText}
                          onChange={(e) =>
                            setPod((prev) => ({ ...prev, customText: e.target.value }))
                          }
                          placeholder="e.g. NOVAIRE EST. 26"
                          className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="pod-gsm"
                          className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1"
                        >
                          5. FABRIC WEIGHT UPGRADE
                        </label>
                        <select
                          id="pod-gsm"
                          value={pod.fabricGsm}
                          onChange={(e) =>
                            setPod((prev) => ({
                              ...prev,
                              fabricGsm: e.target.value as PodCustomization['fabricGsm'],
                            }))
                          }
                          className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                        >
                          <option value="180 GSM Classic">180 GSM Classic (Included)</option>
                          <option value="240 GSM Heavyweight">
                            240 GSM Heavyweight (+{formatPrice(100, currency)})
                          </option>
                          <option value="280 GSM Luxe Terry">
                            280 GSM Luxe Terry (+{formatPrice(200, currency)})
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Quantity + Add to Bag + Shopify Direct Checkout */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-neutral-300 h-11 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-sm font-bold text-[#111111] hover:bg-neutral-100 cursor-pointer"
                >
                  −
                </button>
                <span className="w-10 text-center text-xs font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-sm font-bold text-[#111111] hover:bg-neutral-100 cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAddToCart(
                    selectedProduct,
                    selectedSize,
                    selectedSwatch,
                    quantity,
                    pod,
                    false
                  )
                }
                className="flex-1 h-11 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.12em] px-4 flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Add to Bag · {formatPrice(totalInr, currency)}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onAddToCart(
                    selectedProduct,
                    selectedSize,
                    selectedSwatch,
                    quantity,
                    pod,
                    true
                  )
                }
                className="h-11 bg-[#E85D3F] hover:bg-[#d14c2f] text-white text-xs font-bold uppercase tracking-[0.12em] px-4 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span>Shopify Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
