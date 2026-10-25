import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, WifiOff } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

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

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {/* Offline Status Warning */}
      {!isOnline && (
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg animate-bounce">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Modo sin conexión: Los datos se guardan localmente en el dispositivo.</span>
        </div>
      )}

      {/* Operational Toast */}
      {toastMessage && (
        <div
          className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-xl transition-all duration-300 ${
            toastMessage.type === 'error'
              ? 'bg-red-600'
              : toastMessage.type === 'info'
              ? 'bg-stone-900'
              : 'bg-emerald-800'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : toastMessage.type === 'info' ? (
            <Info className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
};
