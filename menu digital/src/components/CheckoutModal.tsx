import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MapPin, 
  Phone, 
  User, 
  Users, 
  UtensilsCrossed, 
  Truck, 
  ShoppingBag, 
  CheckCircle2,
  Building,
  Store,
  AlertCircle
} from 'lucide-react';
import { CartItem, RestaurantSettings, Table, Employee, OrderType, Order } from '../types';
import { DataStore } from '../services/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: RestaurantSettings;
  tables: Table[];
  currentUser: Employee | null;
  selectedTable?: Table | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  tables,
  currentUser,
  selectedTable,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [orderMode, setOrderMode] = useState<'RESTAURANTE' | 'DISTANCIA'>('RESTAURANTE');
  const [customerName, setCustomerName] = useState(
    selectedTable?.currentCustomerName || ''
  );
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState(
    selectedTable?.number || (tables.length > 0 ? tables[0].number : 'Mesa 01')
  );
  const [peopleCount, setPeopleCount] = useState(2);
  const [distanceType, setDistanceType] = useState<'ENTREGA' | 'LEVANTAMENTO'>('ENTREGA');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [targetDestination, setTargetDestination] = useState<'casa' | 'loja'>('casa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = orderMode === 'DISTANCIA' && distanceType === 'ENTREGA' ? settings.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Por favor, informe o seu nome.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setErrorMessage('Por favor, informe um número de telefone válido (ex: +258 84 123 4567).');
      return;
    }

    if (orderMode === 'DISTANCIA' && distanceType === 'ENTREGA' && !deliveryAddress.trim()) {
      setErrorMessage('Por favor, informe o endereço completo para entrega em Maputo.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderType: OrderType = orderMode === 'RESTAURANTE' ? 'MESA' : distanceType;

      // 1. Prepare Order Items
      const orderItems = items.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        productCode: ci.product.code,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        totalPrice: ci.totalPrice,
        extras: ci.selectedExtras.map((ex) => ({ name: ex.name, price: ex.price })),
        notes: ci.notes,
      }));

      // 2. Save Order in DataStore
      const newOrder = DataStore.createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        type: orderType,
        tableNumber: orderMode === 'RESTAURANTE' ? tableNumber : undefined,
        peopleCount: orderMode === 'RESTAURANTE' ? peopleCount : undefined,
        deliveryAddress: orderMode === 'DISTANCIA' && distanceType === 'ENTREGA' ? deliveryAddress.trim() : undefined,
        items: orderItems,
        subtotal,
        total: grandTotal,
        notes: generalNotes.trim(),
        status: 'NOVO',
        waiterName: currentUser ? currentUser.name : undefined,
        targetWhatsApp: targetDestination,
      });

      // 3. Build WhatsApp Formatted Message according to Requirement 14
      let message = `*NOVO PEDIDO — ${settings.name.toUpperCase()}*\n`;
      message += `*Pedido:* ${newOrder.id}\n`;
      message += `*Cliente:* ${customerName.trim()}\n`;
      message += `*Telefone:* ${customerPhone.trim()}\n`;

      if (orderMode === 'RESTAURANTE') {
        message += `*Mesa:* ${tableNumber} (${peopleCount} pessoas)\n`;
        message += `*Tipo:* Consumo no Restaurante\n`;
      } else if (distanceType === 'ENTREGA') {
        message += `*Tipo:* Pedido à Distância (ENTREGA)\n`;
        message += `*Endereço:* ${deliveryAddress.trim()}\n`;
      } else {
        message += `*Tipo:* Pedido à Distância (LEVANTAMENTO NO RESTAURANTE)\n`;
      }

      if (currentUser) {
        message += `*Funcionário/Servente:* ${currentUser.name} (${currentUser.code})\n`;
      }

      message += `\n*PRODUTOS:*\n`;
      items.forEach((item) => {
        message += `• ${item.quantity}x ${item.product.name} — ${(item.totalPrice).toLocaleString('pt-MZ')} ${settings.currency}\n`;
        if (item.selectedExtras.length > 0) {
          const extrasStr = item.selectedExtras.map((e) => e.name).join(', ');
          message += `   _Adicionais: ${extrasStr}_\n`;
        }
        if (item.notes) {
          message += `   _Obs: ${item.notes}_\n`;
        }
      });

      if (deliveryFee > 0) {
        message += `\n*Taxa de Entrega:* ${deliveryFee.toLocaleString('pt-MZ')} ${settings.currency}\n`;
      }

      if (generalNotes.trim()) {
        message += `\n*Observações Gerais:* ${generalNotes.trim()}\n`;
      }

      message += `\n*TOTAL:* ${grandTotal.toLocaleString('pt-MZ')} ${settings.currency}\n`;
      message += `_Enviado pelo Menu Digital Oficial COMANCHERO_`;

      // Determine Target Phone Number
      let targetPhone = '';
      if (targetDestination === 'casa' && settings.whatsappCasaActive) {
        targetPhone = settings.whatsappCasa.replace(/\D/g, '');
      } else if (targetDestination === 'loja' && settings.whatsappLojaActive) {
        targetPhone = settings.whatsappLoja.replace(/\D/g, '');
      } else if (settings.whatsappCasaActive) {
        targetPhone = settings.whatsappCasa.replace(/\D/g, '');
      } else if (settings.whatsappLojaActive) {
        targetPhone = settings.whatsappLoja.replace(/\D/g, '');
      }

      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      onOrderSuccess(newOrder);
      onClose();
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Ocorreu um erro ao registrar o pedido: ${errStr}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#3b2b1d] bg-[#140e09] shadow-2xl text-left my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2b1e13] bg-[#19110a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center">
              <Send className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#f5ebd6] font-heading">
                Finalizar Pedido Comanchero
              </h2>
              <p className="text-xs text-[#9d8e7c]">
                Envio direto e formatado para o WhatsApp do restaurante
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#312316] text-[#a39482] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-xl border border-[#ef4444]/40 bg-[#2d1414] text-[#fca5a5] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#ef4444] flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mode Selector: No Restaurante vs Pedido à Distância */}
          <div>
            <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">
              Onde você está consumindo?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setOrderMode('RESTAURANTE')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-bold transition ${
                  orderMode === 'RESTAURANTE'
                    ? 'border-[#d4af37] bg-[#2a1d11] text-[#fae092] shadow-sm'
                    : 'border-[#2d2015] bg-[#18110b] text-[#a39380] hover:border-[#42301f]'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-[#d4af37]" />
                <span>Sou cliente na mesa</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderMode('DISTANCIA')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-bold transition ${
                  orderMode === 'DISTANCIA'
                    ? 'border-[#d4af37] bg-[#2a1d11] text-[#fae092] shadow-sm'
                    : 'border-[#2d2015] bg-[#18110b] text-[#a39380] hover:border-[#42301f]'
                }`}
              >
                <Truck className="w-4 h-4 text-[#d4af37]" />
                <span>Pedido à distância</span>
              </button>
            </div>
          </div>

          {/* Customer Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#c4b5a2] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#d4af37]" />
                Seu Nome: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full rounded-xl border border-[#342416] bg-[#18110b] p-2.5 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c4b5a2] mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                Número de Telefone: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ex: +258 84 123 4567"
                className="w-full rounded-xl border border-[#342416] bg-[#18110b] p-2.5 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          {/* Conditional Fields: Restaurant Dine-in */}
          {orderMode === 'RESTAURANTE' && (
            <div className="p-3.5 rounded-xl border border-[#2b1f13] bg-[#1a120b] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#c4b5a2] mb-1 flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" />
                  Selecione a Mesa:
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full rounded-xl border border-[#362719] bg-[#120b06] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
                >
                  {tables.map((tbl) => (
                    <option key={tbl.id} value={tbl.number}>
                      {tbl.number} ({tbl.status.toLowerCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4b5a2] mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  Número de Pessoas:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-[#362719] bg-[#120b06] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Conditional Fields: Distance Order (Delivery vs Pickup) */}
          {orderMode === 'DISTANCIA' && (
            <div className="p-3.5 rounded-xl border border-[#2b1f13] bg-[#1a120b] space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#c4b5a2] mb-1.5">
                  Modalidade do Pedido:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDistanceType('ENTREGA')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${
                      distanceType === 'ENTREGA'
                        ? 'border-[#d4af37] bg-[#291b10] text-[#fae092]'
                        : 'border-[#2d2015] bg-[#120b06] text-[#9a8a77]'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>ENTREGA (+{settings.deliveryFee} MT)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDistanceType('LEVANTAMENTO')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${
                      distanceType === 'LEVANTAMENTO'
                        ? 'border-[#d4af37] bg-[#291b10] text-[#fae092]'
                        : 'border-[#2d2015] bg-[#120b06] text-[#9a8a77]'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>LEVANTAMENTO NO LOCAL</span>
                  </button>
                </div>
              </div>

              {distanceType === 'ENTREGA' && (
                <div>
                  <label className="block text-xs font-medium text-[#c4b5a2] mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    Endereço de Entrega (Bairro, Rua, Prédio/Nº): <span className="text-[#ef4444]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ex: Polana Cimento, Av. Julius Nyerere, Edifício Solar, Apt 3B"
                    className="w-full rounded-xl border border-[#362719] bg-[#120b06] p-2.5 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Two Destinations (Casa vs Loja/Atendimento as requested in Item 15) */}
          {(settings.whatsappCasaActive && settings.whatsappLojaActive) && (
            <div>
              <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-1.5">
                Enviar pedido para:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetDestination('casa')}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 ${
                    targetDestination === 'casa'
                      ? 'border-[#d4af37] bg-[#271b10] text-[#fae092]'
                      : 'border-[#2d2015] bg-[#16100a] text-[#938371]'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>WhatsApp Principal (Casa)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDestination('loja')}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 ${
                    targetDestination === 'loja'
                      ? 'border-[#d4af37] bg-[#271b10] text-[#fae092]'
                      : 'border-[#2d2015] bg-[#16100a] text-[#938371]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>WhatsApp Loja / Atendimento</span>
                </button>
              </div>
            </div>
          )}

          {/* General Notes */}
          <div>
            <label className="block text-xs font-medium text-[#c4b5a2] mb-1">
              Observações Adicionais para a Cozinha:
            </label>
            <input
              type="text"
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Ex: Trazer máquina de cartão, talheres extras, guardanapos..."
              className="w-full rounded-xl border border-[#342416] bg-[#18110b] p-2.5 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          {/* Order Financial Summary */}
          <div className="p-3.5 rounded-xl border border-[#2b1f13] bg-[#1a120b] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#a0907e]">
              <span>Subtotal ({items.length} itens):</span>
              <span className="font-mono text-[#ede4d8]">
                {subtotal.toLocaleString('pt-MZ')} {settings.currency}
              </span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-[#a0907e]">
                <span>Taxa de Entrega:</span>
                <span className="font-mono text-[#ede4d8]">
                  +{deliveryFee.toLocaleString('pt-MZ')} {settings.currency}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-[#291b11] flex justify-between text-base font-black text-[#fae092]">
              <span>Total a Pagar:</span>
              <span className="font-mono">
                {grandTotal.toLocaleString('pt-MZ')} {settings.currency}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#22bf5b] to-[#128C7E] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
            <span>ENVIAR PEDIDO PELO WHATSAPP</span>
          </button>
        </form>
      </div>
    </div>
  );
};
