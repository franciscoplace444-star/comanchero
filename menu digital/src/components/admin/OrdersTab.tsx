import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChefHat, 
  Send,
  MessageSquare,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, RestaurantSettings } from '../../types';
import { DataStore } from '../../services/storage';

interface OrdersTabProps {
  orders: Order[];
  settings: RestaurantSettings;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses: OrderStatus[] = [
    'NOVO',
    'RECEBIDO',
    'EM PREPARAÇÃO',
    'PRONTO',
    'ENTREGUE',
    'FINALIZADO',
    'CANCELADO',
  ];

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    DataStore.updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleSendStatusWhatsApp = (order: Order) => {
    const cleanPhone = order.customerPhone.replace(/\D/g, '');
    if (!cleanPhone) return;

    let msg = `*Olá ${order.customerName}! Atualização sobre o seu pedido no COMANCHERO:*\n\n`;
    msg += `*Pedido:* ${order.id}\n`;
    msg += `*Estado Atual:* ${order.status}\n`;
    if (order.status === 'EM PREPARAÇÃO') {
      msg += `Os nossos mestres assadores já estão preparando o seu pedido com o maior cuidado!\n`;
    } else if (order.status === 'PRONTO') {
      msg += `O seu pedido está pronto!\n`;
    } else if (order.status === 'ENTREGUE') {
      msg += `Pedido entregue com sucesso. Bom apetite e volte sempre ao Comanchero!\n`;
    }
    msg += `\nTotal: ${order.total.toLocaleString('pt-MZ')} ${settings.currency}`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Data/Hora', 'Cliente', 'Telefone', 'Tipo', 'Mesa/Endereço', 'Status', 'Total (MT)'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleString('pt-MZ'),
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      o.type,
      `"${o.tableNumber || o.deliveryAddress || ''}"`,
      o.status,
      o.total,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pedidos-comanchero-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      (o.tableNumber && o.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#281c11]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
            Gestão de Pedidos
          </h2>
          <p className="text-xs text-[#9d8d7b]">
            Acompanhe pedidos da mesa, entregas e levantamentos em tempo real.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#382819] bg-[#1a120b] text-xs font-semibold text-[#f5ebd6] hover:border-[#d4af37] transition"
        >
          <Download className="w-4 h-4 text-[#d4af37]" />
          <span>Exportar Relatório (CSV)</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="p-3 rounded-2xl border border-[#2d1e13] bg-[#140e09] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Pesquisar por pedido (#COM-...), cliente ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#342416] bg-[#18100a] pl-9 pr-4 py-2 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8a7b6a]" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#342416] bg-[#18100a] p-2 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
          >
            <option value="ALL">Todos os Estados ({orders.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st} ({orders.filter((o) => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 rounded-2xl border border-[#26190f] bg-[#140e09] text-center">
            <AlertCircle className="w-8 h-8 text-[#8e806e] mx-auto mb-2" />
            <p className="text-xs text-[#8d7f70] italic">
              Nenhum pedido encontrado com os critérios de busca.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isSelected = selectedOrder?.id === order.id;

            return (
              <div
                key={order.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-[#d4af37] bg-[#1a120b] shadow-xl'
                    : 'border-[#2a1d12] bg-[#150f0a] hover:border-[#3d2a19]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#22160d] border border-[#392617] text-[#fae092] font-mono text-xs font-black">
                      {order.id}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-[#faeee0] font-heading">
                          {order.customerName}
                        </h4>
                        <span className="text-xs text-[#9d8d7b] flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-[#d4af37]" />
                          {order.customerPhone}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#271b11] border border-[#3b291a] text-[#f5ebd6] font-semibold">
                          {order.type === 'MESA' ? `${order.tableNumber}` : order.type}
                        </span>
                        {order.waiterName && (
                          <span className="text-[10px] text-[#e0a96d] italic">
                            Atendido por: {order.waiterName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#8d7f70] mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleString('pt-MZ')}
                        </span>
                        <span>•</span>
                        <span>{order.items.length} itens</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-[#26190f]">
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-black font-mono text-[#fae092]">
                        {order.total.toLocaleString('pt-MZ')} {settings.currency}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="rounded-xl border border-[#3d2b1c] bg-[#1b120a] py-1.5 px-2.5 text-xs font-bold text-[#faeee0] focus:border-[#d4af37] focus:outline-none"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setSelectedOrder(isSelected ? null : order)}
                      className="p-2 rounded-lg border border-[#362618] text-[#8e806e] hover:text-[#d4af37]"
                      title="Ver detalhes do pedido"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details when selected */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-[#291c11] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Items List */}
                    <div className="space-y-2 bg-[#100a06] p-3 rounded-xl border border-[#25180e]">
                      <h5 className="font-bold text-[#d4af37] uppercase tracking-wider text-[10px]">
                        Itens do Pedido:
                      </h5>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-[#cfc1b0]">
                          <div>
                            <span className="font-bold text-[#fae092]">{item.quantity}x</span> {item.productName}
                            {item.extras && item.extras.length > 0 && (
                              <p className="text-[10px] text-[#9a8976]">
                                Adicionais: {item.extras.map((e) => e.name).join(', ')}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-[10px] text-[#e0a96d] italic">
                                Obs: {item.notes}
                              </p>
                            )}
                          </div>
                          <span className="font-mono">{item.totalPrice.toLocaleString('pt-MZ')} {settings.currency}</span>
                        </div>
                      ))}

                      {order.deliveryAddress && (
                        <div className="pt-2 border-t border-[#25180e] text-[#a0907e]">
                          <strong className="text-[#f5ebd6]">Endereço de Entrega:</strong> {order.deliveryAddress}
                        </div>
                      )}
                      {order.notes && (
                        <div className="pt-1 text-[#a0907e]">
                          <strong className="text-[#f5ebd6]">Observações Gerais:</strong> {order.notes}
                        </div>
                      )}
                    </div>

                    {/* Quick Communication Actions */}
                    <div className="space-y-3 flex flex-col justify-between">
                      <div className="p-3 rounded-xl bg-[#100a06] border border-[#25180e] space-y-2">
                        <h5 className="font-bold text-[#d4af37] uppercase tracking-wider text-[10px]">
                          Comunicação com o Cliente:
                        </h5>
                        <p className="text-[#9d8d7b]">
                          Envie aviso de status (Em Preparação, Pronto, Saiu para Entrega) direto para o WhatsApp do cliente.
                        </p>
                        <button
                          onClick={() => handleSendStatusWhatsApp(order)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#86efac] font-bold text-xs hover:bg-[#25D366]/30 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Notificar Cliente via WhatsApp</span>
                        </button>
                      </div>

                      <div className="flex justify-end gap-2">
                        {order.status !== 'FINALIZADO' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'FINALIZADO')}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-bold text-xs uppercase tracking-wider"
                          >
                            Finalizar & Arquivar Pedido
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
