import React, { useState } from 'react';
import { QrCode, Printer, Download, ExternalLink, Sparkles, Check } from 'lucide-react';
import { RestaurantSettings, Table } from '../../types';

interface QRCodeTabProps {
  settings: RestaurantSettings;
  tables: Table[];
}

export const QRCodeTab: React.FC<QRCodeTabProps> = ({ settings, tables }) => {
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('GERAL');
  const [customSubtitle, setCustomSubtitle] = useState('Aponte a câmara do seu telemóvel para consultar o menu e fazer o seu pedido');

  // Base URL: window.location.origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.comancherooo.com';
  const qrUrl = selectedTableNumber === 'GERAL'
    ? baseUrl
    : `${baseUrl}?mesa=${encodeURIComponent(selectedTableNumber)}`;

  // High quality QR Code API
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrUrl)}&color=140e08&bgcolor=faeee0&margin=2`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#281c11]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
            Gerador de QR Code para Mesas
          </h2>
          <p className="text-xs text-[#9d8d7b]">
            Gere e imprima cartões de mesa elegantes com QR Code direto para o menu digital.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition"
        >
          <Printer className="w-4 h-4 text-[#140e08]" />
          <span>Imprimir Cartão de Mesa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-[#faeee0] font-heading uppercase tracking-wider">
            Opções de Geração
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Destino do QR Code:
            </label>
            <select
              value={selectedTableNumber}
              onChange={(e) => setSelectedTableNumber(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            >
              <option value="GERAL">Menu Geral (Sem mesa pré-selecionada)</option>
              {tables.map((tbl) => (
                <option key={tbl.id} value={tbl.number}>
                  Específico para {tbl.number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Texto Instrução do Cartão:
            </label>
            <input
              type="text"
              value={customSubtitle}
              onChange={(e) => setCustomSubtitle(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Link de Destino Gerado:
            </label>
            <div className="p-2.5 rounded-xl bg-[#0e0a07] border border-[#26190f] text-[#fae092] font-mono text-xs break-all">
              {qrUrl}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <a
              href={qrImageSrc}
              download="comanchero-qrcode.png"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#3d2b1c] bg-[#1a120b] text-xs font-semibold text-[#f5ebd6] hover:border-[#d4af37]"
            >
              <Download className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Descarregar Imagem PNG</span>
            </a>
          </div>
        </div>

        {/* Printable Card Preview */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-[#3b2a1c] bg-[#0e0906]">
          <div
            id="print-qr-card"
            className="w-full max-w-sm rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#1b120a] to-[#0f0905] p-6 text-center shadow-2xl space-y-4"
          >
            {/* Logo & Header */}
            <div className="flex flex-col items-center">
              <img
                src={settings.logo || '/icon.svg'}
                alt={settings.name}
                className="w-14 h-14 object-contain mb-2 drop-shadow"
              />
              <h2 className="text-xl font-black uppercase tracking-widest text-[#faeee0] font-heading">
                {settings.name}
              </h2>
              <p className="text-[11px] text-[#d4af37] font-semibold tracking-wider uppercase">
                {selectedTableNumber === 'GERAL' ? 'Menu Digital' : selectedTableNumber}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-[#faeee0] rounded-2xl inline-block shadow-inner">
              <img
                src={qrImageSrc}
                alt="QR Code Comanchero"
                className="w-48 h-48 object-contain"
              />
            </div>

            {/* Instruction */}
            <p className="text-xs text-[#cfc1b0] max-w-xs mx-auto leading-relaxed">
              {customSubtitle}
            </p>

            <div className="pt-2 border-t border-[#342416] text-[10px] text-[#8e806e]">
              Maputo Shopping Center • Maputo, Moçambique
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
