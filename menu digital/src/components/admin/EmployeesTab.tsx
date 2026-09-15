import React, { useState } from 'react';
import { Plus, Edit2, Trash2, KeyRound, User, Phone, Shield, Check, X, Lock } from 'lucide-react';
import { Employee, UserRole } from '../../types';
import { DataStore } from '../../services/storage';

interface EmployeesTabProps {
  employees: Employee[];
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({ employees }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('WAITER');
  const [active, setActive] = useState(true);

  const openCreate = () => {
    setIsCreating(true);
    setEditingEmployee(null);
    setName('');
    setPhone('+258 84 ');
    setCode(`GAR-${String(employees.length + 1).padStart(2, '0')}`);
    setUsername(`garcom${employees.length + 1}`);
    setPassword('1234');
    setRole('WAITER');
    setActive(true);
  };

  const openEdit = (emp: Employee) => {
    setIsCreating(false);
    setEditingEmployee(emp);
    setName(emp.name);
    setPhone(emp.phone);
    setCode(emp.code);
    setUsername(emp.username);
    setPassword(emp.passwordHash);
    setRole(emp.role);
    setActive(emp.active);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingEmployee(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    if (isCreating) {
      DataStore.addEmployee({
        name: name.trim(),
        phone: phone.trim(),
        code: code.trim(),
        username: username.trim(),
        passwordHash: password.trim(),
        role,
        active,
      });
    } else if (editingEmployee) {
      DataStore.updateEmployee(editingEmployee.id, {
        name: name.trim(),
        phone: phone.trim(),
        code: code.trim(),
        username: username.trim(),
        passwordHash: password.trim(),
        role,
        active,
      });
    }

    cancelForm();
  };

  const handleDelete = (id: string, empName: string) => {
    if (window.confirm(`Tem certeza que deseja apagar o funcionário "${empName}"?`)) {
      DataStore.deleteEmployee(id);
      if (editingEmployee?.id === id) cancelForm();
    }
  };

  const handleToggleActive = (emp: Employee) => {
    DataStore.updateEmployee(emp.id, { active: !emp.active });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#281c11]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading">
            Gestão de Funcionários & Equipa
          </h2>
          <p className="text-xs text-[#9d8d7b]">
            Cadastre serventes, gerentes e administradores. Defina papéis e credenciais de acesso.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4 text-[#140e08]" />
          <span>Cadastrar Funcionário</span>
        </button>
      </div>

      {/* Form modal */}
      {(isCreating || editingEmployee) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl border border-[#d4af37]/40 bg-[#17100a] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d1f14]">
            <h3 className="text-sm font-bold text-[#fae092] uppercase tracking-wider font-heading">
              {isCreating ? 'Novo Funcionário' : `Editar: ${editingEmployee?.name}`}
            </h3>
            <button type="button" onClick={cancelForm} className="text-[#8e806e] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Nome Completo: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Machava"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Telefone:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+258 84 ..."
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Código de Empregado:
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: GAR-01"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Nome de Utilizador: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: cmachava"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Senha / Código PIN: <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
                Nível de Acesso (Papel): <span className="text-[#ef4444]">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-[#342416] bg-[#100b07] p-2.5 text-xs text-[#ede4d8] focus:border-[#d4af37] focus:outline-none"
              >
                <option value="WAITER">Servente (Mesas e Pedidos apenas)</option>
                <option value="MANAGER">Gerente (Operação e Pedidos)</option>
                <option value="ADMIN">Administrador (Acesso Total)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="emp-active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-[#342416] text-[#d4af37]"
            />
            <label htmlFor="emp-active" className="text-xs text-[#ede4d8] cursor-pointer">
              Conta ativa para autenticação no sistema
            </label>
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
              Salvar Funcionário
            </button>
          </div>
        </form>
      )}

      {/* Employees List */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#2d1e13] bg-[#140e09] shadow-lg">
        <div className="space-y-3">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                emp.active
                  ? 'border-[#291c11] bg-[#18100a]'
                  : 'border-[#22160d] bg-[#120b06] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#261a10] border border-[#3d2a19] flex items-center justify-center text-[#d4af37]">
                  <User className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#faeee0] font-heading">
                      {emp.name}
                    </h4>
                    <span className="font-mono text-xs text-[#8e806e]">
                      ({emp.code})
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-bold border uppercase ${
                        emp.role === 'ADMIN'
                          ? 'bg-amber-950/60 border-amber-600/40 text-amber-300'
                          : emp.role === 'MANAGER'
                          ? 'bg-purple-950/60 border-purple-600/40 text-purple-300'
                          : 'bg-blue-950/60 border-blue-600/40 text-blue-300'
                      }`}
                    >
                      {emp.role}
                    </span>
                    {!emp.active && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/40 border border-red-800 text-red-400">
                        Inativo
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#8d7e6e] mt-0.5">
                    Utilizador: <strong className="text-[#ede4d8] font-mono">{emp.username}</strong> • Tel: {emp.phone || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => handleToggleActive(emp)}
                  className="p-1.5 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#d4af37]"
                  title={emp.active ? 'Desativar Conta' : 'Ativar Conta'}
                >
                  {emp.active ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                </button>
                <button
                  onClick={() => openEdit(emp)}
                  className="p-1.5 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#d4af37]"
                  title="Editar Funcionário"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(emp.id, emp.name)}
                  className="p-1.5 rounded-lg border border-[#2d1e13] text-[#8e806e] hover:text-[#ef4444]"
                  title="Apagar Funcionário"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
