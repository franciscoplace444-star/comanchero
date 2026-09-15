import React, { useState } from 'react';
import { Search, User, Phone, Calendar, ShoppingBag, DollarSign, MessageSquare } from 'lucide-react';
import { Customer, RestaurantSettings } from '../../types';

interface CustomersTabProps {
  customers: Customer[];
  settings: RestaurantSettings;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ customers, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#281c11]">
        <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
          Gestão de Clientes (CRM Comanchero)
        </h2>
        <p className="text-xs text-[#9d8d7b]">
          Registo automático de clientes através de pedidos em mesa, entregas e levantamentos.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar por nome ou telefone de cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-[#342416] bg-[#140e09] pl-9 pr-4 py-2.5 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
        />
        <Search className="absolute left-3 top-3 w-4 h-4 text-[#8a7b6a]" />
      </div>

      {/* Customers List */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-xs text-[#8d7f70] text-center py-6 italic">
              Nenhum cliente encontrado.
            </p>
          ) : (
            filtered.map((cust) => (
              <div
                key={cust.id}
                className="p-3.5 rounded-xl border border-[#261a10] bg-[#18100a] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#26190f] border border-[#3c2919] flex items-center justify-center text-[#d4af37]">
                    <User className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#faeee0] font-heading">
                      {cust.name}
                    </h4>
                    <p className="text-xs text-[#8d7e6e] mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 font-mono text-[#dcd1be]">
                        <Phone className="w-3 h-3 text-[#d4af37]" />
                        {cust.phone}
                      </span>
                      <span>•</span>
                      <span>Cadastrado em: {new Date(cust.createdAt).toLocaleDateString('pt-MZ')}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[11px] text-[#8d7e6e] block">Total Gasto:</span>
                    <span className="text-sm font-bold font-mono text-[#fae092]">
                      {cust.totalSpent.toLocaleString('pt-MZ')} {settings.currency}
                    </span>
                    <span className="text-[10px] text-[#9c8c7b] block">
                      {cust.orderCount} {cust.orderCount === 1 ? 'pedido' : 'pedidos'}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${cust.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${cust.name}! Restaurante Comanchero agradece a sua preferência.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#86efac] hover:bg-[#25D366]/30"
                    title="Conversar no WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
