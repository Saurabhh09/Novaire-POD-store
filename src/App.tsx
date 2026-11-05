import React, { useState, useMemo } from 'react';
import { RefreshCw, X, CheckCircle2, Sparkles } from 'lucide-react';
import {
  INITIAL_PRODUCTS,
  SECONDARY_SHOWCASE_PRODUCTS,
  filterAndSortProducts,
  calculatePodUnitPrice,
  formatPrice,
  type Product,
  type CategoryFilter,
  type EditorialCollection,
  type CurrencyCode,
  type CartItem,
  type PodCustomization,
  type ShopifyOrder,
} from './utils/storeLogic';
import { Header } from './components/Header';
import { HeroAndBanners } from './components/HeroAndBanners';
import { ProductCard } from './components/ProductCard';
import { SeoDirectorySection } from './components/SeoDirectorySection';
import { Footer } from './components/Footer';
import { PodCustomizerModal } from './components/PodCustomizerModal';
import {
  CartAndCheckoutModal,
  WishlistDrawer,
} from './components/CartAndCheckoutModal';
import { ShopifyTechModal, StoresModal } from './components/ShopifyTechModal';

const TRENDING_TABS: CategoryFilter[] = [
  'ALL',
  'SHIRTS',
  'JACKETS',
  'SWEATERS',
  'JEANS',
  'T-SHIRTS',
  'TROUSERS',
  'SHOES',
  'HOODIES',
];

const EDITORIAL_LABELS: Record<EditorialCollection, string> = {
  ALL: '',
  FLANNEL_EDIT: 'The Flannel Edit',
  BESTSELLERS_SALE: 'Bestsellers Up To 30% Off',
  FORMAL_SHIRTS: 'Formal Shirts Collection',
  HAND_EMBROIDERED: 'Hand Embroidered Edit',
  JACQUARD_SHIRTS: 'Jacquard Woven Shirts',
  BUNDLE_BOTTOMWEAR: '2 Bottom Wear for ₹2899 Bundle',
  PERFUMES_50: 'Perfumes 50% Off',
  SUNGLASSES_999: 'Sunglasses ₹999',
  BUNDLE_TOPWEAR: '3 Top Wear for ₹2699 Bundle',
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [activeEditorial, setActiveEditorial] = useState<EditorialCollection>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST'>('FEATURED');
  const [podOnly, setPodOnly] = useState<boolean>(false);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Pagination / Discover More state
  const [visibleCount, setVisibleCount] = useState<number>(50);
  const [discoverExpanded, setDiscoverExpanded] = useState<boolean>(false);

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'seed-flannel-1',
      product: INITIAL_PRODUCTS[1],
      selectedSize: 'L',
      selectedSwatch: INITIAL_PRODUCTS[1].swatches[0],
      quantity: 1,
      pod: {
        enabled: false,
        technique: 'NONE',
        placement: 'FRONT_CHEST',
        customText: '',
        graphicPreset: 'NONE',
        textColor: '#FFFFFF',
        fabricGsm: '240 GSM Heavyweight',
      },
      unitPriceInr: INITIAL_PRODUCTS[1].priceInr,
    },
  ]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [wishlistIds, setWishlistIds] = useState<string[]>(['nov-02', 'nov-08']);

  // Orders placed during session (synced with Shopify Admin view)
  const [orders, setOrders] = useState<ShopifyOrder[]>([
    {
      orderNumber: 'NOV-1038',
      createdAt: 'Today, 11:15 AM',
      customer: {
        fullName: 'Rohan Kapoor',
        email: 'rohan.k@example.com',
        phone: '+91 98201 11223',
        address: '14 Linking Road, Bandra West',
        city: 'Mumbai',
        postalCode: '400050',
        country: 'India',
        paymentMethod: 'SHOPIFY_PAY',
      },
      items: [
        {
          cartItemId: 'ord-item-1',
          product: INITIAL_PRODUCTS[1],
          selectedSize: 'L',
          selectedSwatch: '#5A6B7C',
          quantity: 1,
          pod: {
            enabled: true,
            technique: 'SATIN_EMBROIDERY',
            placement: 'FRONT_CHEST',
            customText: 'NOVAIRE 26',
            graphicPreset: 'ARCHIVE_CREST',
            textColor: '#FFFFFF',
            fabricGsm: '240 GSM Heavyweight',
          },
          unitPriceInr: 1898,
        },
      ],
      subtotalInr: 1898,
      discountInr: 0,
      shippingInr: 149,
      totalInr: 2047,
      status: 'In DTG Production',
    },
  ]);

  // Modals & Drawers State
  const [activeProductModal, setActiveProductModal] = useState<{
    open: boolean;
    product: Product | null;
    swatch?: string;
    podEnabled?: boolean;
  }>({ open: false, product: null });

  const [cartModalState, setCartModalState] = useState<{
    open: boolean;
    view: 'CART' | 'CHECKOUT';
  }>({ open: false, view: 'CART' });

  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [shopifyModal, setShopifyModal] = useState<{
    open: boolean;
    tab: 'STACK' | 'ADMIN' | 'LIQUID';
  }>({ open: false, tab: 'ADMIN' });
  const [storesModalOpen, setStoresModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, {
      category: activeCategory,
      editorial: activeEditorial,
      searchQuery,
      sortBy,
      podOnly,
    });
  }, [products, activeCategory, activeEditorial, searchQuery, sortBy, podOnly]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const totalBagCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const prod = products.find((p) => p.id === productId);
      if (exists) {
        showToast(`Removed ${prod?.title || 'item'} from Wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved ${prod?.title || 'item'} to Wishlist`);
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (
    product: Product,
    size: string,
    swatch: string,
    quantity: number,
    pod: PodCustomization,
    openCheckoutDirectly = false
  ) => {
    const unitPriceInr = calculatePodUnitPrice(product.priceInr, pod);
    const sig = `${product.id}-${size}-${swatch}-${pod.enabled ? `${pod.technique}-${pod.placement}-${pod.customText}-${pod.fabricGsm}` : 'std'}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartItemId === sig);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId: sig,
          product,
          selectedSize: size,
          selectedSwatch: swatch,
          quantity,
          pod,
          unitPriceInr,
        },
      ];
    });

    setActiveProductModal({ open: false, product: null });
    if (openCheckoutDirectly) {
      setCartModalState({ open: true, view: 'CHECKOUT' });
    } else {
      showToast(
        `Added ${quantity}× ${product.title} (${size})${pod.enabled ? ' [Custom POD]' : ''} to Bag`
      );
    }
  };

  const handleQuickAdd = (product: Product, swatch: string) => {
    const defaultSize = product.sizes.includes('L') ? 'L' : product.sizes[0];
    handleAddToCart(
      product,
      defaultSize,
      swatch,
      1,
      {
        enabled: false,
        technique: 'NONE',
        placement: 'FRONT_CHEST',
        customText: '',
        graphicPreset: 'NONE',
        textColor: '#FFFFFF',
        fabricGsm: '240 GSM Heavyweight',
      },
      false
    );
  };

  const handleUpdateCartQty = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleCompleteOrder = (newOrder: ShopifyOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setPromoCode('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-4 py-2.5 text-xs font-medium shadow-xl flex items-center gap-2 border border-neutral-700 animate-fade-slide"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Navigation Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveEditorial('ALL');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalBagCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartModalState({ open: true, view: 'CART' })}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenShopifyAdmin={(tab = 'ADMIN') =>
          setShopifyModal({ open: true, tab })
        }
        onOpenPodStudio={() =>
          setActiveProductModal({
            open: true,
            product: products[1],
            podEnabled: true,
          })
        }
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <main className="flex-1">
        {/* 2. Hero Carousel, Shop By Category, Bestsellers Banner, 3-Col Editorial, 4-Col Promo Strip */}
        <HeroAndBanners
          activeCategory={activeCategory}
          activeEditorial={activeEditorial}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setActiveEditorial('ALL');
          }}
          onSelectEditorial={(ed) => {
            setActiveEditorial(ed);
            setActiveCategory('ALL');
          }}
          onOpenPodStudio={() =>
            setActiveProductModal({
              open: true,
              product: products[1],
              podEnabled: true,
            })
          }
        />

        {/* 6. TRENDING SECTION & 5-COLUMN PRODUCT CATALOG */}
        <section
          id="trending-section"
          aria-label="Trending Menswear and POD Catalog"
          className="max-w-[1720px] mx-auto px-4 sm:px-8 pt-2 pb-6"
        >
          {/* TRENDING Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3">
            <h2 className="text-lg sm:text-[21px] font-bold tracking-[0.02em] uppercase text-[#111111]">
              TRENDING
            </h2>

            {/* Sort & POD Studio Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPodOnly((prev) => !prev)}
                className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border transition-colors flex items-center gap-1 cursor-pointer ${
                  podOnly
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#111111] border-neutral-300 hover:border-[#111111]'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#E85D3F]" />
                <span>POD Customizable Only</span>
              </button>

              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="sort-select"
                  className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500"
                >
                  Sort:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | 'FEATURED'
                        | 'PRICE_ASC'
                        | 'PRICE_DESC'
                        | 'NEWEST'
                    )
                  }
                  className="border border-neutral-300 bg-white px-2 py-1 text-[11px] font-medium text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  <option value="FEATURED">Featured</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                  <option value="NEWEST">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs matching reference image */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5 mb-5 overflow-x-auto no-scrollbar">
            <div role="tablist" aria-label="Product Category Filters" className="flex items-center gap-5 sm:gap-6">
              {TRENDING_TABS.map((tab) => {
                const isActive = activeCategory === tab && activeEditorial === 'ALL';
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveCategory(tab);
                      setActiveEditorial('ALL');
                    }}
                    className={`text-[10.5px] sm:text-[11px] tracking-[0.06em] uppercase whitespace-nowrap pb-1 transition-colors cursor-pointer ${
                      isActive
                        ? 'font-bold text-[#111111] border-b-[1.5px] border-[#111111]'
                        : 'font-normal text-neutral-500 hover:text-[#111111]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <span className="hidden md:inline text-[11px] text-neutral-400 tabular-nums shrink-0 ml-4">
              Showing {displayedProducts.length} styles
            </span>
          </div>

          {/* Active Editorial / Search Filter Banner if applied */}
          {(activeEditorial !== 'ALL' || searchQuery.trim().length > 0 || activeCategory === 'PLUS SIZE' || activeCategory === 'POLOS') && (
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs bg-neutral-100 px-3.5 py-2 border border-neutral-200">
              <span className="text-neutral-600 font-medium">Active Filter:</span>
              {activeEditorial !== 'ALL' && (
                <span className="font-bold text-[#111111]">
                  {EDITORIAL_LABELS[activeEditorial]}
                </span>
              )}
              {(activeCategory === 'PLUS SIZE' || activeCategory === 'POLOS') && (
                <span className="font-bold text-[#111111]">{activeCategory}</span>
              )}
              {searchQuery.trim().length > 0 && (
                <span className="font-bold text-[#111111]">
                  Search: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setActiveEditorial('ALL');
                  setActiveCategory('ALL');
                  setSearchQuery('');
                  setPodOnly(false);
                }}
                className="ml-auto text-xs font-semibold text-[#E85D3F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* 5-Column Product Grid matching reference */}
          {displayedProducts.length === 0 ? (
            <div className="py-16 text-center border border-neutral-200 bg-neutral-50 space-y-3">
              <p className="text-sm font-semibold text-[#111111]">
                No styles matched your exact filter combination.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('ALL');
                  setActiveEditorial('ALL');
                  setSearchQuery('');
                  setPodOnly(false);
                }}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Show All 50 Styles
              </button>
            </div>
          ) : (
            <div
              data-testid="trending-product-grid"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2.5 gap-y-7"
            >
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenProductModal={(prod, swatch) =>
                    setActiveProductModal({ open: true, product: prod, swatch })
                  }
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}

          {/* "343 more styles to discover" indicator matching reference image */}
          <div className="mt-12 mb-4 flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setDiscoverExpanded((prev) => !prev);
                setVisibleCount(50);
              }}
              className="inline-flex items-center gap-2 text-[11px] text-neutral-600 hover:text-[#111111] py-2 px-4 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E85D3F]" />
              <span>
                <strong className="text-[#E85D3F] font-semibold tabular-nums">
                  {discoverExpanded ? '333' : '343'}
                </strong>{' '}
                more styles to discover
              </span>
            </button>
          </div>
        </section>

        {/* 7. BEIGE EDITORIAL SEO & DISCOVERY DIRECTORY BLOCK */}
        <SeoDirectorySection
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setActiveEditorial('ALL');
          }}
          onQuickSearch={(term) => {
            setSearchQuery(term);
            setActiveCategory('ALL');
            setActiveEditorial('ALL');
          }}
        />

        {/* 8. SECONDARY PRODUCT SHOWCASE BELOW SEO BLOCK (matching bottom of reference image) */}
        <section
          aria-label="More Styles To Explore"
          className="max-w-[1720px] mx-auto px-4 sm:px-8 pt-2 pb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2.5 gap-y-7">
            {SECONDARY_SHOWCASE_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onOpenProductModal={(prod, swatch) =>
                  setActiveProductModal({ open: true, product: prod, swatch })
                }
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        </section>
      </main>

      {/* 9. CUSTOM NOVAIRE ARCHITECTURAL FOOTER & FLOATING CONTROLS */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveEditorial('ALL');
        }}
        onSelectEditorial={(ed) => {
          setActiveEditorial(ed);
          setActiveCategory('ALL');
        }}
        onOpenPodStudio={() =>
          setActiveProductModal({
            open: true,
            product: products[1],
            podEnabled: true,
          })
        }
        onOpenShopifyAdmin={(tab = 'ADMIN') =>
          setShopifyModal({ open: true, tab })
        }
        onOpenStoresModal={() => setStoresModalOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* INTERACTIVE MODALS & DRAWERS */}
      <PodCustomizerModal
        isOpen={activeProductModal.open}
        product={activeProductModal.product}
        allProducts={products}
        initialSwatch={activeProductModal.swatch}
        initialPodEnabled={activeProductModal.podEnabled}
        currency={currency}
        onClose={() => setActiveProductModal({ open: false, product: null })}
        onAddToCart={handleAddToCart}
      />

      <CartAndCheckoutModal
        isOpen={cartModalState.open}
        initialView={cartModalState.view}
        cartItems={cartItems}
        promoCode={promoCode}
        onPromoCodeChange={setPromoCode}
        currency={currency}
        onClose={() => setCartModalState({ open: false, view: 'CART' })}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCompleteOrder={handleCompleteOrder}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        wishlistIds={wishlistIds}
        allProducts={[...products, ...SECONDARY_SHOWCASE_PRODUCTS]}
        currency={currency}
        onClose={() => setWishlistOpen(false)}
        onToggleWishlist={handleToggleWishlist}
        onMoveToBag={(prod) => {
          handleQuickAdd(prod, prod.swatches[0]);
          setWishlistOpen(false);
          setCartModalState({ open: true, view: 'CART' });
        }}
      />

      <ShopifyTechModal
        isOpen={shopifyModal.open}
        initialTab={shopifyModal.tab}
        orders={orders}
        products={products}
        currency={currency}
        onClose={() => setShopifyModal({ ...shopifyModal, open: false })}
        onUpdateOrderStatus={(ordNum, status) => {
          setOrders((prev) =>
            prev.map((o) =>
              o.orderNumber === ordNum ? { ...o, status } : o
            )
          );
          showToast(`Updated Order #${ordNum} to "${status}"`);
        }}
        onAddNewProduct={(newProd) => {
          setProducts((prev) => [newProd, ...prev]);
          showToast(`Published new POD product "${newProd.title}" to Novaire catalog`);
        }}
      />

      <StoresModal
        isOpen={storesModalOpen}
        onClose={() => setStoresModalOpen(false)}
      />
    </div>
  );
}
