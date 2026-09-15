import React, { useState } from 'react';
import { Database, Cloud, Save, RefreshCw, CheckCircle2, AlertTriangle, Key, ExternalLink, Shield } from 'lucide-react';
import { FirebaseConfig } from '../../types';
import { DataStore } from '../../services/storage';
import { FirebaseService } from '../../services/firebase';

export const FirebaseTab: React.FC = () => {
  const currentConfig = DataStore.getFirebaseConfig();

  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const config: FirebaseConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    DataStore.saveFirebaseConfig(config);
    const initialized = FirebaseService.initialize(config);

    if (initialized) {
      setStatusMessage({
        type: 'success',
        text: 'Credenciais Firebase salvas e inicializadas com sucesso!',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Erro ao inicializar Firebase. Verifique a chave de API e Project ID.',
      });
    }
  };

  const handleClearConfig = () => {
    if (window.confirm('Deseja desconectar o Firebase e usar exclusivamente o armazenamento local?')) {
      DataStore.saveFirebaseConfig(null);
      setApiKey('');
      setAuthDomain('');
      setProjectId('');
      setStorageBucket('');
      setMessagingSenderId('');
      setAppId('');
      setStatusMessage({
        type: 'info',
        text: 'Firebase desconectado. O sistema está a operar em modo Local-First seguro.',
      });
    }
  };

  const handleSeedCloud = async () => {
    setIsSyncing(true);
    setStatusMessage(null);

    try {
      const isConnected = FirebaseService.isReady();
      if (!isConnected) {
        setStatusMessage({
          type: 'error',
          text: 'Firebase não está configurado ou inicializado. Insira as credenciais primeiro.',
        });
        setIsSyncing(false);
        return;
      }

      // Sync local data to Firestore
      const products = DataStore.getProducts();
      const categories = DataStore.getCategories();
      const tables = DataStore.getTables();
      const settings = DataStore.getSettings();

      await FirebaseService.syncFromLocalToCloud({
        products,
        categories,
        tables,
        settings,
      });

      setStatusMessage({
        type: 'success',
        text: 'Dados demo sincronizados com sucesso para as coleções do Firestore na nuvem!',
      });
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : String(err);
      setStatusMessage({
        type: 'error',
        text: `Falha ao sincronizar com o Firebase: ${errStr}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const isConnected = FirebaseService.isReady();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#281c11]">
        <h2 className="text-lg sm:text-xl font-bold text-[#faeee0] font-heading flex items-center gap-2">
          <Cloud className="w-5 h-5 text-[#d4af37]" />
          Integração com Firebase & Nuvem Firestore
        </h2>
        <p className="text-xs text-[#9d8d7b]">
          Arquitetura Local-First híbrida. O sistema funciona 100% offline no navegador e sincroniza em tempo real com a nuvem quando configurado.
        </p>
      </div>

      {/* Cloud Status Card */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
        isConnected
          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
          : 'border-[#382819] bg-[#160f0a] text-[#cfc1b0]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isConnected
              ? 'bg-emerald-900/40 border-emerald-500/40 text-emerald-400'
              : 'bg-[#22160e] border-[#3a2718] text-[#d4af37]'
          }`}>
            <Database className="w-5 h-5" />
          </div>

          <div>
            <h4 className="text-sm font-bold font-heading">
              Estado da Nuvem: {isConnected ? '🟢 Conectado ao Firebase' : '🟡 Modo Local Ativo (Sem Nuvem)'}
            </h4>
            <p className="text-xs text-[#9c8d7b]">
              {isConnected
                ? `Projeto: ${currentConfig?.projectId || 'Configurado'} • Firestore Pronto`
                : 'Os pedidos e alterações ficam salvos no armazenamento local do navegador sem perda de dados.'}
            </p>
          </div>
        </div>

        {isConnected && (
          <button
            type="button"
            onClick={handleClearConfig}
            className="text-xs text-[#ef4444] hover:underline"
          >
            Desconectar
          </button>
        )}
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
          statusMessage.type === 'success'
            ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
            : statusMessage.type === 'error'
            ? 'border-rose-500/40 bg-rose-950/40 text-rose-300'
            : 'border-[#382819] bg-[#18110b] text-[#dcd1be]'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSaveConfig} className="p-5 rounded-2xl border border-[#3b2a1c] bg-[#140e09] shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-[#faeee0] font-heading uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#281c11]">
          <Key className="w-4 h-4 text-[#d4af37]" />
          Credenciais do Projeto Firebase
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              API Key: <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Project ID: <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="comanchero-menu"
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Auth Domain:
            </label>
            <input
              type="text"
              value={authDomain}
              onChange={(e) => setAuthDomain(e.target.value)}
              placeholder="comanchero-menu.firebaseapp.com"
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Storage Bucket:
            </label>
            <input
              type="text"
              value={storageBucket}
              onChange={(e) => setStorageBucket(e.target.value)}
              placeholder="comanchero-menu.appspot.com"
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              Messaging Sender ID:
            </label>
            <input
              type="text"
              value={messagingSenderId}
              onChange={(e) => setMessagingSenderId(e.target.value)}
              placeholder="1234567890"
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c5b6a3] mb-1">
              App ID:
            </label>
            <input
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="1:1234567890:web:abcdef..."
              className="w-full rounded-xl border border-[#342416] bg-[#1a120b] p-2.5 text-xs text-[#ede4d8] font-mono focus:border-[#d4af37] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#26190f]">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f24] text-[#140e08] font-bold text-xs uppercase tracking-wider shadow hover:brightness-110"
          >
            <Save className="w-4 h-4 text-[#140e08]" />
            <span>Guardar Configuração Firebase</span>
          </button>

          {/* Button: INICIALIZAR DADOS DEMO NA NUVEM as explicitly requested in Item 22 */}
          <button
            type="button"
            onClick={handleSeedCloud}
            disabled={isSyncing || !isConnected}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#3b2a1c] bg-[#1c1209] text-xs font-bold text-[#fae092] hover:border-[#d4af37] disabled:opacity-40 transition"
          >
            <RefreshCw className={`w-4 h-4 text-[#d4af37] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>INICIALIZAR DADOS DEMO NA NUVEM</span>
          </button>
        </div>
      </form>
    </div>
  );
};
