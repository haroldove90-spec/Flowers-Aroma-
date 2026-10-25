import React from 'react';
import { useApp, ROLES_LIST } from '../context/AppContext';
import {
  Layers,
  Droplets,
  ShieldAlert,
  Scissors,
  LayoutGrid
} from 'lucide-react';

interface BottomBarProps {
  onOpenSidebar: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ onOpenSidebar }) => {
  const { activeModule, setActiveModule, setActiveRole } = useApp();

  const handleSelect = (modNum: number) => {
    setActiveModule(modNum);
    const matchedRole = ROLES_LIST[modNum - 1];
    if (matchedRole) {
      setActiveRole(matchedRole);
    }
  };

  const navItems = [
    { num: 1, label: 'Unidades', icon: <Layers className="w-5 h-5" /> },
    { num: 3, label: 'Riego', icon: <Droplets className="w-5 h-5" /> },
    { num: 4, label: 'Sanidad', icon: <ShieldAlert className="w-5 h-5" /> },
    { num: 6, label: 'Cosecha', icon: <Scissors className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 lg:hidden safe-area-bottom shadow-lg">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const isActive = activeModule === item.num;
          return (
            <button
              key={item.num}
              onClick={() => handleSelect(item.num)}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-emerald-50 text-emerald-800' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* 5th slot: Open complete menu */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center h-full text-stone-600 hover:text-stone-900 transition-colors"
        >
          <div className="p-1 rounded-md text-stone-700">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">12 Módulos</span>
        </button>
      </div>
    </nav>
  );
};
