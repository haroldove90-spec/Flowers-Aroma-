import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AromaLogo } from './AromaLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  LogOut,
  Download,
  Trash2,
  RotateCcw,
  Menu,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeRole,
    setActiveRole,
    isSampleDataHidden,
    clearAllSampleData,
    restoreSampleData
  } = useApp();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger + System Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
            aria-label="Abrir menú de módulos"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveRole(null)}
            className="text-left cursor-pointer transition hover:opacity-90"
            title="Ir a inicio de selección de roles"
          >
            <AromaLogo size="sm" showSubtitle={false} />
          </button>
        </div>

        {/* Center: Active Role Badge */}
        {activeRole && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200/80 rounded-lg">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-xs font-bold text-stone-800 tracking-tight truncate max-w-[280px] md:max-w-md">
              {activeRole}
            </span>
          </div>
        )}

        {/* Right: Actions (PWA install, clear sample data, logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sample Data Control */}
          {isSampleDataHidden ? (
            <button
              onClick={restoreSampleData}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition"
              title="Restaurar datos de demostración"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Restaurar demo</span>
            </button>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition"
              title="Borrar datos de muestra del todo el sistema"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden md:inline">Borrar datos demo</span>
            </button>
          )}

          {/* Quick PWA Install */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar</span>
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Instalar iOS</span>
            </button>
          )}

          {/* Botón de cierre de sesión */}
          <button
            onClick={() => setActiveRole(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-red-700 bg-stone-100 hover:bg-red-50 border border-stone-200 rounded-lg transition"
            title="Cerrar sesión de rol y regresar a selector"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal to Clear Sample Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-stone-900">¿Borrar todos los datos de muestra?</h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              Esta acción vaciará los registros de prueba en los 12 módulos y registrará la preferencia en el navegador para que no se muestren más. Podrá ingresar datos reales y se sincronizará con Supabase al configurarse.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAllSampleData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
              >
                Sí, borrar datos demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-2">Instalar en iPhone o iPad</h3>
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
              1. Toque el botón <strong>Compartir</strong> en la barra inferior de Safari.<br />
              2. Seleccione <strong>"Agregar a pantalla de inicio"</strong>.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-lg bg-emerald-800 text-white text-sm font-bold hover:bg-emerald-900 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
