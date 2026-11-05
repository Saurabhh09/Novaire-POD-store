import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_PRODUCTS,
  SECONDARY_SHOWCASE_PRODUCTS,
  formatPrice,
  calculatePodUnitPrice,
  filterAndSortProducts,
  calculateCartTotals,
  validateCheckoutForm,
  generateShopifyThemeFiles,
  type PodCustomization,
  type CartItem,
} from './storeLogic';

test('catalog contains all 50 primary products and 10 secondary showcase products', () => {
  assert.equal(INITIAL_PRODUCTS.length, 50);
  assert.equal(SECONDARY_SHOWCASE_PRODUCTS.length, 10);
  assert.equal(INITIAL_PRODUCTS[0].title, 'Slim Fit Stretch Shirt');
  assert.equal(INITIAL_PRODUCTS[0].priceInr, 999);
  assert.equal(INITIAL_PRODUCTS[1].title, 'Regular Fit Checks Flannel Shirt');
  assert.equal(INITIAL_PRODUCTS[1].priceInr, 1399);
});

test('formatPrice formats INR and converts global currencies accurately', () => {
  assert.equal(formatPrice(999, 'INR'), '₹999');
  assert.equal(formatPrice(1000, 'USD'), '$12.00');
  assert.equal(formatPrice(1000, 'EUR'), '€11.00');
  assert.equal(formatPrice(1000, 'GBP'), '£9.50');
});

test('calculatePodUnitPrice adds technique and heavyweight GSM surcharges when enabled', () => {
  const basePrice = 1399;
  assert.equal(calculatePodUnitPrice(basePrice, undefined), 1399);

  const podConfig: PodCustomization = {
    enabled: true,
    technique: 'PUFF_PRINT',
    placement: 'BACK_CENTER',
    customText: 'NOVAIRE STUDIO',
    graphicPreset: 'ARCHIVE_CREST',
    textColor: '#FFFFFF',
    fabricGsm: '240 GSM Heavyweight',
  };
  // 1399 + 349 (PUFF_PRINT) + 100 (240 GSM) = 1848
  assert.equal(calculatePodUnitPrice(basePrice, podConfig), 1848);
});

test('filterAndSortProducts filters by category, editorial tag, search query, and sorts by price', () => {
  const shirts = filterAndSortProducts(INITIAL_PRODUCTS, { category: 'SHIRTS' });
  assert.ok(shirts.length > 10);
  assert.ok(shirts.every((p) => p.category === 'SHIRTS'));

  const flannels = filterAndSortProducts(INITIAL_PRODUCTS, {
    editorial: 'FLANNEL_EDIT',
  });
  assert.ok(flannels.length >= 6);
  assert.ok(flannels.every((p) => p.subTags.includes('FLANNEL_EDIT')));

  const searched = filterAndSortProducts(INITIAL_PRODUCTS, {
    searchQuery: 'Turtleneck',
  });
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'nov-37');

  const sortedAsc = filterAndSortProducts(INITIAL_PRODUCTS, {
    sortBy: 'PRICE_ASC',
  });
  assert.ok(sortedAsc[0].priceInr <= sortedAsc[sortedAsc.length - 1].priceInr);
});

test('calculateCartTotals computes subtotal, NOVA15 discount, and free shipping threshold', () => {
  const samplePod: PodCustomization = {
    enabled: false,
    technique: 'NONE',
    placement: 'FRONT_CHEST',
    customText: '',
    graphicPreset: 'NONE',
    textColor: '#111111',
    fabricGsm: '180 GSM Classic',
  };

  const items: CartItem[] = [
    {
      cartItemId: 'ci-1',
      product: INITIAL_PRODUCTS[1], // 1399
      selectedSize: 'L',
      selectedSwatch: '#5A6B7C',
      quantity: 2,
      pod: samplePod,
      unitPriceInr: 1399,
    },
  ];

  const totals = calculateCartTotals(items, 'NOVA15');
  assert.equal(totals.itemCount, 2);
  assert.equal(totals.subtotalInr, 2798);
  assert.equal(totals.discountInr, Math.round(2798 * 0.15)); // 420
  assert.equal(totals.shippingInr, 0); // > 1999 free shipping
  assert.equal(totals.totalInr, 2798 - 420);
});

test('validateCheckoutForm rejects empty fields and accepts valid customer details', () => {
  const invalidResult = validateCheckoutForm({
    fullName: '',
    email: 'not-an-email',
    phone: '123',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'SHOPIFY_PAY',
  });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.fullName);
  assert.ok(invalidResult.errors.email);

  const validResult = validateCheckoutForm({
    fullName: 'Aarav Mehta',
    email: 'aarav@novaire.studio',
    phone: '+91 9876543210',
    address: '42 Indiranagar 100 Feet Road',
    city: 'Bengaluru',
    postalCode: '560038',
    country: 'India',
    paymentMethod: 'SHOPIFY_PAY',
  });
  assert.equal(validResult.valid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('generateShopifyThemeFiles generates valid JSON template and Liquid sections', () => {
  const files = generateShopifyThemeFiles('NOVAIRE');
  const parsedJson = JSON.parse(files['templates/index.json']);
  assert.equal(parsedJson.sections.header.settings.brand_logo_text, 'NOVAIRE');
  assert.ok(files['sections/trending-product-grid.liquid'].includes('nova-grid-5col'));
  assert.ok(files['sections/footer-novaire.liquid'].includes('nova-footer'));
});
