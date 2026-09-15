import React, { useState } from 'react';
import { Save, Building2, MapPin, Phone, Clock, DollarSign, Image as ImageIcon, Check } from 'lucide-react';
import { RestaurantSettings } from '../../types';
import { DataStore } from '../../services/storage';

interface RestaurantSettingsTabProps {
  settings: RestaurantSettings;
}

export const RestaurantSettingsTab: React.FC<RestaurantSettingsTabProps> = ({ settings }) => {
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [aboutText, setAboutText] = useState(settings.aboutText);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [openingHours, setOpeningHours] = useState(settings.openingHours);
  const [currency, setCurrency] = useState(settings.currency);
  const [deliveryFee, setDeliveryFee] = useState<number | string>(settings.deliveryFee);
  const [logo, setLogo] = useState(settings.logo);
  const [coverImage, setCoverImage] = useState(settings.coverImage);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.saveSettings({
      name: name.trim(),
      tagline: tagline.trim(),
      aboutText: aboutText.trim(),
      address: address.trim(),
      phone: phone.trim(),
      openingHours: openingHours.trim(),
      currency: currency.trim() || 'MT',
      deliveryFee: parseFloat(String(deliveryFee)) || 0,
      logo: logo.trim(),
      coverImage: coverImage.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#281c11]">
        <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
          Configurações Gerais do Restaurante
        </h2>
        <p className="text-xs text-[#9d8d7b]">
          Identidade do restaurante, horários de atendimento, moeda padrão e endereço.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Configurações do restaurante guardadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-5 rounded-2xl border border-[#3b2a1c] bg-[#140e09] shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Nome do Restaurante: <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Slogan / Subtítulo:
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
            Breve Descrição / História do Restaurante:
          </label>
          <textarea
            rows={2}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              Endereço Físico:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
              Telefone Fixo / Contacto:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              Horário de Funcionamento:
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#d4af37]" />
              Símbolo da Moeda (Ex: MT):
            </label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Taxa de Entrega Padrão ({currency}):
            </label>
            <input
              type="number"
              min="0"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#261a0f]">
          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              URL do Logotipo:
            </label>
            <input
              type="text"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              URL da Imagem de Capa do Hero:
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f24] text-[#140e08] font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition"
        >
          <Save className="w-4 h-4 text-[#140e08]" />
          <span>GUARDAR CONFIGURAÇÕES DO RESTAURANTE</span>
        </button>
      </form>
    </div>
  );
};
