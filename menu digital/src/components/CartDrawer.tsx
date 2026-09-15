import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: string;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#140e09] border-l border-[#36271a] shadow-2xl flex flex-col justify-between text-left">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#281c12] bg-[#1a120b] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#f5ebd6] font-heading">
                  Seu Pedido Comanchero
                </h2>
                <p className="text-xs text-[#9d8d7b]">
                  {items.length} {items.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-[#a39482] hover:text-[#ef4444] transition underline mr-2"
                  title="Esvaziar carrinho"
                >
                  Limpar
                </button>
              )}
              <button
                id="btn-close-cart"
                onClick={onClose}
                className="p-1.5 rounded-lg border border-[#312316] text-[#a39482] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#20160d] border border-[#3a2717] flex items-center justify-center mb-4 text-[#6e5d4a]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-[#cfc2af] font-heading">
                  O seu carrinho está vazio
                </h3>
                <p className="mt-1.5 text-xs text-[#8f806e] max-w-xs">
                  Navegue pelo nosso cardápio nobre e escolha os melhores cortes, kebabs, massas ou mocktails.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2 rounded-xl border border-[#d4af37]/50 bg-[#281c11] text-[#f4e4b5] text-xs font-bold hover:border-[#d4af37] transition"
                >
                  Explorar Cardápio
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="p-3 rounded-xl border border-[#2b1e13] bg-[#1a120b] shadow-sm flex flex-col gap-2.5"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <img
                      src={item.product.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover border border-[#342416] flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#f5ebd6] truncate font-heading">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-[#7c6d5c] hover:text-[#ef4444] transition p-0.5"
                          title="Remover do pedido"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-[#d4af37]">
                        {item.product.code}
                      </span>

                      {/* Unit price */}
                      <p className="text-xs text-[#a0907d] font-mono">
                        {item.unitPrice.toLocaleString('pt-MZ')} {currency} cada
                      </p>

                      {/* Selected Extras */}
                      {item.selectedExtras.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.selectedExtras.map((extra) => (
                            <span
                              key={extra.id}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-[#2b1f13] text-[#dcd1be] border border-[#3c2a1a]"
                            >
                              +{extra.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <p className="mt-1 text-[11px] text-[#e0a96d] italic bg-[#21170d] p-1 rounded border border-[#362616]">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Subtotal Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#26190f]">
                    <div className="flex items-center gap-2 bg-[#120b06] border border-[#312215] px-2 py-1 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="p-0.5 text-[#d4af37] hover:bg-[#25170d] rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-[#fae092] font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="p-0.5 text-[#d4af37] hover:bg-[#25170d] rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#7e6f5e] mr-1">Subtotal:</span>
                      <span className="text-sm font-bold font-mono text-[#fae092]">
                        {item.totalPrice.toLocaleString('pt-MZ')} {currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Total & Checkout Button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#2d1e13] bg-[#19110a] space-y-3">
              <div className="space-y-1 text-xs text-[#a0907e]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-[#dcd1be]">
                    {total.toLocaleString('pt-MZ')} {currency}
                  </span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black text-[#fae092] pt-2 border-t border-[#2b1c11]">
                  <span>Total Geral:</span>
                  <span className="font-mono">
                    {total.toLocaleString('pt-MZ')} {currency}
                  </span>
                </div>
              </div>

              <button
                id="btn-checkout-cart"
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e6c25a] to-[#b38f24] text-[#140e08] font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-98 transition"
              >
                <span>FINALIZAR PEDIDO</span>
                <ArrowRight className="w-4 h-4 text-[#140e08]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
