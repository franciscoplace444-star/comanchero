import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Star, Tag, MessageSquare, Utensils } from 'lucide-react';
import { Product, ProductExtra } from '../types';

interface ProductModalProps {
  product: Product | null;
  currency: string;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedExtras: ProductExtra[],
    notes: string
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);
  const [notes, setNotes] = useState('');

  // Reset state whenever product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedExtras([]);
    setNotes('');
  }, [product]);

  const basePrice = product.promoPrice && product.promoPrice < product.price
    ? product.promoPrice
    : product.price;

  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const totalItemPrice = (basePrice + extrasTotal) * quantity;

  const toggleExtra = (extra: ProductExtra) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleConfirm = () => {
    onAddToCart(product, quantity, selectedExtras, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#3d2c1c] bg-[#140e09] shadow-2xl text-left my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-[#c7baa8] hover:text-white hover:bg-black/90 transition backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Image Header */}
        <div className="relative aspect-[16/9] w-full bg-[#1b120a] overflow-hidden">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140e09] via-transparent to-black/40" />

          {/* Code & Tags Overlay */}
          <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#0e0a07]/90 border border-[#3e2c1d] text-xs font-mono font-bold text-[#d4af37]">
              {product.code}
            </span>
            {product.featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d4af37] text-[#140e08] text-[10px] font-black uppercase">
                <Star className="w-3 h-3 fill-[#140e08]" />
                Destaque
              </span>
            )}
            {product.promoPrice && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#b91c1c] text-white text-[10px] font-black uppercase">
                <Tag className="w-2.5 h-2.5" />
                Preço Promocional
              </span>
            )}
            {product.isDemo && (
              <span className="px-2 py-0.5 rounded bg-[#3a2717] text-[10px] font-bold text-[#f3e5ab] uppercase">
                DEMO
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#faeee0] font-heading">
                {product.name}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#b3a492] leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="mt-4 p-3 rounded-xl bg-[#1b130c] border border-[#2b1e13] flex items-center justify-between">
            <span className="text-xs text-[#9c8e7c] uppercase font-semibold">Preço Unitário:</span>
            <div className="text-right">
              {product.promoPrice && (
                <span className="text-xs text-[#786a59] line-through mr-2 font-mono">
                  {product.price.toLocaleString('pt-MZ')} {currency}
                </span>
              )}
              <span className="text-lg font-black text-[#fae092] font-mono">
                {basePrice.toLocaleString('pt-MZ')} {currency}
              </span>
            </div>
          </div>

          {/* Extras / Adicionais (When available) */}
          {product.extras && product.extras.length > 0 && (
            <div className="mt-5">
              <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                Adicionais e Acompanhamentos (Opcional):
              </label>
              <div className="space-y-2">
                {product.extras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        isChecked
                          ? 'border-[#d4af37] bg-[#291c10] text-[#fff]'
                          : 'border-[#2d1f14] bg-[#18110a] text-[#cfc1b0] hover:border-[#42301f]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#d4af37] border-[#d4af37] text-[#140e08]'
                              : 'border-[#4a3623]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{extra.name}</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-[#fae092]">
                        +{extra.price.toLocaleString('pt-MZ')} {currency}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observations Field */}
          <div className="mt-5">
            <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Observações Especiais:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Ponto da carne (mal / ao ponto / bem passado), sem cebola, molho à parte..."
              className="w-full rounded-xl border border-[#362719] bg-[#18110b] p-3 text-xs sm:text-sm text-[#ede4d8] placeholder-[#7d6f5d] focus:border-[#d4af37] focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer: Quantity Selector & Add Button */}
        <div className="p-4 sm:p-5 border-t border-[#2d1f14] bg-[#18110b] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-[#110b07] border border-[#342416] px-3 py-1.5 rounded-xl">
            <span className="text-xs text-[#8f816f] font-medium pr-1">Qtd:</span>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-md text-[#d4af37] hover:bg-[#25180d] disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-[#fae092] font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-md text-[#d4af37] hover:bg-[#25180d]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Order Button with Dynamic Total */}
          <button
            id="btn-confirm-add-product"
            onClick={handleConfirm}
            className="w-full sm:w-auto flex-1 flex items-center justify-between gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e2be54] to-[#b38f24] text-[#140e08] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition"
          >
            <span>ADICIONAR AO PEDIDO</span>
            <span className="font-mono text-sm sm:text-base font-extrabold bg-[#140e08]/15 px-2 py-0.5 rounded">
              {totalItemPrice.toLocaleString('pt-MZ')} {currency}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
