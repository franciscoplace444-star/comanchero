import React, { useState } from 'react';
import { Save, Instagram, Facebook, Globe, MapPin, Check, ExternalLink } from 'lucide-react';
import { RestaurantSettings } from '../../types';
import { DataStore } from '../../services/storage';

interface SocialMediaTabProps {
  settings: RestaurantSettings;
}

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({ settings }) => {
  const [instagram, setInstagram] = useState(settings.instagram || '');
  const [facebook, setFacebook] = useState(settings.facebook || '');
  const [tiktok, setTiktok] = useState(settings.tiktok || '');
  const [website, setWebsite] = useState(settings.website || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(settings.googleMapsUrl || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.saveSettings({
      instagram: instagram.trim(),
      facebook: facebook.trim(),
      tiktok: tiktok.trim(),
      website: website.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#281c11]">
        <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
          Redes Sociais & Localização no Mapa
        </h2>
        <p className="text-xs text-[#9d8d7b]">
          Configure os links oficiais. Se um link for deixado em branco, o respetivo botão fica automaticamente oculto no menu do cliente.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Links e redes sociais atualizados com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-5 rounded-2xl border border-[#3b2a1c] bg-[#140e09] shadow-lg space-y-4">
        {/* Instagram */}
        <div>
          <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
            <Instagram className="w-4 h-4 text-[#e1306c]" />
            Link Oficial do Instagram:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/comanchero_maputo"
              className="flex-1 rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[#3d2b1c] bg-[#1f140b] text-[#c5b6a3] hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Facebook */}
        <div>
          <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
            <Facebook className="w-4 h-4 text-[#1877f2]" />
            Link Oficial do Facebook:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/comanchero.mz"
              className="flex-1 rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[#3d2b1c] bg-[#1f140b] text-[#c5b6a3] hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* TikTok */}
        <div>
          <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
              TT
            </span>
            Link Oficial do TikTok:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="https://tiktok.com/@comancheromaputo"
              className="flex-1 rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
            {tiktok && (
              <a
                href={tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[#3d2b1c] bg-[#1f140b] text-[#c5b6a3] hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Website Oficial */}
        <div>
          <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#d4af37]" />
            Website Oficial (Ex: https://www.comancherooo.com):
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.comancherooo.com"
              className="flex-1 rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[#3d2b1c] bg-[#1f140b] text-[#c5b6a3] hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Google Maps Link */}
        <div className="pt-2 border-t border-[#261a0f]">
          <label className="block text-xs font-medium text-[#c5b6a3] mb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#ef4444]" />
            Link do Google Maps (📍 COMO CHEGAR):
          </label>
          <p className="text-[11px] text-[#8e806e] mb-2">
            Insira o link de partilha do Google Maps do Maputo Shopping Center para que os clientes cheguem com 1 toque.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/?q=Maputo+Shopping+Center"
              className="flex-1 rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
            />
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[#3d2b1c] bg-[#1f140b] text-[#c5b6a3] hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f24] text-[#140e08] font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition"
        >
          <Save className="w-4 h-4 text-[#140e08]" />
          <span>GUARDAR REDES SOCIAIS & MAPA</span>
        </button>
      </form>
    </div>
  );
};
