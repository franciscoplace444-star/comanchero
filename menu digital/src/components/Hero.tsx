import React from 'react';
import { 
  Compass, 
  ShoppingBag, 
  MapPin, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Globe, 
  ExternalLink,
  Phone,
  Sparkles
} from 'lucide-react';
import { RestaurantSettings } from '../types';

interface HeroProps {
  settings: RestaurantSettings;
  onScrollToMenu: () => void;
  onOpenOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onScrollToMenu,
  onOpenOrder,
}) => {
  // Build direct WhatsApp link
  const primaryWhatsApp = settings.whatsappCasaActive && settings.whatsappCasa
    ? settings.whatsappCasa.replace(/\D/g, '')
    : settings.whatsappLojaActive && settings.whatsappLoja
    ? settings.whatsappLoja.replace(/\D/g, '')
    : '';

  const whatsappHref = primaryWhatsApp
    ? `https://wa.me/${primaryWhatsApp}?text=${encodeURIComponent('Olá Comanchero! Gostaria de consultar o menu e fazer um pedido.')}`
    : '#';

  return (
    <section id="topo" className="relative w-full overflow-hidden border-b border-[#2b2116] bg-[#0c0907]">
      {/* Background Image with layered Western dark wood & warm smoke gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.coverImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80'}
          alt="Ambiente Comanchero"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-75 scale-105 transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0907] via-[#0c0907]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0907] via-transparent to-[#0c0907]/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16 text-center">
        {/* Brand Emblem */}
        <div className="inline-flex items-center justify-center mb-5">
          <div className="relative p-2 rounded-2xl border border-[#d4af37]/40 bg-[#19110a]/90 backdrop-blur-md shadow-2xl">
            <img
              src={settings.logo || '/icon.svg'}
              alt={settings.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
            <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#c92a2a] text-[#fff] text-[9px] font-black uppercase tracking-widest shadow">
              Maputo
            </div>
          </div>
        </div>

        {/* Restaurant Name with Western luxury gold gradient */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-widest uppercase text-[#f7eedc] font-heading drop-shadow-md">
          {settings.name}
        </h1>

        {/* Tagline / Subtitle */}
        <p className="mt-2 text-sm sm:text-lg text-[#d4af37] font-medium tracking-wider">
          {settings.tagline}
        </p>

        {/* Small Description */}
        <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-sm text-[#b8ab9a] leading-relaxed">
          {settings.aboutText}
        </p>

        {/* Quick Location & Phone Info */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#a09381]">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            {settings.address}
          </span>
          {settings.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#d4af37]" />
              {settings.phone}
            </span>
          )}
        </div>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            id="btn-hero-menu"
            onClick={onScrollToMenu}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f24] text-[#140e08] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition"
          >
            <Compass className="w-4 h-4 text-[#140e08]" />
            <span>VER MENU</span>
          </button>

          <button
            id="btn-hero-order"
            onClick={onOpenOrder}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl border border-[#d4af37]/60 bg-[#24170e]/80 text-[#f5ebd6] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#332114] hover:border-[#d4af37] active:scale-95 transition"
          >
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
            <span>FAZER PEDIDO</span>
          </button>

          {/* Location / Google Maps Button */}
          {settings.googleMapsUrl && (
            <a
              id="btn-hero-maps"
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#3b2d1f] bg-[#16100a]/80 text-[#cfc2af] text-xs sm:text-sm font-semibold hover:text-[#d4af37] hover:border-[#d4af37] transition"
            >
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span>📍 COMO CHEGAR</span>
            </a>
          )}
        </div>

        {/* Social Networks & WhatsApp Channel (Clean & conditional) */}
        <div className="mt-8 pt-6 border-t border-[#241b12] flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* WhatsApp Direct */}
          {primaryWhatsApp && (
            <a
              id="btn-social-whatsapp"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#25D366]/40 bg-[#162719]/60 text-[#86efac] text-xs font-semibold hover:border-[#25D366] hover:bg-[#162719] transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Restaurante</span>
            </a>
          )}

          {/* Instagram */}
          {settings.instagram && (
            <a
              id="btn-social-instagram"
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#382a1d] bg-[#18110a] text-[#cfc2af] text-xs hover:text-[#e1306c] hover:border-[#e1306c]/40 transition"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
          )}

          {/* Facebook */}
          {settings.facebook && (
            <a
              id="btn-social-facebook"
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#382a1d] bg-[#18110a] text-[#cfc2af] text-xs hover:text-[#1877f2] hover:border-[#1877f2]/40 transition"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </a>
          )}

          {/* Website */}
          {settings.website && (
            <a
              id="btn-social-website"
              href={settings.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#382a1d] bg-[#18110a] text-[#cfc2af] text-xs hover:text-[#d4af37] hover:border-[#d4af37]/40 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{settings.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
