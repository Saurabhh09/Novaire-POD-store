export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type CategoryFilter =
  | 'ALL'
  | 'SHIRTS'
  | 'JACKETS'
  | 'SWEATERS'
  | 'JEANS'
  | 'T-SHIRTS'
  | 'TROUSERS'
  | 'SHOES'
  | 'HOODIES'
  | 'POLOS'
  | 'PLUS SIZE';

export type EditorialCollection =
  | 'ALL'
  | 'FLANNEL_EDIT'
  | 'BESTSELLERS_SALE'
  | 'FORMAL_SHIRTS'
  | 'HAND_EMBROIDERED'
  | 'JACQUARD_SHIRTS'
  | 'BUNDLE_BOTTOMWEAR'
  | 'PERFUMES_50'
  | 'SUNGLASSES_999'
  | 'BUNDLE_TOPWEAR';

export type PrintTechnique = 'NONE' | 'DTG_PRINT' | 'PUFF_PRINT' | 'SATIN_EMBROIDERY';
export type PrintPlacement = 'FRONT_CHEST' | 'BACK_CENTER' | 'LEFT_SLEEVE' | 'COLLAR_MONOGRAM';

export interface PodCustomization {
  enabled: boolean;
  technique: PrintTechnique;
  placement: PrintPlacement;
  customText: string;
  graphicPreset: string;
  textColor: string;
  fabricGsm: '180 GSM Classic' | '240 GSM Heavyweight' | '280 GSM Luxe Terry';
}

export interface Product {
  id: string;
  title: string;
  priceInr: number;
  originalPriceInr?: number;
  category: Exclude<CategoryFilter, 'ALL'>;
  subTags: EditorialCollection[];
  image: string;
  swatches: string[];
  extraColorsCount?: number;
  sizes: string[];
  sku: string;
  gsm: string;
  fabric: string;
  podReady: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedSize: string;
  selectedSwatch: string;
  quantity: number;
  pod: PodCustomization;
  unitPriceInr: number;
}

export interface CheckoutFormInput {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: 'SHOPIFY_PAY' | 'CARD' | 'UPI' | 'COD';
}

export interface ShopifyOrder {
  orderNumber: string;
  createdAt: string;
  customer: CheckoutFormInput;
  items: CartItem[];
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  totalInr: number;
  status: 'Confirmed — Sent to POD Print Queue' | 'In DTG Production' | 'Ready for Dispatch';
}

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: string; rateFromInr: number; label: string }
> = {
  INR: { symbol: '₹', rateFromInr: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rateFromInr: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rateFromInr: 0.011, label: 'EUR (€)' },
  GBP: { symbol: '£', rateFromInr: 0.0095, label: 'GBP (£)' },
};

export const POD_TECHNIQUE_SURCHARGE_INR: Record<PrintTechnique, number> = {
  NONE: 0,
  DTG_PRINT: 249,
  PUFF_PRINT: 349,
  SATIN_EMBROIDERY: 399,
};

export function formatPrice(amountInr: number, currency: CurrencyCode = 'INR'): string {
  const cfg = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  if (currency === 'INR') {
    return `${cfg.symbol}${Math.round(amountInr)}`;
  }
  const converted = amountInr * cfg.rateFromInr;
  return `${cfg.symbol}${converted.toFixed(2)}`;
}

export function calculatePodUnitPrice(basePriceInr: number, pod?: PodCustomization): number {
  if (!pod || !pod.enabled || pod.technique === 'NONE') {
    return basePriceInr;
  }
  const techniqueFee = POD_TECHNIQUE_SURCHARGE_INR[pod.technique] ?? 0;
  const gsmFee =
    pod.fabricGsm === '280 GSM Luxe Terry'
      ? 200
      : pod.fabricGsm === '240 GSM Heavyweight'
        ? 100
        : 0;
  return basePriceInr + techniqueFee + gsmFee;
}

export interface FilterOptions {
  category?: CategoryFilter;
  editorial?: EditorialCollection;
  searchQuery?: string;
  sortBy?: 'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST';
  podOnly?: boolean;
}

export function filterAndSortProducts(products: Product[], options: FilterOptions): Product[] {
  const {
    category = 'ALL',
    editorial = 'ALL',
    searchQuery = '',
    sortBy = 'FEATURED',
    podOnly = false,
  } = options;

  const q = searchQuery.trim().toLowerCase();

  const filtered = products.filter((item) => {
    if (category !== 'ALL') {
      if (category === 'PLUS SIZE') {
        if (!item.sizes.includes('3XL') && !item.sizes.includes('4XL')) return false;
      } else if (category === 'POLOS') {
        const isPolo =
          item.category === 'POLOS' || item.title.toLowerCase().includes('polo');
        if (!isPolo) return false;
      } else if (item.category !== category) {
        return false;
      }
    }

    if (editorial !== 'ALL' && !item.subTags.includes(editorial)) {
      return false;
    }

    if (podOnly && !item.podReady) {
      return false;
    }

    if (q.length > 0) {
      const hay = `${item.title} ${item.category} ${item.fabric} ${item.sku}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  if (sortBy === 'PRICE_ASC') {
    return [...filtered].sort((a, b) => a.priceInr - b.priceInr);
  }
  if (sortBy === 'PRICE_DESC') {
    return [...filtered].sort((a, b) => b.priceInr - a.priceInr);
  }
  if (sortBy === 'NEWEST') {
    return [...filtered].reverse();
  }
  return filtered;
}

export function calculateCartTotals(
  items: CartItem[],
  promoCode: string = ''
): {
  itemCount: number;
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  totalInr: number;
  appliedPromoLabel: string | null;
} {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalInr = items.reduce(
    (acc, item) => acc + item.unitPriceInr * item.quantity,
    0
  );

  if (itemCount === 0) {
    return {
      itemCount: 0,
      subtotalInr: 0,
      discountInr: 0,
      shippingInr: 0,
      totalInr: 0,
      appliedPromoLabel: null,
    };
  }

  let discountInr = 0;
  let appliedPromoLabel: string | null = null;
  const normalizedCode = promoCode.trim().toUpperCase();

  if (normalizedCode === 'NOVA15' || normalizedCode === 'NOVAIRE15') {
    discountInr = Math.round(subtotalInr * 0.15);
    appliedPromoLabel = 'NOVA15 (15% OFF)';
  } else if (normalizedCode === 'FLANNEL20') {
    discountInr = Math.round(subtotalInr * 0.2);
    appliedPromoLabel = 'FLANNEL20 (20% OFF)';
  } else if (normalizedCode === 'BUNDLE30' || subtotalInr >= 4500) {
    discountInr = Math.round(subtotalInr * 0.1);
    appliedPromoLabel = normalizedCode === 'BUNDLE30' ? 'BUNDLE30 (10% OFF)' : 'Auto Tier 10% OFF (Orders ≥ ₹4500)';
  }

  const afterDiscount = Math.max(0, subtotalInr - discountInr);
  const shippingInr = afterDiscount >= 1999 ? 0 : 149;
  const totalInr = afterDiscount + shippingInr;

  return {
    itemCount,
    subtotalInr,
    discountInr,
    shippingInr,
    totalInr,
    appliedPromoLabel,
  };
}

export function validateCheckoutForm(form: CheckoutFormInput): {
  valid: boolean;
  errors: Partial<Record<keyof CheckoutFormInput, string>>;
} {
  const errors: Partial<Record<keyof CheckoutFormInput, string>> = {};
  if (!form.fullName || form.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required';
  }
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Valid email address is required';
  }
  if (!form.phone || form.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Valid phone number is required';
  }
  if (!form.address || form.address.trim().length < 5) {
    errors.address = 'Street address is required';
  }
  if (!form.city || form.city.trim().length < 2) {
    errors.city = 'City is required';
  }
  if (!form.postalCode || form.postalCode.trim().length < 3) {
    errors.postalCode = 'Postal / ZIP code is required';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export const INITIAL_PRODUCTS: Product[] = [
  // ROW 1 (prod-1 to prod-5)
  {
    id: 'nov-01',
    title: 'Slim Fit Stretch Shirt',
    priceInr: 999,
    originalPriceInr: 1499,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-1.png',
    swatches: ['#4A3525', '#1C1C1C', '#2B3A4A'],
    extraColorsCount: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-001',
    gsm: '180 GSM',
    fabric: '97% Combed Cotton, 3% Elastane Poplin',
    podReady: true,
  },
  {
    id: 'nov-02',
    title: 'Regular Fit Checks Flannel Shirt',
    priceInr: 1399,
    originalPriceInr: 1999,
    category: 'SHIRTS',
    subTags: ['FLANNEL_EDIT', 'BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-2.png',
    swatches: ['#5A6B7C', '#8C6249'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-FL-002',
    gsm: '240 GSM',
    fabric: '100% Brushed Twill Heavyweight Flannel',
    podReady: true,
  },
  {
    id: 'nov-03',
    title: 'Textured Elevated Polo Sweater',
    priceInr: 1400,
    originalPriceInr: 1899,
    category: 'SWEATERS',
    subTags: ['BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-3.png',
    swatches: ['#3E3124', '#1A1A1A', '#D8CFC2', '#2E4057'],
    extraColorsCount: 2,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-003',
    gsm: '260 GSM',
    fabric: '100% Merino-Touch Combed Cotton Knit',
    podReady: true,
  },
  {
    id: 'nov-04',
    title: 'Slim Fit Stretch Shirt',
    priceInr: 999,
    originalPriceInr: 1499,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-4.png',
    swatches: ['#9B84A8', '#1C1C1C', '#FFFFFF', '#2F4858'],
    extraColorsCount: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-SH-004',
    gsm: '180 GSM',
    fabric: '97% Combed Cotton, 3% Elastane Satin Weave',
    podReady: true,
  },
  {
    id: 'nov-05',
    title: 'Textured Elevated Polo Sweater',
    priceInr: 1400,
    category: 'SWEATERS',
    subTags: ['BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-5.png',
    swatches: ['#6F8FAF', '#3E3124', '#1A1A1A', '#D8CFC2'],
    extraColorsCount: 2,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-005',
    gsm: '260 GSM',
    fabric: '100% Structured Waffle Knit Cotton',
    podReady: true,
  },

  // ROW 2 (prod-6 to prod-10)
  {
    id: 'nov-06',
    title: 'Slim Fit Stretch Pleated Trousers',
    priceInr: 1599,
    originalPriceInr: 2199,
    category: 'TROUSERS',
    subTags: ['FORMAL_SHIRTS', 'BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-6.png',
    swatches: ['#C2B29F', '#1E1E1E', '#334155'],
    extraColorsCount: 1,
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-TR-006',
    gsm: '250 GSM',
    fabric: 'Tailored Stretch Gabardine Twill',
    podReady: false,
  },
  {
    id: 'nov-07',
    title: 'Textured Elevated Polo Sweater',
    priceInr: 1400,
    category: 'SWEATERS',
    subTags: ['BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-7.png',
    swatches: ['#EAE5DC', '#3E3124', '#1A1A1A', '#6F8FAF'],
    extraColorsCount: 2,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-007',
    gsm: '260 GSM',
    fabric: '100% Organic Pima Cotton Knit',
    podReady: true,
  },
  {
    id: 'nov-08',
    title: 'Mandarin PU Leather Zipper Jacket',
    priceInr: 3000,
    originalPriceInr: 4299,
    category: 'JACKETS',
    subTags: ['BESTSELLERS_SALE'],
    image: '/assets/nova/prod-8.png',
    swatches: ['#181818', '#4A2E1B'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JK-008',
    gsm: '340 GSM',
    fabric: 'Matte Grain Vegan Leather with Satin Lining',
    podReady: true,
  },
  {
    id: 'nov-09',
    title: 'Regular Fit Checks Flannel Shirt',
    priceInr: 1299,
    originalPriceInr: 1799,
    category: 'SHIRTS',
    subTags: ['FLANNEL_EDIT', 'BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-9.png',
    swatches: ['#68507B', '#3B4D3B'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
    sku: 'NOV-FL-009',
    gsm: '240 GSM',
    fabric: '100% Brushed Herringbone Check Flannel',
    podReady: true,
  },
  {
    id: 'nov-10',
    title: 'Textured Elevated Polo Sweater',
    priceInr: 1400,
    category: 'SWEATERS',
    subTags: ['BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-10.png',
    swatches: ['#C5A888', '#3E3124', '#1A1A1A', '#EAE5DC'],
    extraColorsCount: 2,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-010',
    gsm: '260 GSM',
    fabric: '100% Fine Gauge Ribbed Cotton',
    podReady: true,
  },

  // ROW 3 (prod-11 to prod-15)
  {
    id: 'nov-11',
    title: '100% Cotton Regular Fit Navy Shirt',
    priceInr: 1199,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'HAND_EMBROIDERED', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-11.png',
    swatches: ['#1D293D', '#5C4033', '#2F4F4F', '#E8E4D9'],
    extraColorsCount: 4,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-SH-011',
    gsm: '200 GSM',
    fabric: '100% Compact Spun Oxford Cotton',
    podReady: true,
  },
  {
    id: 'nov-12',
    title: 'Textured Elevated Polo Sweater',
    priceInr: 1499,
    category: 'SWEATERS',
    subTags: ['HAND_EMBROIDERED', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-12.png',
    swatches: ['#161616', '#3E3124', '#EAE5DC', '#6F8FAF'],
    extraColorsCount: 2,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-012',
    gsm: '270 GSM',
    fabric: '100% Heavyweight Milano Stitch Knit',
    podReady: true,
  },
  {
    id: 'nov-13',
    title: 'Slim Fit Stretch Jeans',
    priceInr: 1999,
    originalPriceInr: 2599,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR', 'BESTSELLERS_SALE'],
    image: '/assets/nova/prod-13.png',
    swatches: ['#5A82A6', '#1C2833', '#2C3E50', '#111111'],
    extraColorsCount: 1,
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-013',
    gsm: '12.5 OZ',
    fabric: '98% Indigo Rope-Dyed Denim, 2% Lycra',
    podReady: false,
  },
  {
    id: 'nov-14',
    title: 'Straight Fit Washed Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-14.png',
    swatches: ['#283D54', '#1B2631'],
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-014',
    gsm: '13.5 OZ',
    fabric: '100% Vintage Enzyme Washed Selvedge Denim',
    podReady: false,
  },
  {
    id: 'nov-15',
    title: 'Washed Baggy Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-15.png',
    swatches: ['#333638', '#4A647C'],
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-015',
    gsm: '14 OZ',
    fabric: '100% Heavyweight Charcoal Stone-Washed Denim',
    podReady: true,
  },

  // ROW 4 (prod-16 to prod-20)
  {
    id: 'nov-16',
    title: 'Double Pocket Snap Button Felt Jacket',
    priceInr: 2424,
    originalPriceInr: 3299,
    category: 'JACKETS',
    subTags: ['BESTSELLERS_SALE', 'HAND_EMBROIDERED'],
    image: '/assets/nova/prod-16.png',
    swatches: ['#D96B27', '#2B3A4A', '#4A3525'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JK-016',
    gsm: '320 GSM',
    fabric: 'Brushed Wool-Blend Overshirt Felt',
    podReady: true,
  },
  {
    id: 'nov-17',
    title: 'Straight Fit Washed Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-17.png',
    swatches: ['#4F6D8A', '#283D54'],
    sizes: ['30', '32', '34', '36'],
    sku: 'NOV-JN-017',
    gsm: '13 OZ',
    fabric: '100% Mid-Blue Whiskered Cotton Denim',
    podReady: false,
  },
  {
    id: 'nov-18',
    title: 'Rib Textured Essential Sweater',
    priceInr: 1599,
    category: 'SWEATERS',
    subTags: ['BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-18.png',
    swatches: ['#9E8C76', '#3D352E', '#1F2421'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-SW-018',
    gsm: '280 GSM',
    fabric: '100% Fisherman Rib Organic Cotton',
    podReady: true,
  },
  {
    id: 'nov-19',
    title: '100% Cotton Mandarin Jacquard Shirt',
    priceInr: 1499,
    originalPriceInr: 1999,
    category: 'SHIRTS',
    subTags: ['JACQUARD_SHIRTS', 'HAND_EMBROIDERED', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-19.png',
    swatches: ['#6B4C35', '#1E293B', '#2F3E2E', '#D5C7B8'],
    extraColorsCount: 1,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JQ-019',
    gsm: '210 GSM',
    fabric: '100% Loom-Woven Geometric Jacquard Cotton',
    podReady: true,
  },
  {
    id: 'nov-20',
    title: 'Slim Fit Stretch Shirt',
    priceInr: 999,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-20.png',
    swatches: ['#D2D6D9', '#1C1C1C', '#4A3525', '#9B84A8'],
    extraColorsCount: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-020',
    gsm: '180 GSM',
    fabric: '97% Cotton, 3% Elastane Crisp Poplin',
    podReady: true,
  },

  // ROW 5 (prod-21 to prod-25)
  {
    id: 'nov-21',
    title: 'Slim Fit Stretch Shirt',
    priceInr: 999,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-21.png',
    swatches: ['#7C6846', '#1C1C1C', '#4A3525', '#9B84A8'],
    extraColorsCount: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-021',
    gsm: '180 GSM',
    fabric: '97% Cotton, 3% Elastane Olive Twill',
    podReady: true,
  },
  {
    id: 'nov-22',
    title: 'Straight Fit Stretch Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-22.png',
    swatches: ['#141414', '#283D54', '#4F6D8A'],
    extraColorsCount: 1,
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-022',
    gsm: '13.5 OZ',
    fabric: 'Jet Black Reactive-Dyed Comfort Denim',
    podReady: false,
  },
  {
    id: 'nov-23',
    title: 'Textured Slim Fit Brown Shirt',
    priceInr: 1299,
    category: 'SHIRTS',
    subTags: ['JACQUARD_SHIRTS', 'HAND_EMBROIDERED', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-23.png',
    swatches: ['#4E3629', '#1E1E1E', '#D8CFC2'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-023',
    gsm: '210 GSM',
    fabric: '100% Dobby Textured Slub Cotton',
    podReady: true,
  },
  {
    id: 'nov-24',
    title: 'Regular Fit Checks Shirt',
    priceInr: 1400,
    category: 'SHIRTS',
    subTags: ['FLANNEL_EDIT', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-24.png',
    swatches: ['#9E978E', '#4A5D6E'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-FL-024',
    gsm: '220 GSM',
    fabric: '100% Yarn-Dyed Tartan Check Cotton',
    podReady: true,
  },
  {
    id: 'nov-25',
    title: 'Double Pocket Textured Felt Jacket',
    priceInr: 2024,
    originalPriceInr: 2899,
    category: 'JACKETS',
    subTags: ['BESTSELLERS_SALE'],
    image: '/assets/nova/prod-25.png',
    swatches: ['#3A322D', '#5C1D24', '#1F2937'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JK-025',
    gsm: '330 GSM',
    fabric: 'Heavyweight Brushed Felt Shacket',
    podReady: true,
  },

  // ROW 6 (prod-26 to prod-30)
  {
    id: 'nov-26',
    title: 'Regular Fit Checks Flannel Shirt',
    priceInr: 1399,
    category: 'SHIRTS',
    subTags: ['FLANNEL_EDIT', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-26.png',
    swatches: ['#B5A28C', '#4A5D6E'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-FL-026',
    gsm: '240 GSM',
    fabric: '100% Brushed Oatmeal Plaid Flannel',
    podReady: true,
  },
  {
    id: 'nov-27',
    title: 'Slim Fit Stretch Shirt',
    priceInr: 999,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-27.png',
    swatches: ['#232936', '#1C1C1C', '#4A3525', '#7C6846'],
    extraColorsCount: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-027',
    gsm: '180 GSM',
    fabric: 'Midnight Navy Stretch Poplin',
    podReady: true,
  },
  {
    id: 'nov-28',
    title: 'Acid Wash Baggy Jeans',
    priceInr: 1999,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-28.png',
    swatches: ['#5E809E', '#2E3B4E'],
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-028',
    gsm: '14 OZ',
    fabric: '100% Cotton Streetwear Wide-Leg Denim',
    podReady: true,
  },
  {
    id: 'nov-29',
    title: 'Rib Textured Regular Fit Polo Sweater',
    priceInr: 1000,
    originalPriceInr: 1499,
    category: 'SWEATERS',
    subTags: ['BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-29.png',
    swatches: ['#3C2820', '#1B2A4A', '#2E4A36'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-029',
    gsm: '240 GSM',
    fabric: 'Espresso Ribbed Open-Collar Knit',
    podReady: true,
  },
  {
    id: 'nov-30',
    title: 'Varsity Knit Luxe Sweater',
    priceInr: 1999,
    category: 'SWEATERS',
    subTags: ['HAND_EMBROIDERED', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-30.png',
    swatches: ['#E6DFD3', '#0F4C3A'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-SW-030',
    gsm: '310 GSM',
    fabric: 'Heavyweight Chenille Patch Varsity Knit',
    podReady: true,
  },

  // ROW 7 (prod-31 to prod-35)
  {
    id: 'nov-31',
    title: 'Double Pocket Textured Zipper Jacket',
    priceInr: 2524,
    category: 'JACKETS',
    subTags: ['BESTSELLERS_SALE'],
    image: '/assets/nova/prod-31.png',
    swatches: ['#9DA5AE', '#2C3539'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JK-031',
    gsm: '320 GSM',
    fabric: 'Structured Twill Workwear Harrington Jacket',
    podReady: true,
  },
  {
    id: 'nov-32',
    title: 'Triple Pocket Tweed Jacket',
    priceInr: 1999,
    category: 'JACKETS',
    subTags: ['JACQUARD_SHIRTS', 'HAND_EMBROIDERED'],
    image: '/assets/nova/prod-32.png',
    swatches: ['#E8DFD1', '#1A1A1A'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JK-032',
    gsm: '300 GSM',
    fabric: 'Bouclé Textured Ecru Tweed Overshirt',
    podReady: true,
  },
  {
    id: 'nov-33',
    title: 'Straight Fit Stretch Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-33.png',
    swatches: ['#1E2638', '#141414', '#4F6D8A'],
    extraColorsCount: 1,
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-033',
    gsm: '13.5 OZ',
    fabric: 'Deep Rinse Indigo Straight Fit Denim',
    podReady: false,
  },
  {
    id: 'nov-34',
    title: 'Varsity Knit Luxe Sweater',
    priceInr: 1999,
    category: 'SWEATERS',
    subTags: ['HAND_EMBROIDERED', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-34.png',
    swatches: ['#0F4C3A', '#E6DFD3'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-SW-034',
    gsm: '310 GSM',
    fabric: 'Forest Green Chenille Appliqué Knit',
    podReady: true,
  },
  {
    id: 'nov-35',
    title: '100% Cotton Regular Fit Oxford Shirt',
    priceInr: 1199,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-35.png',
    swatches: ['#6E3B2E', '#1D293D', '#E8E4D9', '#4A5D6E'],
    extraColorsCount: 4,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-SH-035',
    gsm: '200 GSM',
    fabric: '100% Brushed Rust Oxford Weave Cotton',
    podReady: true,
  },

  // ROW 8 (prod-36 to prod-40)
  {
    id: 'nov-36',
    title: 'Double Pocket Textured Felt Jacket',
    priceInr: 2024,
    category: 'JACKETS',
    subTags: ['BESTSELLERS_SALE'],
    image: '/assets/nova/prod-36.png',
    swatches: ['#5C1D24', '#3A322D', '#1F2937'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JK-036',
    gsm: '330 GSM',
    fabric: 'Oxblood Burgundy Heavyweight Felt',
    podReady: true,
  },
  {
    id: 'nov-37',
    title: 'Regular Fit Textured Turtleneck Sweater',
    priceInr: 1099,
    originalPriceInr: 1599,
    category: 'SWEATERS',
    subTags: ['FORMAL_SHIRTS', 'BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-37.png',
    swatches: ['#181818', '#4A3B32', '#D8CFC2'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-037',
    gsm: '250 GSM',
    fabric: 'Fine Gauge Combed Cotton Roll-Neck',
    podReady: true,
  },
  {
    id: 'nov-38',
    title: '100% Linen Black Luxe Trousers',
    priceInr: 2524,
    category: 'TROUSERS',
    subTags: ['FORMAL_SHIRTS', 'BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-38.png',
    swatches: ['#1C1C1C', '#D8CFC2', '#4A5D6E', '#8C7A6B'],
    extraColorsCount: 4,
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-TR-038',
    gsm: '220 GSM',
    fabric: '100% European Flax Breathable Linen',
    podReady: false,
  },
  {
    id: 'nov-39',
    title: 'Regular Fit Checks Flannel Shirt',
    priceInr: 1099,
    originalPriceInr: 1599,
    category: 'SHIRTS',
    subTags: ['FLANNEL_EDIT', 'BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-39.png',
    swatches: ['#8B262B', '#1E293B'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
    sku: 'NOV-FL-039',
    gsm: '240 GSM',
    fabric: 'Crimson & Charcoal Lumberjack Brushed Flannel',
    podReady: true,
  },
  {
    id: 'nov-40',
    title: 'Regular Fit Checks Flannel Shirt',
    priceInr: 1399,
    category: 'SHIRTS',
    subTags: ['FLANNEL_EDIT', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-40.png',
    swatches: ['#3A5F6F', '#5A6B7C'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-FL-040',
    gsm: '240 GSM',
    fabric: 'Teal & Ivory Heritage Plaid Flannel',
    podReady: true,
  },

  // ROW 9 (prod-41 to prod-45)
  {
    id: 'nov-41',
    title: 'Washed Bootcut Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-41.png',
    swatches: ['#1D1E22', '#3B4C5E'],
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-041',
    gsm: '13.5 OZ',
    fabric: 'Vintage Flare Bootcut Dark Charcoal Denim',
    podReady: false,
  },
  {
    id: 'nov-42',
    title: 'Regular Fit Checks Flannel Shirt',
    priceInr: 1399,
    category: 'SHIRTS',
    subTags: ['FLANNEL_EDIT', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-42.png',
    swatches: ['#54728C', '#8B262B'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-FL-042',
    gsm: '240 GSM',
    fabric: 'Slate Blue Windowpane Check Flannel',
    podReady: true,
  },
  {
    id: 'nov-43',
    title: 'Triple Pocket Tweed Jacket',
    priceInr: 1999,
    category: 'JACKETS',
    subTags: ['JACQUARD_SHIRTS', 'HAND_EMBROIDERED'],
    image: '/assets/nova/prod-43.png',
    swatches: ['#1A1A1A', '#E8DFD1'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JK-043',
    gsm: '310 GSM',
    fabric: 'Onyx Black Textured Tweed Utility Jacket',
    podReady: true,
  },
  {
    id: 'nov-44',
    title: 'Crisp-Edge Pink Slim Fit Stretch Shirt',
    priceInr: 1599,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'HAND_EMBROIDERED', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-44.png',
    swatches: ['#E6CFD2', '#FFFFFF', '#BFD4E6', '#1C1C1C'],
    extraColorsCount: 5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-044',
    gsm: '190 GSM',
    fabric: 'Giza Cotton Rose Quartz Formal Twill',
    podReady: true,
  },
  {
    id: 'nov-45',
    title: 'Straight Fit Stretch Jeans',
    priceInr: 1999,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-45.png',
    swatches: ['#141414', '#1E2638', '#5A82A6', '#2C3E50'],
    extraColorsCount: 1,
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-045',
    gsm: '13 OZ',
    fabric: 'Pitch Black Comfort Stretch Straight Denim',
    podReady: false,
  },

  // ROW 10 (prod-46 to prod-50)
  {
    id: 'nov-46',
    title: 'Washed Baggy Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-46.png',
    swatches: ['#48494B', '#333638'],
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-046',
    gsm: '14 OZ',
    fabric: 'Ash Grey Relaxed Skater Fit Denim',
    podReady: true,
  },
  {
    id: 'nov-47',
    title: 'Mock Neck Regular Fit Puffer Jacket',
    priceInr: 2524,
    originalPriceInr: 3499,
    category: 'JACKETS',
    subTags: ['BESTSELLERS_SALE'],
    image: '/assets/nova/prod-47.png',
    swatches: ['#1B1B1B', '#3B443B'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-JK-047',
    gsm: '380 GSM',
    fabric: 'Quilted Water-Repellent Down-Alternative Puffer',
    podReady: true,
  },
  {
    id: 'nov-48',
    title: 'Slim Fit Stretch Shirt',
    priceInr: 999,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-48.png',
    swatches: ['#233329', '#1C1C1C', '#4A3525', '#7C6846'],
    extraColorsCount: 7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-048',
    gsm: '180 GSM',
    fabric: 'Deep Emerald Stretch Satin-Poplin',
    podReady: true,
  },
  {
    id: 'nov-49',
    title: 'Cable Knit Polo Sweater',
    priceInr: 1400,
    category: 'SWEATERS',
    subTags: ['JACQUARD_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-49.png',
    swatches: ['#1A1A1A', '#EAE5DC', '#233329'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-049',
    gsm: '275 GSM',
    fabric: '100% Braided Cable-Knit Combed Cotton',
    podReady: true,
  },
  {
    id: 'nov-50',
    title: 'Regular Fit Crewneck Knit Sweater',
    priceInr: 1000,
    originalPriceInr: 1499,
    category: 'SWEATERS',
    subTags: ['BESTSELLERS_SALE', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-50.png',
    swatches: ['#1F2A3C', '#181818', '#6B4C35'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-SW-050',
    gsm: '250 GSM',
    fabric: 'Everyday Navy Fine-Knit Pullover',
    podReady: true,
  },
];

// Secondary product showcase below the SEO directory block (matching bottom of reference image)
export const SECONDARY_SHOWCASE_PRODUCTS: Product[] = [
  {
    id: 'nov-51',
    title: 'Regular Fit Washed Jeans',
    priceInr: 1999,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-14.png',
    swatches: ['#283D54', '#4F6D8A'],
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-051',
    gsm: '13.5 OZ',
    fabric: '100% Cotton Vintage Washed Denim',
    podReady: false,
  },
  {
    id: 'nov-52',
    title: 'Regular Fit Cable Knit Sweater',
    priceInr: 1299,
    category: 'SWEATERS',
    subTags: ['BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-49.png',
    swatches: ['#1A1A1A', '#EAE5DC'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-052',
    gsm: '270 GSM',
    fabric: 'Heritage Cable Knit Cotton',
    podReady: true,
  },
  {
    id: 'nov-53',
    title: 'Slim Fit Stretch Shirt',
    priceInr: 1299,
    category: 'SHIRTS',
    subTags: ['FORMAL_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-20.png',
    swatches: ['#D2D6D9', '#1C1C1C', '#2B3A4A', '#9B84A8'],
    extraColorsCount: 6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-053',
    gsm: '190 GSM',
    fabric: 'Stretch Poplin Dress Shirt',
    podReady: true,
  },
  {
    id: 'nov-54',
    title: 'Green Regular Fit Stripes Shirt',
    priceInr: 1199,
    category: 'SHIRTS',
    subTags: ['JACQUARD_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-48.png',
    swatches: ['#233329', '#EAE5DC'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SH-054',
    gsm: '190 GSM',
    fabric: '100% Cotton Vertical Resort Stripes',
    podReady: true,
  },
  {
    id: 'nov-55',
    title: 'Regular Fit PU Leather Zipper Jacket',
    priceInr: 3499,
    category: 'JACKETS',
    subTags: ['BESTSELLERS_SALE'],
    image: '/assets/nova/prod-8.png',
    swatches: ['#181818'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    sku: 'NOV-JK-055',
    gsm: '350 GSM',
    fabric: 'Full-Grain Vegan Biker Jacket',
    podReady: true,
  },
  {
    id: 'nov-56',
    title: 'Jacquard Knit Polo Sweater',
    priceInr: 1099,
    category: 'SWEATERS',
    subTags: ['JACQUARD_SHIRTS', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-5.png',
    swatches: ['#6F8FAF', '#1A1A1A'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'NOV-SW-056',
    gsm: '250 GSM',
    fabric: 'Textured Jacquard Knit Polo',
    podReady: true,
  },
  {
    id: 'nov-57',
    title: 'Straight Fit Stretch Washed Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-17.png',
    swatches: ['#4F6D8A', '#1E2638'],
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-057',
    gsm: '13.5 OZ',
    fabric: 'Comfort Stretch Indigo Denim',
    podReady: false,
  },
  {
    id: 'nov-58',
    title: 'Regular Fit Checks Flannel Shirt',
    priceInr: 1299,
    category: 'SHIRTS',
    subTags: ['FLANNEL_EDIT', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-2.png',
    swatches: ['#5A6B7C', '#8C6249'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-FL-058',
    gsm: '240 GSM',
    fabric: 'Brushed Cotton Check Flannel',
    podReady: true,
  },
  {
    id: 'nov-59',
    title: 'Fadedone Printed Oversized Hoodie',
    priceInr: 2099,
    category: 'HOODIES',
    subTags: ['HAND_EMBROIDERED', 'BUNDLE_TOPWEAR'],
    image: '/assets/nova/prod-34.png',
    swatches: ['#0F4C3A', '#181818'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    sku: 'NOV-HD-059',
    gsm: '320 GSM',
    fabric: 'Heavyweight Loopback French Terry POD Hoodie',
    podReady: true,
  },
  {
    id: 'nov-60',
    title: 'Washed Baggy Jeans',
    priceInr: 2099,
    category: 'JEANS',
    subTags: ['BUNDLE_BOTTOMWEAR'],
    image: '/assets/nova/prod-15.png',
    swatches: ['#333638', '#48494B'],
    sizes: ['30', '32', '34', '36', '38'],
    sku: 'NOV-JN-060',
    gsm: '14 OZ',
    fabric: 'Relaxed Wide-Leg Vintage Denim',
    podReady: true,
  },
];

export const TECH_STACK_SPEC = [
  { layer: 'Structure', technology: 'HTML5', purpose: 'Semantic storefront & POD studio structure' },
  { layer: 'Styling', technology: 'CSS3', purpose: 'Editorial 5-column responsive grid & layout' },
  { layer: 'Programming', technology: 'JavaScript', purpose: 'Dynamic filtering, POD customizer & cart state' },
  { layer: 'Shopify Integration', technology: 'Liquid', purpose: 'Dynamic Shopify OS 2.0 section rendering' },
  { layer: 'Templates', technology: 'JSON', purpose: 'Shopify OS 2.0 page & collection templates' },
  { layer: 'Animations', technology: 'CSS Animations + JavaScript', purpose: 'Smooth micro-interactions & drawer transitions' },
  { layer: 'Icons', technology: 'Lucide Icons (SVG)', purpose: 'Crisp vector interface & commerce icons' },
  { layer: 'Products & Orders', technology: 'Shopify Admin', purpose: 'POD catalog, SKU & live order management' },
  { layer: 'Checkout', technology: 'Shopify Checkout', purpose: 'Multi-currency global payment & COD processing' },
  { layer: 'Development', technology: 'Shopify CLI', purpose: 'Local theme preview, hot-reload & theme push' },
  { layer: 'Version Control', technology: 'Git + GitHub', purpose: 'CI/CD theme deployment & branch management' },
];

export function generateShopifyThemeFiles(brandName = 'NOVAIRE'): Record<string, string> {
  return {
    'templates/index.json': JSON.stringify(
      {
        sections: {
          header: { type: 'header-novaire', settings: { brand_logo_text: brandName, sticky_header: true } },
          hero_flannel: {
            type: 'hero-flannel-edit',
            settings: {
              kicker: 'THE',
              boxed_word: 'FLANNEL',
              suffix: 'EDIT',
              cta_link: 'shopify://collections/flannel-edit',
            },
          },
          shop_by_category: {
            type: 'category-cutout-strip',
            blocks: {
              cat_1: { type: 'category', settings: { title: 'JEANS', collection: 'jeans' } },
              cat_2: { type: 'category', settings: { title: 'SWEATERS', collection: 'sweaters' } },
              cat_3: { type: 'category', settings: { title: 'JACKETS', collection: 'jackets' } },
              cat_4: { type: 'category', settings: { title: 'POLOS', collection: 'polos' } },
              cat_5: { type: 'category', settings: { title: 'PLUS SIZE', badge: 'SIZES XXL TO 5XL', collection: 'plus-size' } },
            },
            block_order: ['cat_1', 'cat_2', 'cat_3', 'cat_4', 'cat_5'],
          },
          bestsellers_banner: {
            type: 'bestsellers-promo-banner',
            settings: { left_heading: 'LAST FEW BESTSELLERS LEFT', right_offer: 'UP TO 30% OFF' },
          },
          editorial_trio: {
            type: 'editorial-three-col',
            blocks: {
              ed_1: { type: 'card', settings: { title: 'FORMAL SHIRTS', subtitle: 'FOR DAYS THAT MEAN BUSINESS.' } },
              ed_2: { type: 'card', settings: { title: 'HAND EMBROIDERED', subtitle: 'TEXTURE THAT DOES THE TALKING.' } },
              ed_3: { type: 'card', settings: { title: 'JACQUARD SHIRTS', subtitle: 'WOVEN PATTERNS. RICH TEXTURE.' } },
            },
            block_order: ['ed_1', 'ed_2', 'ed_3'],
          },
          trending_catalog: {
            type: 'trending-product-grid',
            settings: {
              heading: 'TRENDING',
              columns_desktop: 5,
              products_per_page: 50,
              enable_pod_customizer: true,
            },
          },
          footer: { type: 'footer-novaire', settings: { show_newsletter: true, show_payment_icons: true } },
        },
        order: [
          'header',
          'hero_flannel',
          'shop_by_category',
          'bestsellers_banner',
          'editorial_trio',
          'trending_catalog',
          'footer',
        ],
      },
      null,
      2
    ),
    'sections/trending-product-grid.liquid': `{% comment %}
  NOVAIRE — Shopify OS 2.0 Trending 5-Column Product Grid with POD Customizer
{% endcomment %}
<section class="nova-trending-section" data-section-id="{{ section.id }}">
  <div class="nova-container">
    <h2 class="nova-section-title">{{ section.settings.heading | escape }}</h2>

    <div class="nova-filter-tabs" role="tablist">
      <button class="nova-tab is-active" data-filter="all">ALL</button>
      {% for tag in collections['trending'].all_tags %}
        <button class="nova-tab" data-filter="{{ tag | handleize }}">{{ tag | upcase }}</button>
      {% endfor %}
    </div>

    <div class="nova-grid-5col">
      {% for product in collections[section.settings.collection].products limit: section.settings.products_per_page %}
        <article class="nova-product-card" data-product-id="{{ product.id }}">
          <div class="nova-card-media">
            <a href="{{ product.url }}">
              <img
                src="{{ product.featured_image | image_url: width: 680 }}"
                alt="{{ product.title | escape }}"
                loading="lazy"
                width="336"
                height="567"
              >
            </a>
            <button type="button" class="nova-wishlist-btn" aria-label="Save {{ product.title }}">
              {% render 'icon-lucide-heart' %}
            </button>
          </div>
          <div class="nova-card-meta">
            <div class="nova-card-row">
              <h3 class="nova-card-title">{{ product.title }}</h3>
              <button type="button" class="nova-quick-pod" data-open-pod="{{ product.handle }}">+</button>
            </div>
            <p class="nova-card-price">{{ product.price | money_without_trailing_zeros }}</p>
            {% render 'color-swatches', product: product %}
          </div>
        </article>
      {% endfor %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Novaire Trending Grid",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "TRENDING" },
    { "type": "collection", "id": "collection", "label": "Collection" },
    { "type": "range", "id": "products_per_page", "min": 10, "max": 50, "step": 5, "default": 50 },
    { "type": "checkbox", "id": "enable_pod_customizer", "label": "Enable Live POD Customizer", "default": true }
  ]
}
{% endschema %}`,
    'sections/footer-novaire.liquid': `{% comment %}
  NOVAIRE — Custom Architectural Storefront Footer (Liquid Section)
{% endcomment %}
<footer class="nova-footer" data-section-id="{{ section.id }}">
  <div class="nova-footer-grid">
    <div class="nova-footer-brand">
      <span class="nova-logo">{{ shop.name | upcase }}</span>
      <p>Global Print-on-Demand & Contemporary Menswear Studio. Crafted to order with zero overproduction.</p>
    </div>
    {% for block in section.blocks %}
      <div class="nova-footer-col">
        <h4>{{ block.settings.heading }}</h4>
        <ul>
          {% for link in linklists[block.settings.menu].links %}
            <li><a href="{{ link.url }}">{{ link.title }}</a></li>
          {% endfor %}
        </ul>
      </div>
    {% endfor %}
  </div>
</footer>`,
    'shopify-cli-workflow.sh': `# NOVAIRE — Shopify CLI + Git/GitHub Theme Workflow
# 1. Authenticate with your Novaire Shopify Store
shopify auth login --store novaire-global.myshopify.com

# 2. Start local hot-reload development server (Liquid + JSON + CSS3 + JS)
shopify theme dev --store novaire-global.myshopify.com

# 3. Validate Liquid syntax & JSON schema templates
shopify theme check

# 4. Push unpublished POD theme to Shopify Admin or deploy via GitHub CI
shopify theme push --unpublished --json
git checkout -b feat/novaire-flannel-edit
git add templates/index.json sections/*.liquid assets/*
git commit -m "feat(theme): build Novaire POD storefront & custom footer"
git push origin feat/novaire-flannel-edit`,
  };
}
