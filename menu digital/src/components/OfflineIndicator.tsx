import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-[99] flex items-center gap-2.5 rounded-lg border border-[#c92a2a]/40 bg-[#1e1313] px-3.5 py-2 text-xs font-medium text-[#fca5a5] shadow-2xl backdrop-blur-md animate-pulse">
      <WifiOff className="h-4 w-4 text-[#ef4444]" />
      <span>Modo Offline — O menu funciona pelo cache local. Conecte-se para enviar via WhatsApp.</span>
    </div>
  );
};
