import React from 'react';
import { Plus, Star, Tag, Check, Ban } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currency: string;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onOpenDetails,
  onQuickAdd,
}) => {
  const hasPromo = product.promoPrice && product.promoPrice < product.price;
  const currentPrice = hasPromo ? product.promoPrice! : product.price;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onOpenDetails(product)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer bg-[#150f0a] ${
        product.available
          ? 'border-[#2d2015] hover:border-[#d4af37]/70 hover:shadow-xl hover:shadow-[#d4af37]/10 hover:-translate-y-1'
          : 'border-[#22170f] opacity-60 grayscale'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1f150d]">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#150f0a] via-transparent to-black/30" />

        {/* Internal Code Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-[#0e0906]/85 backdrop-blur-sm border border-[#3d2d1e] text-[10px] font-mono font-bold text-[#d4af37]">
            {product.code}
          </span>
          {product.isDemo && (
            <span className="px-1.5 py-0.5 rounded-md bg-[#382618]/90 text-[9px] font-extrabold text-[#e5c158] uppercase tracking-wider">
              DEMO
            </span>
          )}
        </div>

        {/* Status Badges: Featured / Promo / Sold Out */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
          {product.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d4af37] text-[#140e08] text-[10px] font-extrabold tracking-wide uppercase shadow">
              <Star className="w-3 h-3 fill-[#140e08]" />
              Destaque
            </span>
          )}

          {hasPromo && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#b91c1c] text-white text-[10px] font-extrabold uppercase shadow">
              <Tag className="w-2.5 h-2.5" />
              Promoção
            </span>
          )}

          {!product.available && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#374151] text-[#e5e7eb] text-[10px] font-bold shadow">
              <Ban className="w-3 h-3" />
              Esgotado
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-base font-bold text-[#f7efe4] font-heading group-hover:text-[#d4af37] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1.5 text-xs text-[#a39482] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#261b11] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasPromo && (
              <span className="text-[11px] text-[#786a58] line-through font-mono">
                {product.price.toLocaleString('pt-MZ')} {currency}
              </span>
            )}
            <span className="text-base sm:text-lg font-black text-[#fae092] font-mono tracking-tight">
              {currentPrice.toLocaleString('pt-MZ')} <span className="text-xs text-[#d4af37] font-sans font-semibold">{currency}</span>
            </span>
          </div>

          {/* Add Button */}
          {product.available ? (
            <button
              id={`btn-add-${product.id}`}
              onClick={(e) => onQuickAdd(product, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2c1e12] to-[#20150c] border border-[#d4af37]/40 text-[#f5ebd6] text-xs font-bold hover:border-[#d4af37] hover:bg-[#382617] active:scale-95 transition shadow"
              title="Adicionar ao pedido"
            >
              <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">ADICIONAR</span>
              <span className="sm:hidden">+</span>
            </button>
          ) : (
            <span className="text-[11px] text-[#6b7280] font-medium italic">
              Indisponível
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
