import React, { useState } from 'react';
import {
  X,
  Code2,
  Package,
  Layers,
  Copy,
  Check,
  PlusCircle,
  MapPin,
  Store,
  Terminal,
} from 'lucide-react';
import {
  type Product,
  type ShopifyOrder,
  type CurrencyCode,
  TECH_STACK_SPEC,
  generateShopifyThemeFiles,
  formatPrice,
} from '../utils/storeLogic';

interface ShopifyTechModalProps {
  isOpen: boolean;
  initialTab: 'STACK' | 'ADMIN' | 'LIQUID';
  orders: ShopifyOrder[];
  products: Product[];
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateOrderStatus: (orderNumber: string, status: ShopifyOrder['status']) => void;
  onAddNewProduct: (newProd: Product) => void;
}

export const ShopifyTechModal: React.FC<ShopifyTechModalProps> = ({
  isOpen,
  initialTab,
  orders,
  products,
  currency,
  onClose,
  onUpdateOrderStatus,
  onAddNewProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'STACK' | 'ADMIN' | 'LIQUID'>(initialTab);
  const [selectedFile, setSelectedFile] = useState<string>('templates/index.json');
  const [copied, setCopied] = useState(false);

  // New POD product form in Shopify Admin
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('1499');
  const [newCategory, setNewCategory] = useState<Product['category']>('SHIRTS');
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const themeFiles = generateShopifyThemeFiles('NOVAIRE');
  const fileNames = Object.keys(themeFiles);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(themeFiles[selectedFile] || '');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || Number(newPrice) <= 0) {
      setFormError('Please enter a valid product title and price.');
      return;
    }
    setFormError('');
    const created: Product = {
      id: `nov-custom-${Date.now()}`,
      title: newTitle.trim(),
      priceInr: Number(newPrice),
      category: newCategory,
      subTags: ['FLANNEL_EDIT', 'HAND_EMBROIDERED'],
      image: '/assets/nova/prod-2.png',
      swatches: ['#111111', '#5A6B7C', '#8B262B'],
      extraColorsCount: 3,
      sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
      sku: `NOV-POD-${products.length + 1}`,
      gsm: '240 GSM',
      fabric: '100% Custom POD Heavyweight Combed Cotton',
      podReady: true,
    };
    onAddNewProduct(created);
    setNewTitle('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopify OS 2.0 Admin and Technical Architecture"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-[2px]"
    >
      <div className="bg-white w-full max-w-5xl max-h-[88vh] shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-fade-slide">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold uppercase tracking-[0.18em]">
              NOVAIRE × SHOPIFY OS 2.0
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              Store Management · Liquid &amp; JSON Templates · Shopify CLI
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Shopify Admin modal"
            className="p-1 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ADMIN')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ADMIN'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-neutral-500 hover:text-[#111111]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Shopify Admin (Products &amp; Orders)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('LIQUID')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'LIQUID'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-neutral-500 hover:text-[#111111]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Liquid &amp; JSON Theme Files</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STACK')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'STACK'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-neutral-500 hover:text-[#111111]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>11-Layer Technical Flow</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: SHOPIFY ADMIN */}
          {activeTab === 'ADMIN' && (
            <div className="space-y-8">
              {/* Live Orders Queue */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#111111] mb-3">
                  SHOPIFY ADMIN — LIVE POD ORDERS ({orders.length})
                </h3>
                {orders.length === 0 ? (
                  <div className="border border-neutral-200 bg-neutral-50 p-6 text-center text-xs text-neutral-500">
                    No customer orders placed in this session yet. Add any garment to your bag and complete Shopify Checkout to see live order synchronization here.
                  </div>
                ) : (
                  <div className="border border-neutral-200 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                        <tr>
                          <th className="py-2.5 px-3">Order ID</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Items &amp; POD Specs</th>
                          <th className="py-2.5 px-3">Total</th>
                          <th className="py-2.5 px-3">POD Fulfillment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {orders.map((ord) => (
                          <tr key={ord.orderNumber}>
                            <td className="py-3 px-3 font-mono-code font-bold text-[#111111]">
                              #{ord.orderNumber}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-[#111111]">
                                {ord.customer.fullName}
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                {ord.customer.city}, {ord.customer.country}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              {ord.items.map((it) => (
                                <div key={it.cartItemId} className="text-[11px]">
                                  {it.quantity}× {it.product.title} ({it.selectedSize})
                                  {it.pod.enabled && it.pod.technique !== 'NONE' && (
                                    <span className="ml-1 text-[#E85D3F] font-semibold">
                                      [POD: {it.pod.technique.replace('_', ' ')}]
                                    </span>
                                  )}
                                </div>
                              ))}
                            </td>
                            <td className="py-3 px-3 font-bold tabular-nums">
                              {formatPrice(ord.totalInr, currency)}
                            </td>
                            <td className="py-3 px-3">
                              <select
                                aria-label={`Update status for order ${ord.orderNumber}`}
                                value={ord.status}
                                onChange={(e) =>
                                  onUpdateOrderStatus(
                                    ord.orderNumber,
                                    e.target.value as ShopifyOrder['status']
                                  )
                                }
                                className="border border-neutral-300 bg-white px-2 py-1 text-[11px] font-medium text-[#111111]"
                              >
                                <option value="Confirmed — Sent to POD Print Queue">
                                  Confirmed — Sent to POD Print Queue
                                </option>
                                <option value="In DTG Production">
                                  In DTG Production
                                </option>
                                <option value="Ready for Dispatch">
                                  Ready for Dispatch
                                </option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Publish New Custom POD Product to Storefront */}
              <div className="border border-neutral-200 p-5 bg-neutral-50/70">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#111111] mb-3 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#E85D3F]" />
                  <span>PUBLISH NEW POD PRODUCT TO STOREFRONT ({products.length} ACTIVE SKUS)</span>
                </h3>
                <form
                  onSubmit={handleCreateProduct}
                  noValidate
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="admin-prod-title"
                      className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1"
                    >
                      Product Title *
                    </label>
                    <input
                      id="admin-prod-title"
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Heavyweight Acid Wash Graphic Flannel"
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="admin-prod-cat"
                      className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="admin-prod-cat"
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(e.target.value as Product['category'])
                      }
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-[#111111]"
                    >
                      <option value="SHIRTS">SHIRTS</option>
                      <option value="SWEATERS">SWEATERS</option>
                      <option value="JACKETS">JACKETS</option>
                      <option value="JEANS">JEANS</option>
                      <option value="TROUSERS">TROUSERS</option>
                      <option value="HOODIES">HOODIES</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="admin-prod-price"
                      className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1"
                    >
                      Price (INR ₹)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="admin-prod-price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs text-[#111111] tabular-nums"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 shrink-0 cursor-pointer"
                      >
                        Add SKU
                      </button>
                    </div>
                  </div>
                </form>
                {formError && (
                  <p role="alert" className="text-[11px] text-[#E85D3F] mt-2">
                    {formError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LIQUID & JSON TEMPLATES */}
          {activeTab === 'LIQUID' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {fileNames.map((fname) => (
                    <button
                      key={fname}
                      type="button"
                      onClick={() => setSelectedFile(fname)}
                      className={`px-3 py-1.5 text-xs font-mono-code border cursor-pointer ${
                        selectedFile === fname
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-neutral-100 text-[#111111] border-neutral-300 hover:bg-neutral-200'
                      }`}
                    >
                      {fname}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-700 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy File</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-[#111111] text-neutral-100 p-4 text-xs font-mono-code overflow-x-auto leading-relaxed border border-neutral-800 max-h-[52vh]">
                <code>{themeFiles[selectedFile]}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: 11-LAYER TECHNICAL STACK TABLE */}
          {activeTab === 'STACK' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#111111]">
                  NOVAIRE — SHOPIFY PRINT-ON-DEMAND TECHNICAL ARCHITECTURE
                </h3>
                <span className="text-xs font-mono-code text-neutral-500 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  shopify theme dev
                </span>
              </div>

              <div className="border border-neutral-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    <tr>
                      <th className="py-3 px-4">Layer</th>
                      <th className="py-3 px-4">Technology</th>
                      <th className="py-3 px-4">Purpose in Novaire Store</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {TECH_STACK_SPEC.map((row) => (
                      <tr key={row.layer} className="hover:bg-neutral-50">
                        <td className="py-2.5 px-4 font-semibold text-[#111111]">
                          {row.layer}
                        </td>
                        <td className="py-2.5 px-4 font-mono-code font-semibold text-[#E85D3F]">
                          {row.technology}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-600">
                          {row.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StoresModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoresModal: React.FC<StoresModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const hubs = [
    {
      city: 'BENGALURU FLAGSHIP & POD ATELIER',
      address: '100 Feet Road, Indiranagar, Bengaluru 560038',
      hours: '10:30 AM – 9:30 PM IST · Live DTG & Embroidery Bar',
    },
    {
      city: 'MUMBAI STUDIO STORE',
      address: 'Linking Road, Bandra West, Mumbai 400050',
      hours: '11:00 AM – 10:00 PM IST · Flannel Edit & Bespoke Fitting',
    },
    {
      city: 'NEW DELHI DESIGN HUB',
      address: 'Khan Market & Select Citywalk, Saket, New Delhi 110017',
      hours: '11:00 AM – 9:30 PM IST · Full Menswear Collection',
    },
    {
      city: 'LONDON & EU POD FULFILLMENT HUB',
      address: 'Shoreditch High Street, London E1 6JE, UK',
      hours: '48-Hour Express Dispatch across UK & Europe',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Novaire Offline Stores and Global Fulfillment Studios"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
    >
      <div className="bg-white w-full max-w-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-fade-slide">
        <div className="px-6 py-4 bg-[#111111] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#E85D3F]" />
            <h2 className="font-display text-lg font-bold uppercase tracking-[0.16em]">
              NOVAIRE STORES &amp; GLOBAL POD HUBS
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close stores modal"
            className="p-1 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hubs.map((hub) => (
            <div
              key={hub.city}
              className="border border-neutral-200 p-4 space-y-1.5 bg-neutral-50"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <MapPin className="w-3.5 h-3.5 text-[#E85D3F] shrink-0" />
                <span>{hub.city}</span>
              </div>
              <p className="text-xs text-neutral-600">{hub.address}</p>
              <p className="text-[11px] font-mono-code text-neutral-500">
                {hub.hours}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
