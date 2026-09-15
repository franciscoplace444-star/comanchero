import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Award, 
  Calendar, 
  Users, 
  UtensilsCrossed, 
  Layers 
} from 'lucide-react';
import { Order, Product, Category, RestaurantSettings, Table, Employee } from '../../types';

interface ReportsTabProps {
  orders: Order[];
  products: Product[];
  categories: Category[];
  tables: Table[];
  employees: Employee[];
  settings: RestaurantSettings;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  orders,
  products,
  categories,
  tables,
  employees,
  settings,
}) => {
  const [period, setPeriod] = useState<'TODAY' | '7DAYS' | '30DAYS' | 'ALL'>('30DAYS');

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;
  const monthStart = todayStart - 30 * 24 * 60 * 60 * 1000;

  const filteredOrders = orders.filter((o) => {
    if (o.status === 'CANCELADO') return false;
    const time = new Date(o.createdAt).getTime();
    if (period === 'TODAY') return time >= todayStart;
    if (period === '7DAYS') return time >= weekStart;
    if (period === '30DAYS') return time >= monthStart;
    return true;
  });

  const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const averageTicket = filteredOrders.length > 0 ? totalSales / filteredOrders.length : 0;

  // 1. Most ordered dishes
  const productQuantityMap: Record<string, { name: string; count: number; revenue: number }> = {};
  filteredOrders.forEach((ord) => {
    ord.items.forEach((item) => {
      if (!productQuantityMap[item.productId]) {
        productQuantityMap[item.productId] = { name: item.productName, count: 0, revenue: 0 };
      }
      productQuantityMap[item.productId].count += item.quantity;
      productQuantityMap[item.productId].revenue += item.totalPrice;
    });
  });

  const topDishes = Object.values(productQuantityMap).sort((a, b) => b.count - a.count);

  // 2. Waiters with most orders
  const waiterMap: Record<string, { count: number; total: number }> = {};
  filteredOrders.forEach((o) => {
    const waiter = o.waiterName || 'Cliente Direto';
    if (!waiterMap[waiter]) waiterMap[waiter] = { count: 0, total: 0 };
    waiterMap[waiter].count += 1;
    waiterMap[waiter].total += o.total;
  });
  const topWaiters = Object.entries(waiterMap).sort((a, b) => b[1].count - a[1].count);

  // 3. Most used tables
  const tableCountMap: Record<string, number> = {};
  filteredOrders.forEach((o) => {
    if (o.tableNumber) {
      tableCountMap[o.tableNumber] = (tableCountMap[o.tableNumber] || 0) + 1;
    }
  });
  const topTables = Object.entries(tableCountMap).sort((a, b) => b[1] - a[1]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Produto', 'Unidades Vendidas', 'Receita Total (MT)'];
    const rows = topDishes.map((d) => [`"${d.name}"`, d.count, d.revenue]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-vendas-comanchero-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#281c11]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
            Relatórios Financeiros & Análise de Vendas
          </h2>
          <p className="text-xs text-[#9d8d7b]">
            Métricas de faturamento, pratos mais vendidos, produtividade de serventes e mesas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center bg-[#18110b] border border-[#362719] rounded-xl p-1 text-xs">
            <button
              onClick={() => setPeriod('TODAY')}
              className={`px-3 py-1 rounded-lg transition ${
                period === 'TODAY' ? 'bg-[#d4af37] text-[#140e08] font-bold' : 'text-[#8e806e]'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setPeriod('7DAYS')}
              className={`px-3 py-1 rounded-lg transition ${
                period === '7DAYS' ? 'bg-[#d4af37] text-[#140e08] font-bold' : 'text-[#8e806e]'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setPeriod('30DAYS')}
              className={`px-3 py-1 rounded-lg transition ${
                period === '30DAYS' ? 'bg-[#d4af37] text-[#140e08] font-bold' : 'text-[#8e806e]'
              }`}
            >
              30 Dias
            </button>
            <button
              onClick={() => setPeriod('ALL')}
              className={`px-3 py-1 rounded-lg transition ${
                period === 'ALL' ? 'bg-[#d4af37] text-[#140e08] font-bold' : 'text-[#8e806e]'
              }`}
            >
              Tudo
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#382819] bg-[#1a120b] text-xs font-semibold text-[#f5ebd6] hover:border-[#d4af37]"
          >
            <Download className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[#2d1e13] bg-[#160f0a] shadow-sm">
          <span className="text-xs text-[#9c8d7b]">Faturação no Período:</span>
          <p className="text-2xl font-black font-mono text-[#fae092] mt-1">
            {totalSales.toLocaleString('pt-MZ')} <span className="text-xs text-[#d4af37] font-sans">{settings.currency}</span>
          </p>
          <span className="text-[11px] text-[#8e806e]">{filteredOrders.length} pedidos confirmados</span>
        </div>

        <div className="p-4 rounded-xl border border-[#2d1e13] bg-[#160f0a] shadow-sm">
          <span className="text-xs text-[#9c8d7b]">Ticket Médio por Pedido:</span>
          <p className="text-2xl font-black font-mono text-[#fae092] mt-1">
            {Math.round(averageTicket).toLocaleString('pt-MZ')} <span className="text-xs text-[#d4af37] font-sans">{settings.currency}</span>
          </p>
          <span className="text-[11px] text-[#8e806e]">Gasto médio por cliente/mesa</span>
        </div>

        <div className="p-4 rounded-xl border border-[#2d1e13] bg-[#160f0a] shadow-sm">
          <span className="text-xs text-[#9c8d7b]">Total de Pratos Servidos:</span>
          <p className="text-2xl font-black font-mono text-[#fae092] mt-1">
            {Object.values(productQuantityMap).reduce((acc, v) => acc + v.count, 0)}
          </p>
          <span className="text-[11px] text-[#8e806e]">Itens individuais preparados</span>
        </div>
      </div>

      {/* Top Dishes & Serventes / Mesas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pratos Mais Pedidos */}
        <div className="p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg">
          <h3 className="text-sm font-bold text-[#faeee0] font-heading uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-[#26190f]">
            <Award className="w-4 h-4 text-[#d4af37]" />
            Pratos Mais Pedidos
          </h3>

          <div className="mt-4 space-y-3">
            {topDishes.length === 0 ? (
              <p className="text-xs text-[#8d7f70] text-center py-4 italic">
                Nenhum dado de pratos vendido neste período.
              </p>
            ) : (
              topDishes.slice(0, 7).map((dish, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#19110a] border border-[#26190f]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center font-bold text-[#d4af37]">#{idx + 1}</span>
                    <span className="font-semibold text-[#f5ebd6]">{dish.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#fae092]">{dish.count}x</span>
                    <span className="text-[11px] text-[#8e806e] ml-2 font-mono">
                      ({dish.revenue.toLocaleString('pt-MZ')} {settings.currency})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Serventes & Mesas mais utilizadas */}
        <div className="space-y-6">
          {/* Serventes com mais pedidos */}
          <div className="p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg">
            <h3 className="text-sm font-bold text-[#faeee0] font-heading uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-[#26190f]">
              <Users className="w-4 h-4 text-[#d4af37]" />
              Atendimentos por Servente / Canal
            </h3>

            <div className="mt-3 space-y-2 text-xs">
              {topWaiters.slice(0, 5).map(([name, data], idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#19110a] border border-[#26190f]">
                  <span className="font-semibold text-[#f5ebd6]">{name}</span>
                  <span className="text-[#fae092] font-mono font-bold">
                    {data.count} pedidos • {data.total.toLocaleString('pt-MZ')} {settings.currency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mesas Mais Utilizadas */}
          <div className="p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg">
            <h3 className="text-sm font-bold text-[#faeee0] font-heading uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-[#26190f]">
              <UtensilsCrossed className="w-4 h-4 text-[#d4af37]" />
              Mesas Mais Movimentadas
            </h3>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {topTables.map(([tableName, count]) => (
                <span
                  key={tableName}
                  className="px-3 py-1.5 rounded-xl bg-[#19110a] border border-[#2b1e13] text-[#dcd1be]"
                >
                  <strong className="text-[#fae092] font-mono">{tableName}</strong>: {count} rotações
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
