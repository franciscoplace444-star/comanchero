import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  UserCircle, 
  MapPin, 
  Clock, 
  UtensilsCrossed, 
  LogOut,
  ShieldCheck,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { RestaurantSettings, Employee, Table } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  settings: RestaurantSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenStaffModal: () => void;
  onOpenSearch: (query: string) => void;
  currentUser: Employee | null;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenWaiterView: () => void;
  activeTable?: Table | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenStaffModal,
  onOpenSearch,
  currentUser,
  onLogout,
  onOpenAdmin,
  onOpenWaiterView,
  activeTable,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenSearch(searchVal);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2b2116] bg-[#120e0a]/95 backdrop-blur-md transition-all shadow-lg">
      {/* Top micro bar with location and schedule */}
      <div className="hidden sm:flex items-center justify-between px-4 lg:px-8 py-1.5 border-b border-[#221a12] text-[11px] text-[#a39785]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            {settings.address}
          </span>
          <span className="text-[#3b2e21]">|</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            {settings.openingHours}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <PWAInstallButton compact />
          {settings.phone && (
            <a 
              href={`tel:${settings.phone}`}
              className="text-[#d4af37] hover:underline"
            >
              {settings.phone}
            </a>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <a 
          href="#topo" 
          className="flex items-center gap-2.5 sm:gap-3 group select-none"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#d4af37]/40 bg-[#1e150d] p-1 flex items-center justify-center shadow-md group-hover:border-[#d4af37] transition">
            <img 
              src={settings.logo || '/icon.svg'} 
              alt={settings.name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                // fallback to default svg
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-black tracking-widest text-[#f5e9d3] font-heading group-hover:text-[#d4af37] transition">
                {settings.name}
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border border-[#d4af37]/40 text-[#d4af37] bg-[#2a1d12]">
                Maputo
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#9d907d] tracking-wider uppercase font-medium">
              Menu Digital & Bar
            </p>
          </div>
        </a>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Pesquisar grelhados, kebabs, mocktails..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onOpenSearch(e.target.value);
              }}
              className="w-full rounded-full border border-[#3b2e21] bg-[#1a130c] pl-10 pr-4 py-2 text-xs text-[#ede4d8] placeholder-[#7d7160] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#8f816f]" />
            {searchVal && (
              <button
                type="button"
                onClick={() => {
                  setSearchVal('');
                  onOpenSearch('');
                }}
                className="absolute right-3 top-2.5 text-xs text-[#8f816f] hover:text-white"
              >
                Limpar
              </button>
            )}
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            id="btn-search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-lg border border-[#2e2317] bg-[#1a130c] text-[#cfc2af] hover:text-[#d4af37]"
            aria-label="Pesquisar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Active Table Badge if selected */}
          {activeTable && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e9d3] text-xs font-semibold">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{activeTable.number}</span>
            </div>
          )}

          {/* Staff Mode Access / Logged in profile */}
          {currentUser ? (
            <div className="flex items-center gap-1 sm:gap-2">
              {currentUser.role === 'WAITER' ? (
                <button
                  id="btn-nav-waiter"
                  onClick={onOpenWaiterView}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#d4af37]/50 bg-[#281b10] text-[#f4e4b5] text-xs font-semibold hover:border-[#d4af37]"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="hidden sm:inline">Modo Servente</span>
                </button>
              ) : (
                <button
                  id="btn-nav-admin"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#d4af37]/50 bg-[#281b10] text-[#f4e4b5] text-xs font-semibold hover:border-[#d4af37]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="hidden sm:inline">Painel Admin</span>
                </button>
              )}

              <button
                id="btn-nav-logout"
                onClick={onLogout}
                className="p-1.5 rounded-lg border border-[#3b2416] text-[#b49885] hover:text-[#f87171] hover:border-[#f87171] transition"
                title="Sair da sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-staff-login"
              onClick={onOpenStaffModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#382b1d] bg-[#1a130c] text-[#cfc2af] text-xs font-medium hover:border-[#d4af37] hover:text-[#f4e4b5] transition"
              title="Acesso Garçom / Administrador"
            >
              <UserCircle className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">Acesso Equipa</span>
            </button>
          )}

          {/* Cart Trigger Button */}
          <button
            id="btn-nav-cart"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f24] text-[#140e08] font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#140e08]" />
            <span className="hidden sm:inline">Pedido</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#17100a] text-[#f8e49b] text-xs font-extrabold border border-[#d4af37]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search expanded bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#241a11] bg-[#16100a]">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Pesquisar pratos, carnes, sumos..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onOpenSearch(e.target.value);
              }}
              autoFocus
              className="w-full rounded-lg border border-[#3b2e21] bg-[#100b07] pl-10 pr-10 py-2.5 text-xs text-[#ede4d8] placeholder-[#7d7160] focus:border-[#d4af37] focus:outline-none"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8f816f]" />
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchVal('');
                onOpenSearch('');
              }}
              className="absolute right-3 top-3 text-[#8f816f]"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
