import React from 'react';
import { MessageSquare } from 'lucide-react';
import { RestaurantSettings } from '../types';

export const FloatingWhatsApp: React.FC<{ settings: RestaurantSettings }> = ({ settings }) => {
  const number = settings.whatsappCasaActive && settings.whatsappCasa
    ? settings.whatsappCasa.replace(/\D/g, '')
    : settings.whatsappLojaActive && settings.whatsappLoja
    ? settings.whatsappLoja.replace(/\D/g, '')
    : '';

  if (!number) return null;

  const url = `https://wa.me/${number}?text=${encodeURIComponent('Olá Comanchero! Gostaria de fazer uma reserva ou tirar dúvidas sobre o menu.')}`;

  return (
    <a
      id="floating-whatsapp-btn"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-3 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba59] active:scale-95 transition-all group duration-300"
      title="Falar com o Restaurante via WhatsApp"
      aria-label="Falar com Comanchero pelo WhatsApp"
    >
      <MessageSquare className="w-5 h-5 fill-white text-[#25D366] group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline font-bold text-xs tracking-wide">
        WhatsApp Comanchero
      </span>
    </a>
  );
};
