import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, UtensilsCrossed, KeyRound, AlertCircle } from 'lucide-react';
import { Employee } from '../types';
import { DataStore } from '../services/storage';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Employee) => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const employees = DataStore.getEmployees();
    const found = employees.find(
      (emp) =>
        emp.username.toLowerCase() === username.trim().toLowerCase() &&
        emp.passwordHash === password.trim()
    );

    if (!found) {
      setError('Utilizador ou senha incorretos.');
      return;
    }

    if (!found.active) {
      setError('Esta conta de funcionário está inativa. Contacte a administração.');
      return;
    }

    DataStore.setCurrentUser(found);
    onLoginSuccess(found);
    onClose();
  };

  const handleQuickDemoLogin = (role: 'ADMIN' | 'WAITER') => {
    const employees = DataStore.getEmployees();
    const target = employees.find((e) => e.role === role && e.active);
    if (target) {
      setUsername(target.username);
      setPassword(target.passwordHash);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#3b2b1d] bg-[#140e09] shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2b1e13] bg-[#19110a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f5ebd6] font-heading">
                Acesso Restrito — Equipa
              </h2>
              <p className="text-xs text-[#9d8e7c]">
                Área para Serventes, Gerentes e Administradores
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
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl border border-[#ef4444]/40 bg-[#2d1414] text-[#fca5a5] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#ef4444] flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#c4b5a2] mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              Nome de Utilizador:
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: admin ou garcom1"
              className="w-full rounded-xl border border-[#342416] bg-[#18110b] p-2.5 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c4b5a2] mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
              Senha / Código PIN:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a sua senha ou código"
              className="w-full rounded-xl border border-[#342416] bg-[#18110b] p-2.5 text-xs text-[#ede4d8] placeholder-[#7d6f5e] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e2be54] to-[#b38f24] text-[#140e08] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition"
          >
            ENTRAR NO SISTEMA
          </button>

          {/* Quick Demo Access Shortcuts */}
          <div className="pt-3 border-t border-[#26190f]">
            <p className="text-[11px] text-[#8e806e] text-center mb-2">
              Contas de demonstração pré-configuradas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('WAITER')}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[#362719] bg-[#1b120a] text-[#d6c7b5] text-[11px] hover:border-[#d4af37] transition"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Servente (garcom1 / 1234)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-[#362719] bg-[#1b120a] text-[#d6c7b5] text-[11px] hover:border-[#d4af37] transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Admin (admin / admin123)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
