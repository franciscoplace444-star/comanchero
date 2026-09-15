import React, { useState } from 'react';
import { MessageSquare, Save, Building, Store, Check, ExternalLink } from 'lucide-react';
import { RestaurantSettings } from '../../types';
import { DataStore } from '../../services/storage';

interface WhatsAppTabProps {
  settings: RestaurantSettings;
}

export const WhatsAppTab: React.FC<WhatsAppTabProps> = ({ settings }) => {
  const [whatsappCasa, setWhatsappCasa] = useState(settings.whatsappCasa);
  const [whatsappCasaActive, setWhatsappCasaActive] = useState(settings.whatsappCasaActive);

  const [whatsappLoja, setWhatsappLoja] = useState(settings.whatsappLoja);
  const [whatsappLojaActive, setWhatsappLojaActive] = useState(settings.whatsappLojaActive);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.saveSettings({
      whatsappCasa: whatsappCasa.trim(),
      whatsappCasaActive,
      whatsappLoja: whatsappLoja.trim(),
      whatsappLojaActive,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getCleanNumber = (num: string) => num.replace(/\D/g, '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#281c11]">
        <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
          Configuração de Números de WhatsApp
        </h2>
        <p className="text-xs text-[#9d8d7b]">
          Configure os canais oficiais de envio de pedidos e atendimento. Altere os números a qualquer momento.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Configurações de WhatsApp guardadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Canal 1: WhatsApp da Casa */}
        <div className="p-5 rounded-2xl border border-[#3b2a1c] bg-[#140e09] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#271b10] border border-[#3f2b19] text-[#d4af37]">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#faeee0] font-heading">
                  1. WhatsApp da Casa (Principal / Cozinha / Gerência)
                </h3>
                <p className="text-xs text-[#9d8d7b]">
                  Recebe as notificações principais de novos pedidos de clientes e mesas.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={whatsappCasaActive}
                onChange={(e) => setWhatsappCasaActive(e.target.checked)}
                className="rounded border-[#342416] text-[#25D366]"
              />
              <span className={whatsappCasaActive ? 'text-[#86efac] font-bold' : 'text-[#8e806e]'}>
                {whatsappCasaActive ? 'Ativo' : 'Desativado'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Número de Telefone com Código de País (Moçambique +258):
              </label>
              <input
                type="text"
                required={whatsappCasaActive}
                value={whatsappCasa}
                onChange={(e) => setWhatsappCasa(e.target.value)}
                placeholder="+258 84 000 0000"
                className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              {whatsappCasa && (
                <a
                  href={`https://wa.me/${getCleanNumber(whatsappCasa)}?text=${encodeURIComponent('Teste de conexão do Menu Digital Comanchero')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#25D366]/40 bg-[#162719] text-[#86efac] text-xs font-semibold hover:bg-[#25D366]/30 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Testar Número WhatsApp Casa</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Canal 2: WhatsApp da Loja / Atendimento */}
        <div className="p-5 rounded-2xl border border-[#3b2a1c] bg-[#140e09] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#271b10] border border-[#3f2b19] text-[#d4af37]">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#faeee0] font-heading">
                  2. WhatsApp da Loja / Atendimento / Balcão
                </h3>
                <p className="text-xs text-[#9d8d7b]">
                  Segundo canal de atendimento para entregas rápidas ou balcão de takeaway.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={whatsappLojaActive}
                onChange={(e) => setWhatsappLojaActive(e.target.checked)}
                className="rounded border-[#342416] text-[#25D366]"
              />
              <span className={whatsappLojaActive ? 'text-[#86efac] font-bold' : 'text-[#8e806e]'}>
                {whatsappLojaActive ? 'Ativo' : 'Desativado'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Número de Telefone com Código de País (Moçambique +258):
              </label>
              <input
                type="text"
                required={whatsappLojaActive}
                value={whatsappLoja}
                onChange={(e) => setWhatsappLoja(e.target.value)}
                placeholder="+258 82 000 0000"
                className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              {whatsappLoja && (
                <a
                  href={`https://wa.me/${getCleanNumber(whatsappLoja)}?text=${encodeURIComponent('Teste de conexão do WhatsApp Loja Comanchero')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#25D366]/40 bg-[#162719] text-[#86efac] text-xs font-semibold hover:bg-[#25D366]/30 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Testar Número WhatsApp Loja</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Message Format Preview */}
        <div className="p-4 rounded-xl border border-[#291c11] bg-[#110a06] text-xs space-y-2">
          <span className="font-bold text-[#d4af37] uppercase tracking-wider text-[10px] block">
            Formato Automático da Mensagem Enviada aos Números Acima:
          </span>
          <pre className="p-3 rounded-lg bg-[#0c0805] border border-[#25180e] text-[#fae092] font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
{`*NOVO PEDIDO — COMANCHERO*
*Pedido:* #COM-000001
*Cliente:* Carlos Alberto
*Telefone:* +258 84 123 4567
*Mesa:* Mesa 04 (3 pessoas)
*Tipo:* Consumo no Restaurante

*PRODUTOS:*
• 1x Tomahawk Steak Nobre — 1.850 MT
   _Obs: Ao ponto, sem cebola_
• 2x Comanchero Wild Berry Mocktail — 700 MT

*TOTAL:* 2.550 MT
_Enviado pelo Menu Digital Oficial COMANCHERO_`}
          </pre>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f24] text-[#140e08] font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition"
        >
          <Save className="w-4 h-4 text-[#140e08]" />
          <span>GUARDAR CONFIGURAÇÃO DE WHATSAPP</span>
        </button>
      </form>
    </div>
  );
};
