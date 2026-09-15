import React, { useState } from 'react';
import { Plus, Trash2, Edit2, UtensilsCrossed, Users, Check, X, RotateCcw } from 'lucide-react';
import { Table, TableStatus } from '../../types';
import { DataStore } from '../../services/storage';

interface TablesTabProps {
  tables: Table[];
}

export const TablesTab: React.FC<TablesTabProps> = ({ tables }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [status, setStatus] = useState<TableStatus>('LIVRE');

  const openCreate = () => {
    setIsCreating(true);
    setEditingTable(null);
    setNumber(`Mesa ${String(tables.length + 1).padStart(2, '0')}`);
    setCapacity(4);
    setStatus('LIVRE');
  };

  const openEdit = (table: Table) => {
    setIsCreating(false);
    setEditingTable(table);
    setNumber(table.number);
    setCapacity(table.capacity);
    setStatus(table.status);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingTable(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;

    if (isCreating) {
      DataStore.addTable({
        number: number.trim(),
        capacity: Number(capacity) || 2,
        status,
        active: true,
      });
    } else if (editingTable) {
      DataStore.updateTable(editingTable.id, {
        number: number.trim(),
        capacity: Number(capacity) || 2,
        status,
      });
    }

    cancelForm();
  };

  const handleDelete = (id: string, tableNum: string) => {
    if (window.confirm(`Tem certeza que deseja apagar a ${tableNum}?`)) {
      DataStore.deleteTable(id);
      if (editingTable?.id === id) cancelForm();
    }
  };

  const handleQuickStatus = (id: string, newStatus: TableStatus) => {
    DataStore.updateTable(id, { status: newStatus });
  };

  const handleResetAllTables = () => {
    if (window.confirm('Deseja liberar todas as mesas do restaurante agora (marcar como LIVRE)?')) {
      tables.forEach((t) => {
        DataStore.updateTable(t.id, { status: 'LIVRE', currentCustomerName: undefined });
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#281c11]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
            Gestão de Mesas do Restaurante
          </h2>
          <p className="text-xs text-[#9d8d7b]">
            Controle de capacidade, status ao vivo (Livre, Ocupada, Em Preparação, Pronto, Finalizada).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetAllTables}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#3d2b1c] bg-[#1a120b] text-xs text-[#cfc1b0] hover:text-white transition"
            title="Redefinir todas para Livre"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Liberar Todas</span>
          </button>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition"
          >
            <Plus className="w-4 h-4 text-[#140e08]" />
            <span>Adicionar Mesa</span>
          </button>
        </div>
      </div>

      {/* Form modal/drawer */}
      {(isCreating || editingTable) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl border border-[#d4af37]/40 bg-[#17100a] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d1f14]">
            <h3 className="text-sm font-bold text-[#fae092] uppercase tracking-wider font-heading">
              {isCreating ? 'Cadastrar Nova Mesa' : `Editar ${editingTable?.number}`}
            </h3>
            <button type="button" onClick={cancelForm} className="text-[#8e806e] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Nome/Número da Mesa: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Ex: Mesa 13 ou Camarote VIP"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Capacidade (Pessoas):
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 2)}
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Estado Atual:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TableStatus)}
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              >
                <option value="LIVRE">🟢 Livre</option>
                <option value="OCUPADA">🟡 Ocupada</option>
                <option value="EM_PREPARACAO">🔴 Em Preparação</option>
                <option value="PRONTO">🔵 Pronto</option>
                <option value="FINALIZADA">⚪ Finalizada</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#26190f]">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 rounded-xl border border-[#362719] bg-[#18110a] text-xs font-semibold text-[#a59685] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] text-xs font-bold uppercase tracking-wider shadow hover:brightness-110"
            >
              Salvar Mesa
            </button>
          </div>
        </form>
      )}

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((tbl) => (
          <div
            key={tbl.id}
            className="p-4 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-md flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-[#faeee0] font-heading font-mono">
                  {tbl.number}
                </h3>
                <p className="text-xs text-[#9c8d7b] flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Capacidade: {tbl.capacity} pessoas</span>
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(tbl)}
                  className="p-1.5 rounded-lg border border-[#342416] text-[#8e806e] hover:text-[#d4af37]"
                  title="Editar Mesa"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(tbl.id, tbl.number)}
                  className="p-1.5 rounded-lg border border-[#342416] text-[#8e806e] hover:text-[#ef4444]"
                  title="Apagar Mesa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Status Buttons */}
            <div className="pt-2 border-t border-[#26190f]">
              <label className="block text-[10px] uppercase font-bold text-[#8d7e6e] mb-1.5">
                Alterar Estado:
              </label>
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                <button
                  onClick={() => handleQuickStatus(tbl.id, 'LIVRE')}
                  className={`py-1 rounded border text-center transition ${
                    tbl.status === 'LIVRE'
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold'
                      : 'border-[#2c1f13] text-[#8d7e6e] hover:text-white'
                  }`}
                >
                  🟢 Livre
                </button>
                <button
                  onClick={() => handleQuickStatus(tbl.id, 'OCUPADA')}
                  className={`py-1 rounded border text-center transition ${
                    tbl.status === 'OCUPADA'
                      ? 'border-amber-500 bg-amber-950/60 text-amber-300 font-bold'
                      : 'border-[#2c1f13] text-[#8d7e6e] hover:text-white'
                  }`}
                >
                  🟡 Ocupada
                </button>
                <button
                  onClick={() => handleQuickStatus(tbl.id, 'EM_PREPARACAO')}
                  className={`py-1 rounded border text-center transition ${
                    tbl.status === 'EM_PREPARACAO'
                      ? 'border-rose-500 bg-rose-950/60 text-rose-300 font-bold'
                      : 'border-[#2c1f13] text-[#8d7e6e] hover:text-white'
                  }`}
                >
                  🔴 Cozinha
                </button>
                <button
                  onClick={() => handleQuickStatus(tbl.id, 'PRONTO')}
                  className={`py-1 rounded border text-center transition ${
                    tbl.status === 'PRONTO'
                      ? 'border-sky-500 bg-sky-950/60 text-sky-300 font-bold'
                      : 'border-[#2c1f13] text-[#8d7e6e] hover:text-white'
                  }`}
                >
                  🔵 Pronto
                </button>
                <button
                  onClick={() => handleQuickStatus(tbl.id, 'FINALIZADA')}
                  className={`col-span-2 py-1 rounded border text-center transition ${
                    tbl.status === 'FINALIZADA'
                      ? 'border-zinc-500 bg-zinc-800 text-zinc-200 font-bold'
                      : 'border-[#2c1f13] text-[#8d7e6e] hover:text-white'
                  }`}
                >
                  ⚪ Finalizada
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
