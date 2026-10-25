import React from 'react';
import { useApp, ROLES_LIST } from '../context/AppContext';
import {
  Layers,
  Sprout,
  Droplets,
  ShieldAlert,
  Users,
  Scissors,
  ShoppingBag,
  Package,
  DollarSign,
  PieChart,
  Wrench,
  ShieldCheck,
  X,
  Database
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODULE_DATA: Array<{ num: number; name: string; icon: React.ReactNode }> = [
  { num: 1, name: '01. Unidades de Producción', icon: <Layers className="w-4 h-4" /> },
  { num: 2, name: '02. Producción y Labores', icon: <Sprout className="w-4 h-4" /> },
  { num: 3, name: '03. Riego y Fertirrigación', icon: <Droplets className="w-4 h-4" /> },
  { num: 4, name: '04. Sanidad Vegetal', icon: <ShieldAlert className="w-4 h-4 text-red-500" /> },
  { num: 5, name: '05. Personal y RH', icon: <Users className="w-4 h-4" /> },
  { num: 6, name: '06. Cosecha y Poscosecha', icon: <Scissors className="w-4 h-4" /> },
  { num: 7, name: '07. Ventas y Clientes', icon: <ShoppingBag className="w-4 h-4" /> },
  { num: 8, name: '08. Compras y Almacén', icon: <Package className="w-4 h-4" /> },
  { num: 9, name: '09. Finanzas y Créditos', icon: <DollarSign className="w-4 h-4" /> },
  { num: 10, name: '10. Costos y Rentabilidad', icon: <PieChart className="w-4 h-4" /> },
  { num: 11, name: '11. Activos e Infraestructura', icon: <Wrench className="w-4 h-4" /> },
  { num: 12, name: '12. Reportes y Admin', icon: <ShieldCheck className="w-4 h-4" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeModule, setActiveModule, setActiveRole, isSampleDataHidden } = useApp();

  const handleSelectModule = (modNum: number) => {
    setActiveModule(modNum);
    // Also sync active role
    const matchedRole = ROLES_LIST[modNum - 1];
    if (matchedRole) {
      setActiveRole(matchedRole);
    }
    // Close sidebar on mobile/tablet viewports
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-stone-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h2 className="text-xs font-black tracking-wider uppercase text-stone-900">
              Módulos del Sistema
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {MODULE_DATA.map((mod) => {
            const isActive = activeModule === mod.num;

            return (
              <button
                key={mod.num}
                onClick={() => handleSelectModule(mod.num)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`}>
                  {mod.icon}
                </span>
                <span className="truncate flex-1">{mod.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Database & System Status indicator */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/70">
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Database className="w-3 h-3 text-emerald-700" />
              Almacenamiento
            </span>
            <span className={`font-bold ${isSampleDataHidden ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isSampleDataHidden ? 'Limpio / Producción' : 'Datos Demo'}
            </span>
          </div>
          <p className="text-[10px] text-stone-400">
            {isSampleDataHidden
              ? 'Listo para conectar con Supabase.'
              : 'Mostrando datos de prueba de vivero.'}
          </p>
        </div>
      </aside>
    </>
  );
};
