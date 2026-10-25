import React, { useState } from 'react';
import { ROLES_LIST, SystemRole, useApp } from '../context/AppContext';
import { AromaLogo } from './AromaLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Trash2, RotateCcw, AlertTriangle, Layers, Sprout, Droplets, ShieldAlert, Users, Scissors, ShoppingBag, Package, DollarSign, PieChart, Wrench, ShieldCheck } from 'lucide-react';

const ROLE_ICONS: Record<number, React.ReactNode> = {
  1: <Layers className="w-6 h-6 text-emerald-700" />,
  2: <Sprout className="w-6 h-6 text-emerald-700" />,
  3: <Droplets className="w-6 h-6 text-emerald-700" />,
  4: <ShieldAlert className="w-6 h-6 text-red-600" />,
  5: <Users className="w-6 h-6 text-emerald-700" />,
  6: <Scissors className="w-6 h-6 text-emerald-700" />,
  7: <ShoppingBag className="w-6 h-6 text-emerald-700" />,
  8: <Package className="w-6 h-6 text-emerald-700" />,
  9: <DollarSign className="w-6 h-6 text-emerald-700" />,
  10: <PieChart className="w-6 h-6 text-emerald-700" />,
  11: <Wrench className="w-6 h-6 text-emerald-700" />,
  12: <ShieldCheck className="w-6 h-6 text-emerald-700" />
};

export const RoleSelector: React.FC = () => {
  const { setActiveRole, isSampleDataHidden, clearAllSampleData, restoreSampleData } = useApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSelect = (role: SystemRole) => {
    setActiveRole(role);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top quick utility bar without bulky header: clean and discreet */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 mb-4">
        <div className="flex items-center gap-2">
          {isSampleDataHidden ? (
            <button
              onClick={restoreSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg shadow-2xs hover:bg-stone-50 transition"
              title="Restaurar datos de demostración"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Restaurar datos demo</span>
            </button>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-white border border-red-200 rounded-lg shadow-2xs hover:bg-red-50 transition"
              title="Borrar datos de muestra del todo el sistema"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Borrar datos de muestra</span>
            </button>
          )}
        </div>

        {/* PWA Install Button */}
        <div>
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar App</span>
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Instalar en iOS</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Logo unencapsulated + Clean grid of 12 role cards */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col items-center justify-center py-4">
        {/* Logo sin encapsular */}
        <div className="mb-8 md:mb-10 text-center flex justify-center">
          <AromaLogo size="xl" showSubtitle={true} />
        </div>

        {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {ROLES_LIST.map((roleName, index) => {
            const roleNum = index + 1;
            const icon = ROLE_ICONS[roleNum];

            return (
              <button
                key={roleName}
                onClick={() => handleSelect(roleName)}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 bg-white hover:bg-emerald-50/50 rounded-xl border border-stone-200/90 hover:border-emerald-700 shadow-2xs hover:shadow-md transition-all duration-200 text-left cursor-pointer active:scale-[0.98]"
              >
                {/* Visual accent bar */}
                <div className="w-8 h-1 bg-stone-200 group-hover:bg-emerald-700 rounded-full mb-3.5 transition-colors" />

                <div className="mb-2 p-2 rounded-lg bg-stone-100 group-hover:bg-white group-hover:shadow-2xs transition">
                  {icon}
                </div>

                <span className="text-center text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-950 uppercase tracking-tight leading-snug">
                  {roleName}
                </span>

                <div className="mt-2.5 text-[10px] text-stone-400 group-hover:text-emerald-700 font-semibold uppercase tracking-wider">
                  Acceder &rarr;
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer minimal info */}
      <div className="w-full max-w-6xl mx-auto text-center py-4 text-xs text-stone-500 font-medium">
        <span>Invernadero Aroma Flowers &bull; Gestión Agrícola y Floricultura de Exportación</span>
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
              Esta acción vaciará los registros demo de todos los 12 módulos y activará la preferencia en su navegador para que no se vuelvan a cargar. El sistema quedará en blanco listo para recibir datos reales y sincronizar con Supabase.
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

      {/* iOS Install Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-2">Instalar en iPhone o iPad</h3>
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
              1. Toque el botón <strong>Compartir</strong> <span className="text-lg">⎋</span> en la barra de Safari.<br />
              2. Desplácese hacia abajo y presione <strong>"Agregar a pantalla de inicio"</strong>.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-lg bg-emerald-800 text-white text-sm font-bold hover:bg-emerald-900 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
