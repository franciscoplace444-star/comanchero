import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  UtensilsCrossed, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Order, Table, Customer, Product, RestaurantSettings } from '../../types';

interface DashboardTabProps {
  orders: Order[];
  tables: Table[];
  customers: Customer[];
  products: Product[];
  settings: RestaurantSettings;
  onNavigateTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  orders,
  tables,
  customers,
  products,
  settings,
  onNavigateTab,
}) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;
  const monthStart = todayStart - 30 * 24 * 60 * 60 * 1000;

  const ordersToday = orders.filter((o) => new Date(o.createdAt).getTime() >= todayStart);
  const salesToday = ordersToday.reduce((sum, o) => sum + (o.status !== 'CANCELADO' ? o.total : 0), 0);

  const ordersWeek = orders.filter((o) => new Date(o.createdAt).getTime() >= weekStart);
  const salesWeek = ordersWeek.reduce((sum, o) => sum + (o.status !== 'CANCELADO' ? o.total : 0), 0);

  const ordersMonth = orders.filter((o) => new Date(o.createdAt).getTime() >= monthStart);
  const salesMonth = ordersMonth.reduce((sum, o) => sum + (o.status !== 'CANCELADO' ? o.total : 0), 0);

  const activeTables = tables.filter((t) => t.status !== 'LIVRE' && t.active).length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'NOVO' || o.status === 'RECEBIDO' || o.status === 'EM PREPARAÇÃO'
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl border border-[#3b2a1c] bg-gradient-to-r from-[#20140b] via-[#170e08] to-[#120b06] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5ebd6] text-[11px] font-bold uppercase tracking-wider">
            Painel Central de Controlo
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#faeee0] font-heading mt-2">
            Restaurante {settings.name} — Maputo
          </h2>
          <p className="text-xs text-[#9d8d7b] mt-1">
            Resumo em tempo real de pedidos, mesas ativas e faturação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('pedidos')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition"
          >
            Ver Pedidos ({pendingOrders.length} Pendentes)
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vendas Hoje */}
        <div className="p-4 rounded-xl border border-[#2d1e13] bg-[#160f0a] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a0907e] text-xs">
            <span>Faturação Hoje</span>
            <div className="p-1.5 rounded-lg bg-[#271b11] text-[#d4af37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black font-mono text-[#fae092]">
              {salesToday.toLocaleString('pt-MZ')} <span className="text-xs font-sans text-[#d4af37]">{settings.currency}</span>
            </span>
            <p className="text-[11px] text-[#8e806e] mt-1">
              {ordersToday.length} {ordersToday.length === 1 ? 'pedido hoje' : 'pedidos hoje'}
            </p>
          </div>
        </div>

        {/* Vendas da Semana */}
        <div className="p-4 rounded-xl border border-[#2d1e13] bg-[#160f0a] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a0907e] text-xs">
            <span>Faturação (7 Dias)</span>
            <div className="p-1.5 rounded-lg bg-[#271b11] text-[#d4af37]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black font-mono text-[#fae092]">
              {salesWeek.toLocaleString('pt-MZ')} <span className="text-xs font-sans text-[#d4af37]">{settings.currency}</span>
            </span>
            <p className="text-[11px] text-[#8e806e] mt-1">
              {ordersWeek.length} pedidos esta semana
            </p>
          </div>
        </div>

        {/* Mesas Ativas */}
        <div className="p-4 rounded-xl border border-[#2d1e13] bg-[#160f0a] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a0907e] text-xs">
            <span>Mesas Ocupadas</span>
            <div className="p-1.5 rounded-lg bg-[#271b11] text-[#d4af37]">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black font-mono text-[#fae092]">
              {activeTables} <span className="text-sm font-sans text-[#9a8976]">/ {tables.length}</span>
            </span>
            <p className="text-[11px] text-[#8e806e] mt-1">
              {tables.length - activeTables} mesas livres no salão
            </p>
          </div>
        </div>

        {/* Clientes Registrados */}
        <div className="p-4 rounded-xl border border-[#2d1e13] bg-[#160f0a] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a0907e] text-xs">
            <span>Clientes no CRM</span>
            <div className="p-1.5 rounded-lg bg-[#271b11] text-[#d4af37]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black font-mono text-[#fae092]">
              {customers.length}
            </span>
            <p className="text-[11px] text-[#8e806e] mt-1">
              {orders.length} pedidos históricos arquivados
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Quick Table Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#26190f]">
            <h3 className="text-sm font-bold text-[#f5ebd6] uppercase tracking-wider font-heading flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              Últimos Pedidos Registrados
            </h3>
            <button
              onClick={() => onNavigateTab('pedidos')}
              className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="p-3 rounded-xl border border-[#261a10] bg-[#18100a] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#fae092]">
                      {order.id}
                    </span>
                    <span className="text-[11px] text-[#e0a96d] font-semibold">
                      {order.customerName}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-[#2a1d12] text-[#c9b9a6] border border-[#3d2a19]">
                      {order.type === 'MESA' ? order.tableNumber : order.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8a7b6a] mt-1">
                    {order.items.length} itens • {new Date(order.createdAt).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#fae092]">
                    {order.total.toLocaleString('pt-MZ')} {settings.currency}
                  </span>
                  <div className="mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2a1d12] text-[#d4af37] font-bold border border-[#3d2a19]">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tables Status Snapshot */}
        <div className="p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#26190f]">
              <h3 className="text-sm font-bold text-[#f5ebd6] uppercase tracking-wider font-heading flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#d4af37]" />
                Estado das Mesas
              </h3>
              <button
                onClick={() => onNavigateTab('mesas')}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Gerir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {tables.map((tbl) => (
                <div
                  key={tbl.id}
                  className="p-2.5 rounded-xl border border-[#261a10] bg-[#18100a] text-xs flex items-center justify-between"
                >
                  <span className="font-bold text-[#faeee0] font-mono">{tbl.number}</span>
                  <span className="text-xs">
                    {tbl.status === 'LIVRE' && '🟢'}
                    {tbl.status === 'OCUPADA' && '🟡'}
                    {tbl.status === 'EM_PREPARACAO' && '🔴'}
                    {tbl.status === 'PRONTO' && '🔵'}
                    {tbl.status === 'FINALIZADA' && '⚪'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#261a10] text-center">
            <button
              onClick={() => onNavigateTab('qrcode')}
              className="w-full py-2.5 rounded-xl border border-[#d4af37]/40 bg-[#24170e] text-[#f4e4b5] text-xs font-bold hover:border-[#d4af37] transition"
            >
              Imprimir QR Code para Mesas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
