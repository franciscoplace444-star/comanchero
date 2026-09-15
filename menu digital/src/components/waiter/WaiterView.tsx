import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Plus, 
  ShoppingBag, 
  RefreshCw,
  ChefHat,
  BellRing
} from 'lucide-react';
import { Table, TableStatus, Employee, Order, RestaurantSettings } from '../../types';
import { DataStore } from '../../services/storage';

interface WaiterViewProps {
  currentUser: Employee;
  settings: RestaurantSettings;
  tables: Table[];
  orders: Order[];
  onBackToMenu: () => void;
  onSelectTableForOrder: (table: Table) => void;
}

export const WaiterView: React.FC<WaiterViewProps> = ({
  currentUser,
  settings,
  tables,
  orders,
  onBackToMenu,
  onSelectTableForOrder,
}) => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(tables[0] || null);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'LIVRE':
        return {
          dot: '🟢',
          bg: 'bg-emerald-950/40 border-emerald-600/40 text-emerald-400',
          badge: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
          label: 'Livre',
        };
      case 'OCUPADA':
        return {
          dot: '🟡',
          bg: 'bg-amber-950/40 border-amber-500/40 text-amber-400',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          label: 'Ocupada',
        };
      case 'EM_PREPARACAO':
        return {
          dot: '🔴',
          bg: 'bg-rose-950/40 border-rose-500/40 text-rose-400',
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          label: 'Em Preparação',
        };
      case 'PRONTO':
        return {
          dot: '🔵',
          bg: 'bg-sky-950/40 border-sky-500/40 text-sky-400',
          badge: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          label: 'Pedido Pronto',
        };
      case 'FINALIZADA':
        return {
          dot: '⚪',
          bg: 'bg-zinc-800/40 border-zinc-600/40 text-zinc-300',
          badge: 'bg-zinc-700/20 text-zinc-300 border-zinc-500/30',
          label: 'Finalizada / Fechamento',
        };
    }
  };

  const handleUpdateTableStatus = (tableId: string, newStatus: TableStatus) => {
    DataStore.updateTable(tableId, { status: newStatus });
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable({ ...selectedTable, status: newStatus });
    }
  };

  // Find linked orders for selected table
  const tableOrders = selectedTable
    ? orders.filter(
        (o) =>
          o.type === 'MESA' &&
          o.tableNumber?.toLowerCase() === selectedTable.number.toLowerCase() &&
          o.status !== 'FINALIZADO' &&
          o.status !== 'CANCELADO'
      )
    : [];

  return (
    <div className="min-h-screen bg-[#0c0907] text-[#ede4d8] pb-16">
      {/* Top Waiter Header */}
      <div className="border-b border-[#2b1f13] bg-[#140e09] sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#382819] bg-[#1a120b] text-xs font-semibold text-[#c5b7a5] hover:border-[#d4af37] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
            <span>Voltar ao Menu</span>
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-black font-heading text-[#faeee0] flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#d4af37]" />
              Painel do Servente / Salão
            </h1>
            <p className="text-[11px] text-[#9a8a77]">
              Operador: <strong className="text-[#fae092]">{currentUser.name}</strong> ({currentUser.code})
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-[#1e140d] border border-[#39291b] text-[#d4af37] font-semibold">
            {tables.length} Mesas no Salão
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* State Legend */}
        <div className="mb-6 p-3 rounded-xl border border-[#2d1e13] bg-[#160f0a] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-[#d4af37] uppercase tracking-wider text-[10px]">
            Legenda de Estados:
          </span>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              🟢 Livre
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              🟡 Ocupada
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              🔴 Em Preparação
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              🔵 Pronto
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              ⚪ Finalizada
            </span>
          </div>
        </div>

        {/* Main Grid: Left = Tables Grid, Right = Table Detail & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tables Map */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] font-heading flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Mesas do Restaurante
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {tables.map((table) => {
                const statusMeta = getStatusColor(table.status);
                const isSelected = selectedTable?.id === table.id;

                return (
                  <div
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between h-36 ${
                      statusMeta.bg
                    } ${
                      isSelected
                        ? 'ring-2 ring-[#d4af37] border-transparent scale-[1.03] shadow-xl'
                        : 'hover:brightness-110 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xl font-black font-mono tracking-tight text-white">
                        {table.number}
                      </span>
                      <span className="text-base">{statusMeta.dot}</span>
                    </div>

                    <div>
                      {table.currentCustomerName ? (
                        <p className="text-xs font-semibold truncate text-[#fae092]">
                          {table.currentCustomerName}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#968877] italic">
                          Capacidade: {table.capacity} pax
                        </p>
                      )}

                      <span
                        className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusMeta.badge}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Selected Table Management */}
          {selectedTable && (
            <div className="p-5 rounded-2xl border border-[#3b2b1d] bg-[#150f0a] shadow-xl space-y-5 h-fit sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#281c12]">
                <div>
                  <h3 className="text-xl font-black text-[#faeee0] font-heading">
                    {selectedTable.number}
                  </h3>
                  <p className="text-xs text-[#9d8d7b]">
                    Capacidade: {selectedTable.capacity} pessoas
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase ${
                    getStatusColor(selectedTable.status).badge
                  }`}
                >
                  {getStatusColor(selectedTable.status).label}
                </span>
              </div>

              {/* Action: Take Order for this Table */}
              <div>
                <button
                  id="btn-waiter-take-order"
                  onClick={() => onSelectTableForOrder(selectedTable)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f24] text-[#140e08] font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4 text-[#140e08]" />
                  <span>LANÇAR PEDIDO PARA ESTA MESA</span>
                </button>
              </div>

              {/* Change Table Status Selector */}
              <div>
                <label className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">
                  Alterar Estado da Mesa:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleUpdateTableStatus(selectedTable.id, 'LIVRE')}
                    className="p-2 rounded-lg border border-emerald-600/40 bg-emerald-950/30 text-emerald-300 font-semibold hover:bg-emerald-900/40"
                  >
                    🟢 Livre
                  </button>
                  <button
                    onClick={() => handleUpdateTableStatus(selectedTable.id, 'OCUPADA')}
                    className="p-2 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 font-semibold hover:bg-amber-900/40"
                  >
                    🟡 Ocupada
                  </button>
                  <button
                    onClick={() => handleUpdateTableStatus(selectedTable.id, 'EM_PREPARACAO')}
                    className="p-2 rounded-lg border border-rose-500/40 bg-rose-950/30 text-rose-300 font-semibold hover:bg-rose-900/40"
                  >
                    🔴 Em Preparação
                  </button>
                  <button
                    onClick={() => handleUpdateTableStatus(selectedTable.id, 'PRONTO')}
                    className="p-2 rounded-lg border border-sky-500/40 bg-sky-950/30 text-sky-300 font-semibold hover:bg-sky-900/40"
                  >
                    🔵 Pedido Pronto
                  </button>
                  <button
                    onClick={() => handleUpdateTableStatus(selectedTable.id, 'FINALIZADA')}
                    className="col-span-2 p-2 rounded-lg border border-zinc-600/40 bg-zinc-800/40 text-zinc-300 font-semibold hover:bg-zinc-700/40"
                  >
                    ⚪ Finalizada / Conta Paga
                  </button>
                </div>
              </div>

              {/* Orders linked to this table */}
              <div className="pt-4 border-t border-[#291c11]">
                <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5" />
                  Pedidos Ativos desta Mesa:
                </h4>

                {tableOrders.length === 0 ? (
                  <p className="text-xs text-[#807261] italic p-3 bg-[#19110a] rounded-xl border border-[#281b11] text-center">
                    Nenhum pedido ativo no momento para esta mesa.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {tableOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 rounded-xl border border-[#2e2014] bg-[#1a120b] text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-[#fae092]">
                            {ord.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2a1b10] border border-[#3f2919] text-[#e0a96d] font-bold">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#a59582]">
                          Cliente: {ord.customerName}
                        </p>
                        <div className="space-y-0.5 text-[11px] text-[#c9b9a6]">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{it.quantity}x {it.productName}</span>
                              <span className="font-mono">{it.totalPrice} {settings.currency}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-1.5 border-t border-[#26190f] flex justify-between font-bold text-[#fae092]">
                          <span>Total:</span>
                          <span className="font-mono">{ord.total.toLocaleString('pt-MZ')} {settings.currency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
