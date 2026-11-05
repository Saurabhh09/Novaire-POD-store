import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Tag,
  Lock,
  Heart,
} from 'lucide-react';
import {
  type CartItem,
  type Product,
  type CurrencyCode,
  type CheckoutFormInput,
  type ShopifyOrder,
  calculateCartTotals,
  validateCheckoutForm,
  formatPrice,
} from '../utils/storeLogic';

interface CartDrawerProps {
  isOpen: boolean;
  initialView?: 'CART' | 'CHECKOUT';
  cartItems: CartItem[];
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCompleteOrder: (order: ShopifyOrder) => void;
}

export const CartAndCheckoutModal: React.FC<CartDrawerProps> = ({
  isOpen,
  initialView = 'CART',
  cartItems,
  promoCode,
  onPromoCodeChange,
  currency,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCompleteOrder,
}) => {
  const [step, setStep] = useState<'CART' | 'CHECKOUT' | 'CONFIRMED'>(initialView);
  const [promoInput, setPromoInput] = useState(promoCode);
  const [confirmedOrder, setConfirmedOrder] = useState<ShopifyOrder | null>(null);

  const [form, setForm] = useState<CheckoutFormInput>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'SHOPIFY_PAY',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormInput, string>>>({});

  React.useEffect(() => {
    if (isOpen && step !== 'CONFIRMED') {
      setStep(initialView);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const totals = calculateCartTotals(cartItems, promoCode);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const newOrder: ShopifyOrder = {
      orderNumber: `NOV-${Math.floor(1040 + Math.random() * 8900)}`,
      createdAt: new Date().toLocaleString(),
      customer: form,
      items: [...cartItems],
      subtotalInr: totals.subtotalInr,
      discountInr: totals.discountInr,
      shippingInr: totals.shippingInr,
      totalInr: totals.totalInr,
      status: 'Confirmed — Sent to POD Print Queue',
    };
    setConfirmedOrder(newOrder);
    setStep('CONFIRMED');
    onCompleteOrder(newOrder);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Shopify Checkout"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[1px]"
    >
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-slide">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#111111]" />
            <h2 className="font-display text-lg font-bold uppercase tracking-[0.16em] text-[#111111]">
              {step === 'CART'
                ? `SHOPPING BAG (${totals.itemCount})`
                : step === 'CHECKOUT'
                  ? 'SHOPIFY SECURE CHECKOUT'
                  : 'ORDER CONFIRMED'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep('CART');
              onClose();
            }}
            aria-label="Close shopping bag"
            className="p-1.5 text-neutral-500 hover:text-[#111111] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SHOPPING BAG VIEW */}
        {step === 'CART' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Free Shipping Progress */}
              <div className="bg-[#F6F1EB] border border-[#EAE2D7] px-4 py-2.5 text-xs text-[#222222]">
                {totals.subtotalInr >= 1999 ? (
                  <span className="font-semibold">
                    ✓ Unlocked FREE Express Global Shipping on your order!
                  </span>
                ) : (
                  <span>
                    Add{' '}
                    <strong className="tabular-nums">
                      {formatPrice(1999 - totals.subtotalInr, currency)}
                    </strong>{' '}
                    more for FREE Express Shipping.
                  </span>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto stroke-[1.25]" />
                  <p className="text-sm font-semibold text-[#111111]">
                    Your Novaire bag is empty
                  </p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Explore The Flannel Edit, Elevated Polo Sweaters, or launch the Custom POD Studio to start building your look.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-200">
                  {cartItems.map((item) => (
                    <li key={item.cartItemId} className="py-4 flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-28 object-cover object-top bg-[#EFEFEF] shrink-0 border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs font-bold text-[#111111] leading-snug">
                              {item.product.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.cartItemId)}
                              aria-label={`Remove ${item.product.title}`}
                              className="text-neutral-400 hover:text-[#E85D3F] p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                            <span>Size: {item.selectedSize}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1">
                              Color:
                              <span
                                className="w-2.5 h-2.5 inline-block border border-neutral-300"
                                style={{ backgroundColor: item.selectedSwatch }}
                              />
                            </span>
                          </div>

                          {/* POD Customization Details if Enabled */}
                          {item.pod.enabled && item.pod.technique !== 'NONE' && (
                            <div className="mt-1.5 bg-neutral-100 border border-neutral-200 px-2.5 py-1.5 text-[10px] text-[#222222] space-y-0.5">
                              <div className="font-bold uppercase tracking-wider text-[#E85D3F]">
                                Custom POD: {item.pod.technique.replace('_', ' ')}
                              </div>
                              <div>
                                Placement: {item.pod.placement.replace('_', ' ')} · Text: &ldquo;
                                {item.pod.customText || 'NOVAIRE'}&rdquo;
                              </div>
                              <div>Fabric: {item.pod.fabricGsm}</div>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-neutral-300">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                              aria-label={`Decrease quantity of ${item.product.title}`}
                              className="w-7 h-7 text-xs font-bold hover:bg-neutral-100 cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                              aria-label={`Increase quantity of ${item.product.title}`}
                              className="w-7 h-7 text-xs font-bold hover:bg-neutral-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs font-bold text-[#111111] tabular-nums">
                            {formatPrice(item.unitPriceInr * item.quantity, currency)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Promo Code Input */}
              {cartItems.length > 0 && (
                <div className="pt-2 border-t border-neutral-200">
                  <label
                    htmlFor="cart-promo-input"
                    className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5"
                  >
                    DISCOUNT CODE (TRY: NOVA15 OR FLANNEL20)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="cart-promo-input"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Enter promo code"
                        className="w-full pl-8 pr-3 py-2 border border-neutral-300 text-xs uppercase font-mono-code text-[#111111]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onPromoCodeChange(promoInput)}
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {totals.appliedPromoLabel && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-1.5">
                      ✓ Applied: {totals.appliedPromoLabel}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Summary & Checkout CTA */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium">
                      {formatPrice(totals.subtotalInr, currency)}
                    </span>
                  </div>
                  {totals.discountInr > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({totals.appliedPromoLabel})</span>
                      <span className="tabular-nums font-medium">
                        −{formatPrice(totals.discountInr, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Shopify Global Shipping</span>
                    <span className="tabular-nums font-medium">
                      {totals.shippingInr === 0
                        ? 'FREE'
                        : formatPrice(totals.shippingInr, currency)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-[#111111]">
                    <span>Total</span>
                    <span className="tabular-nums">
                      {formatPrice(totals.totalInr, currency)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('CHECKOUT')}
                  className="w-full py-3.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed to Shopify Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: SHOPIFY CHECKOUT FORM */}
        {step === 'CHECKOUT' && (
          <form
            onSubmit={handleSubmitOrder}
            noValidate
            className="flex-1 flex flex-col justify-between overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between bg-neutral-100 px-3.5 py-2.5 border border-neutral-200 text-xs">
                <span className="font-semibold text-[#111111]">
                  Shopify Express Checkout
                </span>
                <span className="font-bold tabular-nums text-[#111111]">
                  {formatPrice(totals.totalInr, currency)}
                </span>
              </div>

              <div>
                <label
                  htmlFor="chk-fullname"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="chk-fullname"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Aarav Mehta"
                  className="w-full border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                />
                {errors.fullName && (
                  <p role="alert" className="text-[11px] text-[#E85D3F] mt-0.5">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="chk-email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="aarav@novaire.studio"
                    className="w-full border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                  />
                  {errors.email && (
                    <p role="alert" className="text-[11px] text-[#E85D3F] mt-0.5">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="chk-phone"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                  />
                  {errors.phone && (
                    <p role="alert" className="text-[11px] text-[#E85D3F] mt-0.5">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="chk-address"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                >
                  Shipping Street Address *
                </label>
                <input
                  id="chk-address"
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="42, 100 Feet Road, Indiranagar"
                  className="w-full border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                />
                {errors.address && (
                  <p role="alert" className="text-[11px] text-[#E85D3F] mt-0.5">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="chk-city"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                  >
                    City *
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Bengaluru"
                    className="w-full border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                  />
                  {errors.city && (
                    <p role="alert" className="text-[11px] text-[#E85D3F] mt-0.5">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="chk-postal"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                  >
                    Postal Code *
                  </label>
                  <input
                    id="chk-postal"
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    placeholder="560038"
                    className="w-full border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                  />
                  {errors.postalCode && (
                    <p role="alert" className="text-[11px] text-[#E85D3F] mt-0.5">
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="chk-country"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="chk-country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-neutral-300 px-3 py-2 text-xs text-[#111111] bg-white"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="UAE">United Arab Emirates</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  SHOPIFY PAYMENT METHOD
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ['SHOPIFY_PAY', 'Shop Pay / Card'],
                      ['UPI', 'UPI Instant Pay'],
                      ['COD', 'Cash on Delivery (COD)'],
                      ['CARD', 'International Credit Card'],
                    ] as [CheckoutFormInput['paymentMethod'], string][]
                  ).map(([method, label]) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: method })}
                      className={`py-2.5 px-3 text-left text-xs font-semibold border cursor-pointer ${
                        form.paymentMethod === method
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-white text-[#111111] border-neutral-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-2.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('CART')}
                  className="px-4 py-3 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-neutral-100 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Complete Shopify Order · {formatPrice(totals.totalInr, currency)}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER CONFIRMATION */}
        {step === 'CONFIRMED' && confirmedOrder && (
          <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Order #{confirmedOrder.orderNumber} Confirmed
                  </h3>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you, <strong>{confirmedOrder.customer.fullName}</strong>! Your order has been synced with <strong>Shopify Admin</strong> and queued at the NOVAIRE Print-on-Demand facility.
                </p>
              </div>

              <div className="border border-neutral-200 p-4 space-y-2 text-xs">
                <div className="font-bold uppercase tracking-wider text-neutral-500 text-[10px]">
                  FULFILLMENT &amp; SHIPPING DETAILS
                </div>
                <p className="font-semibold text-[#111111]">
                  Status: {confirmedOrder.status}
                </p>
                <p className="text-neutral-600">
                  Ship to: {confirmedOrder.customer.address}, {confirmedOrder.customer.city}{' '}
                  {confirmedOrder.customer.postalCode}, {confirmedOrder.customer.country}
                </p>
                <p className="text-neutral-600">
                  Payment: {confirmedOrder.customer.paymentMethod} · Total Paid:{' '}
                  <strong className="text-[#111111] tabular-nums">
                    {formatPrice(confirmedOrder.totalInr, currency)}
                  </strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep('CART');
                onClose();
              }}
              className="w-full py-3.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 cursor-pointer"
            >
              Continue Shopping at Novaire
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface WishlistDrawerProps {
  isOpen: boolean;
  wishlistIds: string[];
  allProducts: Product[];
  currency: CurrencyCode;
  onClose: () => void;
  onToggleWishlist: (id: string) => void;
  onMoveToBag: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  wishlistIds,
  allProducts,
  currency,
  onClose,
  onToggleWishlist,
  onMoveToBag,
}) => {
  if (!isOpen) return null;

  const savedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Saved Wishlist Items"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[1px]"
    >
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-fade-slide">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#E85D3F] fill-[#E85D3F]" />
            <h2 className="font-display text-lg font-bold uppercase tracking-[0.16em] text-[#111111]">
              SAVED WISHLIST ({savedProducts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="p-1.5 text-neutral-500 hover:text-[#111111] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {savedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Heart className="w-9 h-9 text-neutral-300 mx-auto stroke-[1.25]" />
              <p className="text-sm font-semibold text-[#111111]">
                No saved styles yet
              </p>
              <p className="text-xs text-neutral-500">
                Tap the heart icon on any shirt, flannel, sweater, or jacket to save it for later.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {savedProducts.map((prod) => (
                <li key={prod.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-24 object-cover object-top bg-[#EFEFEF] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[#111111] truncate">
                      {prod.title}
                    </h3>
                    <p className="text-xs font-bold text-[#111111] mt-0.5 tabular-nums">
                      {formatPrice(prod.priceInr, currency)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onMoveToBag(prod)}
                        className="px-3 py-1 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
                      >
                        Move to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(prod.id)}
                        className="text-[11px] text-neutral-500 hover:text-[#E85D3F] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
