import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  UtensilsCrossed, 
  Star, 
  Sparkles,
  Search,
  CheckCircle2,
  ChevronUp
} from 'lucide-react';
import { 
  Product, 
  Category, 
  Table, 
  Order, 
  Employee, 
  Customer, 
  RestaurantSettings, 
  CartItem, 
  ProductExtra 
} from './types';
import { DataStore } from './services/storage';
import { FirebaseService } from './services/firebase';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { StaffModal } from './components/StaffModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { WaiterView } from './components/waiter/WaiterView';
import { AdminPanel } from './components/admin/AdminPanel';

export default function App() {
  // Global Data Store States
  const [settings, setSettings] = useState<RestaurantSettings>(DataStore.getSettings());
  const [categories, setCategories] = useState<Category[]>(DataStore.getCategories());
  const [products, setProducts] = useState<Product[]>(DataStore.getProducts());
  const [tables, setTables] = useState<Table[]>(DataStore.getTables());
  const [orders, setOrders] = useState<Order[]>(DataStore.getOrders());
  const [employees, setEmployees] = useState<Employee[]>(DataStore.getEmployees());
  const [customers, setCustomers] = useState<Customer[]>(DataStore.getCustomers());
  const [currentUser, setCurrentUser] = useState<Employee | null>(DataStore.getCurrentUser());

  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'MENU' | 'WAITER' | 'ADMIN'>('MENU');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState<boolean>(false);

  // Cart & Order Target State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTableForOrder, setActiveTableForOrder] = useState<Table | null>(null);
  const [lastOrderSuccess, setLastOrderSuccess] = useState<Order | null>(null);

  // Subscribe to reactive storage updates
  useEffect(() => {
    const unsubscribe = DataStore.subscribe(() => {
      setSettings(DataStore.getSettings());
      setCategories(DataStore.getCategories());
      setProducts(DataStore.getProducts());
      setTables(DataStore.getTables());
      setOrders(DataStore.getOrders());
      setEmployees(DataStore.getEmployees());
      setCustomers(DataStore.getCustomers());
      setCurrentUser(DataStore.getCurrentUser());
    });

    // Check URL query param for table (e.g. from QR Code ?mesa=Mesa%2004)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mesaParam = params.get('mesa');
      if (mesaParam) {
        const allTables = DataStore.getTables();
        const found = allTables.find((t) => t.number.toLowerCase() === mesaParam.toLowerCase());
        if (found) {
          setActiveTableForOrder(found);
        }
      }
    }

    // Try background Firebase init if config was saved
    const fbConfig = DataStore.getFirebaseConfig();
    if (fbConfig) {
      FirebaseService.initialize(fbConfig);
    }

    return () => unsubscribe();
  }, []);

  // Calculate Product counts by Category
  const productCountsByCategory = useMemo(() => {
    return products.reduce((acc, prod) => {
      acc[prod.categoryId] = (acc[prod.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  // Cart count
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Add product from Modal with custom extras and notes
  const handleAddToCart = (
    product: Product,
    quantity: number,
    selectedExtras: ProductExtra[],
    notes: string
  ) => {
    const basePrice = product.promoPrice && product.promoPrice < product.price
      ? product.promoPrice
      : product.price;

    const extrasTotal = selectedExtras.reduce((sum, ex) => sum + ex.price, 0);
    const unitPrice = basePrice + extrasTotal;
    const totalPrice = unitPrice * quantity;

    // Check if an identical item already exists in cart (same product, same extras, same notes)
    const existingIndex = cartItems.findIndex((ci) => {
      if (ci.product.id !== product.id) return false;
      if (ci.notes !== notes) return false;
      if (ci.selectedExtras.length !== selectedExtras.length) return false;
      return ci.selectedExtras.every((e) => selectedExtras.some((se) => se.id === e.id));
    });

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].totalPrice = updated[existingIndex].unitPrice * updated[existingIndex].quantity;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          product,
          quantity,
          selectedExtras,
          notes,
          unitPrice,
          totalPrice,
        },
      ]);
    }

    setIsCartOpen(true);
  };

  // Quick add 1 unit directly from card
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(product, 1, [], '');
  };

  // Update Cart quantity
  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    updated[index].totalPrice = updated[index].unitPrice * newQty;
    setCartItems(updated);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filtered Products for public menu
  const displayProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (selectedCategoryId !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === selectedCategoryId);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      );
    }

    // Sort by order
    return [...filtered].sort((a, b) => a.order - b.order);
  }, [products, selectedCategoryId, searchQuery]);

  // Featured Products
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured && p.available);
  }, [products]);

  // Waiter flow: select table and jump to menu with that table bound
  const handleSelectTableForOrder = (table: Table) => {
    setActiveTableForOrder(table);
    setViewMode('MENU');
    const menuEl = document.getElementById('menu-section');
    if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    DataStore.setCurrentUser(null);
    setCurrentUser(null);
    setViewMode('MENU');
  };

  return (
    <div className="min-h-screen bg-[#0c0907] text-[#ede4d8] flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#140e08]">
      {/* Network Connectivity Status */}
      <OfflineIndicator />

      {/* RENDER VIEW BASED ON MODE */}

      {/* 1. Admin Panel View */}
      {viewMode === 'ADMIN' && currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER') ? (
        <AdminPanel
          currentUser={currentUser}
          settings={settings}
          categories={categories}
          products={products}
          tables={tables}
          orders={orders}
          employees={employees}
          customers={customers}
          onBackToMenu={() => setViewMode('MENU')}
          onLogout={handleLogout}
        />
      ) : viewMode === 'WAITER' && currentUser ? (
        /* 2. Waiter Service View */
        <WaiterView
          currentUser={currentUser}
          settings={settings}
          tables={tables}
          orders={orders}
          onBackToMenu={() => setViewMode('MENU')}
          onSelectTableForOrder={handleSelectTableForOrder}
        />
      ) : (
        /* 3. Main Customer Digital Menu View */
        <div className="flex-1 flex flex-col">
          {/* Top Sticky Navigation */}
          <Navbar
            settings={settings}
            cartCount={cartItemCount}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenStaffModal={() => setIsStaffModalOpen(true)}
            onOpenSearch={(q) => setSearchQuery(q)}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAdmin={() => setViewMode('ADMIN')}
            onOpenWaiterView={() => setViewMode('WAITER')}
            activeTable={activeTableForOrder}
          />

          {/* Active Table Notification for Customer or Waiter */}
          {activeTableForOrder && (
            <div className="bg-gradient-to-r from-[#2a1d10] via-[#1f150b] to-[#2a1d10] border-b border-[#3d2b1a] px-4 py-2 text-center text-xs flex items-center justify-center gap-2 text-[#fae092]">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>
                Atendimento ativo para a <strong>{activeTableForOrder.number}</strong>
              </span>
              <button
                onClick={() => setActiveTableForOrder(null)}
                className="ml-2 text-[10px] text-[#a39482] hover:text-white underline"
              >
                Mudar
              </button>
            </div>
          )}

          {/* Order Success Banner */}
          {lastOrderSuccess && (
            <div className="bg-emerald-950/90 border-b border-emerald-600/40 px-4 py-3 text-center text-xs text-emerald-200 flex items-center justify-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Pedido <strong>{lastOrderSuccess.id}</strong> enviado com sucesso para o WhatsApp! Acompanhe com a equipa.
              </span>
              <button
                onClick={() => setLastOrderSuccess(null)}
                className="text-xs text-emerald-400 font-bold underline ml-2"
              >
                Dispensar
              </button>
            </div>
          )}

          {/* Hero Section */}
          <Hero
            settings={settings}
            onScrollToMenu={scrollToMenu}
            onOpenOrder={() => {
              if (cartItems.length > 0) {
                setIsCheckoutOpen(true);
              } else {
                scrollToMenu();
              }
            }}
          />

          {/* Category Filter Bar (Sticky) */}
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
            productCountsByCategory={productCountsByCategory}
          />

          {/* Menu Main Section */}
          <main id="menu-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
            {/* Search Query Feedback */}
            {searchQuery.trim() && (
              <div className="mb-6 flex items-center justify-between p-3 rounded-xl border border-[#342416] bg-[#160f0a]">
                <p className="text-xs text-[#c9b9a6]">
                  Resultados para: <strong className="text-[#fae092]">"{searchQuery}"</strong> ({displayProducts.length} encontrados)
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#d4af37] hover:underline font-semibold"
                >
                  Limpar pesquisa
                </button>
              </div>
            )}

            {/* Featured Section (Visible on 'all' view when no search active) */}
            {selectedCategoryId === 'all' && !searchQuery.trim() && featuredProducts.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1 rounded-md bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#faeee0] font-heading uppercase tracking-wider">
                      Especialidades & Destaques Comanchero
                    </h2>
                    <p className="text-xs text-[#9d8d7b]">
                      Os cortes nobres, kebabs e mocktails mais aclamados do nosso restaurante
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={`feat-${product.id}`}
                      product={product}
                      currency={settings.currency}
                      onOpenDetails={(p) => setSelectedProductForModal(p)}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Dish Grid */}
            <div>
              <div className="flex items-center justify-between mb-5 pb-2 border-b border-[#26190f]">
                <h2 className="text-base sm:text-lg font-black text-[#faeee0] font-heading uppercase tracking-wider">
                  {selectedCategoryId === 'all'
                    ? 'Cardápio Completo'
                    : categories.find((c) => c.id === selectedCategoryId)?.name || 'Pratos'}
                </h2>
                <span className="text-xs text-[#9a8976] font-mono">
                  {displayProducts.length} opções disponíveis
                </span>
              </div>

              {displayProducts.length === 0 ? (
                <div className="p-12 rounded-2xl border border-[#2d1e13] bg-[#140e09] text-center max-w-md mx-auto my-8">
                  <UtensilsCrossed className="w-10 h-10 text-[#6e5d4a] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#cfc2af] font-heading">
                    Nenhum prato encontrado
                  </h3>
                  <p className="mt-1 text-xs text-[#8f806e]">
                    Tente selecionar outra categoria ou verificar os termos da sua pesquisa.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategoryId('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#261a10] border border-[#d4af37]/40 text-[#fae092] text-xs font-bold hover:border-[#d4af37]"
                  >
                    Ver todos os pratos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={settings.currency}
                      onOpenDetails={(p) => setSelectedProductForModal(p)}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Floating WhatsApp Quick Contact Button */}
          <FloatingWhatsApp settings={settings} />

          {/* Floating Cart Button on Mobile if items exist */}
          {cartItems.length > 0 && (
            <div className="fixed bottom-5 left-5 z-40 sm:hidden">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-black text-xs uppercase shadow-2xl active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#140e08]" />
                <span>Ver Pedido ({cartItemCount})</span>
              </button>
            </div>
          )}

          {/* Western Luxury Restaurant Footer */}
          <footer className="mt-16 border-t border-[#26190f] bg-[#090604] text-[#a0907e] text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Col 1: Brand Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={settings.logo || '/icon.svg'}
                      alt={settings.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/icon.svg';
                      }}
                    />
                    <span className="text-lg font-black uppercase tracking-widest text-[#faeee0] font-heading">
                      {settings.name}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#8a7b6a]">
                    {settings.aboutText}
                  </p>
                  <p className="text-[10px] text-[#635546]">
                    Restaurante sem bebidas alcoólicas • Carnes selecionadas e mocktails artesanais.
                  </p>
                </div>

                {/* Col 2: Location & Contact */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-heading">
                    Localização & Contactos
                  </h4>
                  <p className="flex items-start gap-2 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <span>{settings.address}</span>
                  </p>
                  {settings.phone && (
                    <p className="flex items-center gap-2 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                      <a href={`tel:${settings.phone}`} className="hover:text-[#fae092]">
                        {settings.phone}
                      </a>
                    </p>
                  )}
                  {settings.googleMapsUrl && (
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-[#d4af37] hover:underline pt-1"
                    >
                      <span>📍 Ver no Google Maps</span>
                    </a>
                  )}
                </div>

                {/* Col 3: Hours & Service */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-heading">
                    Horário de Funcionamento
                  </h4>
                  <p className="flex items-center gap-2 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                    <span>{settings.openingHours}</span>
                  </p>
                  <div className="pt-2">
                    <PWAInstallButton />
                  </div>
                </div>

                {/* Col 4: Staff & Admin Access */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-heading">
                    Área Operacional
                  </h4>
                  <p className="text-[11px] text-[#7d6e5d]">
                    Acesso restrito para funcionários de mesa, gerência e administração do sistema.
                  </p>
                  <button
                    id="btn-footer-staff-login"
                    onClick={() => setIsStaffModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#382819] bg-[#17100a] text-xs font-semibold text-[#fae092] hover:border-[#d4af37] transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span>Login Funcionário / Admin</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1a120b] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6e5f50]">
                <p>© {new Date().getFullYear()} {settings.name}. Todos os direitos reservados.</p>
                <p>Desenvolvido para {settings.website || 'comancherooo.com'} • Maputo, Moçambique</p>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ALL MODALS & DRAWERS */}

      {/* 1. Dish Customization Modal */}
      <ProductModal
        product={selectedProductForModal}
        currency={settings.currency}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={settings.currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout & WhatsApp Dispatcher Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        settings={settings}
        tables={tables}
        currentUser={currentUser}
        selectedTable={activeTableForOrder}
        onOrderSuccess={(order) => {
          setCartItems([]);
          setLastOrderSuccess(order);
        }}
      />

      {/* 4. Staff & Admin Authentication Modal */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onLoginSuccess={(emp) => {
          if (emp.role === 'WAITER') {
            setViewMode('WAITER');
          } else {
            setViewMode('ADMIN');
          }
        }}
      />
    </div>
  );
}
