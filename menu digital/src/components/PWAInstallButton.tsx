import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="btn-install-pwa"
        onClick={install}
        className={`flex items-center gap-2 rounded-lg border border-[#d4af37]/40 bg-gradient-to-r from-[#2a1e12] to-[#1d150c] text-[#f4e4b5] hover:border-[#d4af37] hover:text-[#faeed0] transition shadow-sm ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs font-semibold'
        }`}
        title="Instalar aplicativo no seu celular"
      >
        <Download className="w-3.5 h-3.5 text-[#d4af37]" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-2 rounded-lg border border-[#d4af37]/40 bg-[#1d150c] text-[#f4e4b5] hover:border-[#d4af37] transition ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs font-semibold'
          }`}
          title="Instalar no iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>App iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-xl border border-[#d4af37]/30 bg-[#140f0a] p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2116]">
                <h3 className="text-base font-bold text-[#f4e4b5] font-heading flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#d4af37]" />
                  Instalar no iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-[#8f8373] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-[#b8ab99] leading-relaxed">
                Para adicionar o <strong>COMANCHERO</strong> à tela de início do seu iPhone:
              </p>
              <ol className="mt-3 text-xs text-[#dcd2c4] space-y-2 list-decimal list-inside bg-[#1c150e] p-3 rounded-lg border border-[#2e2317]">
                <li>Toque no botão <strong>Compartilhar</strong> (ícone do quadrado com seta para cima no Safari).</li>
                <li>Role a lista para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</li>
                <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-[#d4af37] py-2 text-xs font-bold text-[#140f0a] hover:bg-[#fae092] transition"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
