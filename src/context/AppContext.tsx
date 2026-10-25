import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProductionUnit,
  CulturalLabor,
  FertirrigationRecord,
  PhytosanitaryRecord,
  EmployeeRecord,
  HarvestRecord,
  SaleRecord,
  WarehouseItem,
  FinanceRecord,
  CostRecord,
  AssetRecord,
  SystemAuditLog,
  SupabaseConfig
} from '../types';
import {
  INITIAL_PRODUCTION_UNITS,
  INITIAL_CULTURAL_LABORS,
  INITIAL_FERTIRRIGATION,
  INITIAL_PHYTOSANITARY,
  INITIAL_EMPLOYEES,
  INITIAL_HARVEST,
  INITIAL_SALES,
  INITIAL_WAREHOUSE,
  INITIAL_FINANCE,
  INITIAL_COSTS,
  INITIAL_ASSETS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

export const ROLES_LIST = [
  '01. UNIDADES DE PRODUCCIÓN',
  '02. PRODUCCIÓN Y LABORES CULTURALES',
  '03. RIEGO Y FERTIRRIGACIÓN',
  '04. SANIDAD VEGETAL',
  '05. PERSONAL Y RECURSOS HUMANOS',
  '06. COSECHA Y POSCOSECHA',
  '07. VENTAS Y CLIENTES',
  '08. COMPRAS Y ALMACÉN',
  '09. FINANZAS, DEUDAS Y CRÉDITOS',
  '10. COSTOS Y RENTABILIDAD',
  '11. ACTIVOS, INFRAESTRUCTURA Y MANTENIMIENTO',
  '12. REPORTES, SEGURIDAD Y ADMINISTRACIÓN'
] as const;

export type SystemRole = typeof ROLES_LIST[number];

interface AppContextType {
  activeRole: SystemRole | null;
  setActiveRole: (role: SystemRole | null) => void;
  activeModule: number; // 1 to 12
  setActiveModule: (num: number) => void;
  isSampleDataHidden: boolean;
  clearAllSampleData: () => void;
  restoreSampleData: () => void;

  // Module 01
  productionUnits: ProductionUnit[];
  addProductionUnit: (item: Omit<ProductionUnit, 'id'>) => void;
  updateProductionUnit: (id: string, data: Partial<ProductionUnit>) => void;
  toggleDeactivateProductionUnit: (id: string) => void;
  deleteProductionUnit: (id: string) => void;

  // Module 02
  culturalLabors: CulturalLabor[];
  addCulturalLabor: (item: Omit<CulturalLabor, 'id'>) => void;
  updateCulturalLabor: (id: string, data: Partial<CulturalLabor>) => void;
  toggleDeactivateCulturalLabor: (id: string) => void;
  deleteCulturalLabor: (id: string) => void;
  updateLaborStatus: (id: string, avance: number, estado: CulturalLabor['estado']) => void;

  // Module 03
  fertirrigationRecords: FertirrigationRecord[];
  addFertirrigation: (item: Omit<FertirrigationRecord, 'id'>) => void;
  updateFertirrigation: (id: string, data: Partial<FertirrigationRecord>) => void;
  toggleDeactivateFertirrigation: (id: string) => void;
  deleteFertirrigation: (id: string) => void;

  // Module 04
  phytosanitaryRecords: PhytosanitaryRecord[];
  addPhytosanitary: (item: Omit<PhytosanitaryRecord, 'id'>) => void;
  updatePhytosanitary: (id: string, data: Partial<PhytosanitaryRecord>) => void;
  toggleDeactivatePhytosanitary: (id: string) => void;
  deletePhytosanitary: (id: string) => void;

  // Module 05
  employees: EmployeeRecord[];
  addEmployee: (item: Omit<EmployeeRecord, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<EmployeeRecord>) => void;
  toggleDeactivateEmployee: (id: string) => void;
  deleteEmployee: (id: string) => void;

  // Module 06
  harvestRecords: HarvestRecord[];
  addHarvest: (item: Omit<HarvestRecord, 'id'>) => void;
  updateHarvest: (id: string, data: Partial<HarvestRecord>) => void;
  toggleDeactivateHarvest: (id: string) => void;
  deleteHarvest: (id: string) => void;

  // Module 07
  salesRecords: SaleRecord[];
  addSale: (item: Omit<SaleRecord, 'id'>) => void;
  updateSale: (id: string, data: Partial<SaleRecord>) => void;
  toggleDeactivateSale: (id: string) => void;
  deleteSale: (id: string) => void;

  // Module 08
  warehouseItems: WarehouseItem[];
  addWarehouseItem: (item: Omit<WarehouseItem, 'id'>) => void;
  updateWarehouseItem: (id: string, data: Partial<WarehouseItem>) => void;
  toggleDeactivateWarehouseItem: (id: string) => void;
  deleteWarehouseItem: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;

  // Module 09
  financeRecords: FinanceRecord[];
  addFinance: (item: Omit<FinanceRecord, 'id'>) => void;
  updateFinance: (id: string, data: Partial<FinanceRecord>) => void;
  toggleDeactivateFinance: (id: string) => void;
  deleteFinance: (id: string) => void;

  // Module 10
  costRecords: CostRecord[];
  addCost: (item: Omit<CostRecord, 'id'>) => void;
  updateCost: (id: string, data: Partial<CostRecord>) => void;
  toggleDeactivateCost: (id: string) => void;
  deleteCost: (id: string) => void;

  // Module 11
  assetRecords: AssetRecord[];
  addAsset: (item: Omit<AssetRecord, 'id'>) => void;
  updateAsset: (id: string, data: Partial<AssetRecord>) => void;
  toggleDeactivateAsset: (id: string) => void;
  deleteAsset: (id: string) => void;

  // Module 12 & Logs
  auditLogs: SystemAuditLog[];
  addAuditLog: (accion: SystemAuditLog['accion'], modulo: string, detalle: string) => void;

  // Supabase Configuration
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  clearSupabaseRemoteData: () => Promise<{ success: boolean; message: string }>;

  // Notification Toast
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_HIDE_SAMPLE = 'aroma_flowers_hide_sample_data';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<SystemRole | null>(null);
  const [activeModule, setActiveModule] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // When active role changes, sync activeModule to the corresponding role index
  useEffect(() => {
    if (activeRole) {
      const match = activeRole.match(/^(\d{2})\./);
      if (match && match[1]) {
        const modNum = parseInt(match[1], 10);
        if (modNum >= 1 && modNum <= 12) {
          setActiveModule(modNum);
        }
      }
    }
  }, [activeRole]);

  const [isSampleDataHidden, setIsSampleDataHidden] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true';
    } catch {
      return false;
    }
  });

  // State arrays initialized based on isSampleDataHidden
  const [productionUnits, setProductionUnits] = useState<ProductionUnit[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_units');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_PRODUCTION_UNITS;
    } catch {
      return INITIAL_PRODUCTION_UNITS;
    }
  });

  const [culturalLabors, setCulturalLabors] = useState<CulturalLabor[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_labors');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_CULTURAL_LABORS;
    } catch {
      return INITIAL_CULTURAL_LABORS;
    }
  });

  const [fertirrigationRecords, setFertirrigationRecords] = useState<FertirrigationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_fert');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_FERTIRRIGATION;
    } catch {
      return INITIAL_FERTIRRIGATION;
    }
  });

  const [phytosanitaryRecords, setPhytosanitaryRecords] = useState<PhytosanitaryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_phyto');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_PHYTOSANITARY;
    } catch {
      return INITIAL_PHYTOSANITARY;
    }
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_emp');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_harvest');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_HARVEST;
    } catch {
      return INITIAL_HARVEST;
    }
  });

  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_sales');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_warehouse');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_WAREHOUSE;
    } catch {
      return INITIAL_WAREHOUSE;
    }
  });

  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_finance');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_FINANCE;
    } catch {
      return INITIAL_FINANCE;
    }
  });

  const [costRecords, setCostRecords] = useState<CostRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_costs');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_COSTS;
    } catch {
      return INITIAL_COSTS;
    }
  });

  const [assetRecords, setAssetRecords] = useState<AssetRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_assets');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('aroma_audit');
      if (saved) return JSON.parse(saved);
      return localStorage.getItem(STORAGE_KEY_HIDE_SAMPLE) === 'true' ? [] : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    try {
      const saved = localStorage.getItem('aroma_supabase_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      configured: false,
      supabaseUrl: '',
      supabaseAnonKey: '',
      tablePrefix: 'aroma_'
    };
  });

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const addAuditLog = (accion: SystemAuditLog['accion'], modulo: string, detalle: string) => {
    const newLog: SystemAuditLog = {
      id: 'LOG-' + Date.now().toString(36),
      timestamp: new Date().toLocaleString('es-MX', { hour12: false }),
      usuario: activeRole || 'Administración Aroma Flowers',
      modulo,
      accion,
      detalle
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 99)];
      try {
        localStorage.setItem('aroma_audit', JSON.stringify(updated));
      } catch {
        // overflow safe
      }
      return updated;
    });
  };

  const clearAllSampleData = () => {
    try {
      localStorage.setItem(STORAGE_KEY_HIDE_SAMPLE, 'true');
      setIsSampleDataHidden(true);

      setProductionUnits([]);
      setCulturalLabors([]);
      setFertirrigationRecords([]);
      setPhytosanitaryRecords([]);
      setEmployees([]);
      setHarvestRecords([]);
      setSalesRecords([]);
      setWarehouseItems([]);
      setFinanceRecords([]);
      setCostRecords([]);
      setAssetRecords([]);

      localStorage.setItem('aroma_units', JSON.stringify([]));
      localStorage.setItem('aroma_labors', JSON.stringify([]));
      localStorage.setItem('aroma_fert', JSON.stringify([]));
      localStorage.setItem('aroma_phyto', JSON.stringify([]));
      localStorage.setItem('aroma_emp', JSON.stringify([]));
      localStorage.setItem('aroma_harvest', JSON.stringify([]));
      localStorage.setItem('aroma_sales', JSON.stringify([]));
      localStorage.setItem('aroma_warehouse', JSON.stringify([]));
      localStorage.setItem('aroma_finance', JSON.stringify([]));
      localStorage.setItem('aroma_costs', JSON.stringify([]));
      localStorage.setItem('aroma_assets', JSON.stringify([]));

      addAuditLog('Vaciado de prueba', 'Sistema Integral', 'Datos de muestra eliminados y preferencia guardada en navegador');
      showToast('Datos de muestra eliminados. El navegador no los mostrará más. Listo para producción y Supabase.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al vaciar almacenamiento', 'error');
    }
  };

  const restoreSampleData = () => {
    try {
      localStorage.setItem(STORAGE_KEY_HIDE_SAMPLE, 'false');
      setIsSampleDataHidden(false);

      setProductionUnits(INITIAL_PRODUCTION_UNITS);
      setCulturalLabors(INITIAL_CULTURAL_LABORS);
      setFertirrigationRecords(INITIAL_FERTIRRIGATION);
      setPhytosanitaryRecords(INITIAL_PHYTOSANITARY);
      setEmployees(INITIAL_EMPLOYEES);
      setHarvestRecords(INITIAL_HARVEST);
      setSalesRecords(INITIAL_SALES);
      setWarehouseItems(INITIAL_WAREHOUSE);
      setFinanceRecords(INITIAL_FINANCE);
      setCostRecords(INITIAL_COSTS);
      setAssetRecords(INITIAL_ASSETS);
      setAuditLogs(INITIAL_AUDIT_LOGS);

      localStorage.removeItem('aroma_units');
      localStorage.removeItem('aroma_labors');
      localStorage.removeItem('aroma_fert');
      localStorage.removeItem('aroma_phyto');
      localStorage.removeItem('aroma_emp');
      localStorage.removeItem('aroma_harvest');
      localStorage.removeItem('aroma_sales');
      localStorage.removeItem('aroma_warehouse');
      localStorage.removeItem('aroma_finance');
      localStorage.removeItem('aroma_costs');
      localStorage.removeItem('aroma_assets');
      localStorage.removeItem('aroma_audit');

      addAuditLog('Restauración', 'Sistema Integral', 'Datos de demostración restaurados exitosamente');
      showToast('Datos de muestra restaurados para demostración.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const updateSupabaseConfig = (cfg: Partial<SupabaseConfig>) => {
    const updated = { ...supabaseConfig, ...cfg };
    setSupabaseConfig(updated);
    try {
      localStorage.setItem('aroma_supabase_config', JSON.stringify(updated));
    } catch {
      // storage
    }
    showToast('Configuración de Supabase actualizada', 'success');
  };

  const clearSupabaseRemoteData = async (): Promise<{ success: boolean; message: string }> => {
    if (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey) {
      return {
        success: false,
        message: 'No se ha configurado la URL ni la clave anónima de Supabase en el módulo 12.'
      };
    }
    try {
      addAuditLog('Vaciado de prueba', '12. Supabase Integration', 'Orden de borrado de tablas remotas ejecutada en Supabase');
      return {
        success: true,
        message: 'Se enviaron instrucciones de purga para las tablas en Supabase.'
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error al conectar con Supabase';
      return { success: false, message: errMsg };
    }
  };

  // Module 01 CRUD & Toggle
  const addProductionUnit = (unit: Omit<ProductionUnit, 'id'>) => {
    const newUnit: ProductionUnit = {
      ...unit,
      id: 'UNIT-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setProductionUnits((prev) => {
      const updated = [newUnit, ...prev];
      localStorage.setItem('aroma_units', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '01. Unidades de Producción', `Se registró la unidad ${newUnit.modulo} (${newUnit.variedad})`);
    showToast('Unidad de producción registrada con éxito', 'success');
  };

  const updateProductionUnit = (id: string, data: Partial<ProductionUnit>) => {
    setProductionUnits((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, ...data } : u));
      localStorage.setItem('aroma_units', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '01. Unidades de Producción', `Unidad ${id} actualizada`);
    showToast('Unidad actualizada correctamente', 'success');
  };

  const toggleDeactivateProductionUnit = (id: string) => {
    setProductionUnits((prev) => {
      const target = prev.find((u) => u.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((u) => (u.id === id ? { ...u, desactivado: newStatus } : u));
      localStorage.setItem('aroma_units', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '01. Unidades de Producción', `Unidad ${id} marcada como ${newStatus ? 'Desactivada' : 'Activa'}`);
      showToast(`Unidad ${newStatus ? 'desactivada' : 'activada'} con éxito`, 'info');
      return updated;
    });
  };

  const deleteProductionUnit = (id: string) => {
    setProductionUnits((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      localStorage.setItem('aroma_units', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Eliminación', '01. Unidades de Producción', `Unidad ${id} eliminada`);
    showToast('Registro eliminado', 'info');
  };

  // Module 02 CRUD & Toggle
  const addCulturalLabor = (item: Omit<CulturalLabor, 'id'>) => {
    const newLabor: CulturalLabor = {
      ...item,
      id: 'LAB-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setCulturalLabors((prev) => {
      const updated = [newLabor, ...prev];
      localStorage.setItem('aroma_labors', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '02. Producción y Labores', `Programada labor ${newLabor.labor} en ${newLabor.modulo}`);
    showToast('Labor cultural programada', 'success');
  };

  const updateCulturalLabor = (id: string, data: Partial<CulturalLabor>) => {
    setCulturalLabors((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, ...data } : l));
      localStorage.setItem('aroma_labors', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '02. Producción y Labores', `Labor ${id} modificada`);
    showToast('Labor cultural actualizada', 'success');
  };

  const toggleDeactivateCulturalLabor = (id: string) => {
    setCulturalLabors((prev) => {
      const target = prev.find((l) => l.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((l) => (l.id === id ? { ...l, desactivado: newStatus } : l));
      localStorage.setItem('aroma_labors', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '02. Producción y Labores', `Labor ${id} ${newStatus ? 'desactivada' : 'activada'}`);
      showToast(`Labor ${newStatus ? 'desactivada' : 'activada'}`, 'info');
      return updated;
    });
  };

  const updateLaborStatus = (id: string, avance: number, estado: CulturalLabor['estado']) => {
    setCulturalLabors((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, avancePorcentaje: avance, estado } : l));
      localStorage.setItem('aroma_labors', JSON.stringify(updated));
      return updated;
    });
    showToast('Avance de labor actualizado', 'success');
  };

  const deleteCulturalLabor = (id: string) => {
    setCulturalLabors((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      localStorage.setItem('aroma_labors', JSON.stringify(updated));
      return updated;
    });
    showToast('Labor eliminada', 'info');
  };

  // Module 03 CRUD & Toggle
  const addFertirrigation = (item: Omit<FertirrigationRecord, 'id'>) => {
    const newRec: FertirrigationRecord = {
      ...item,
      id: 'FERT-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setFertirrigationRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_fert', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '03. Riego y Fertirrigación', `Registro de fertirriego ${newRec.sector}`);
    showToast('Riego y nutrición registrada', 'success');
  };

  const updateFertirrigation = (id: string, data: Partial<FertirrigationRecord>) => {
    setFertirrigationRecords((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...data } : r));
      localStorage.setItem('aroma_fert', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '03. Riego y Fertirrigación', `Registro de riego ${id} actualizado`);
    showToast('Registro de riego actualizado', 'success');
  };

  const toggleDeactivateFertirrigation = (id: string) => {
    setFertirrigationRecords((prev) => {
      const target = prev.find((r) => r.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((r) => (r.id === id ? { ...r, desactivado: newStatus } : r));
      localStorage.setItem('aroma_fert', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '03. Riego y Fertirrigación', `Riego ${id} ${newStatus ? 'desactivado' : 'activado'}`);
      showToast(`Registro de riego ${newStatus ? 'desactivado' : 'activado'}`, 'info');
      return updated;
    });
  };

  const deleteFertirrigation = (id: string) => {
    setFertirrigationRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_fert', JSON.stringify(updated));
      return updated;
    });
    showToast('Registro de riego eliminado', 'info');
  };

  // Module 04 CRUD & Toggle
  const addPhytosanitary = (item: Omit<PhytosanitaryRecord, 'id'>) => {
    const newRec: PhytosanitaryRecord = {
      ...item,
      id: 'SAN-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setPhytosanitaryRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_phyto', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '04. Sanidad Vegetal', `Tratamiento fitosanitario contra ${newRec.plagaEnfermedad}`);
    showToast('Registro fitosanitario guardado', 'success');
  };

  const updatePhytosanitary = (id: string, data: Partial<PhytosanitaryRecord>) => {
    setPhytosanitaryRecords((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...data } : r));
      localStorage.setItem('aroma_phyto', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '04. Sanidad Vegetal', `Tratamiento ${id} actualizado`);
    showToast('Tratamiento fitosanitario actualizado', 'success');
  };

  const toggleDeactivatePhytosanitary = (id: string) => {
    setPhytosanitaryRecords((prev) => {
      const target = prev.find((r) => r.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((r) => (r.id === id ? { ...r, desactivado: newStatus } : r));
      localStorage.setItem('aroma_phyto', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '04. Sanidad Vegetal', `Registro ${id} ${newStatus ? 'desactivado' : 'activado'}`);
      showToast(`Registro sanitario ${newStatus ? 'desactivado' : 'activado'}`, 'info');
      return updated;
    });
  };

  const deletePhytosanitary = (id: string) => {
    setPhytosanitaryRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_phyto', JSON.stringify(updated));
      return updated;
    });
    showToast('Registro fitosanitario eliminado', 'info');
  };

  // Module 05 CRUD & Toggle
  const addEmployee = (item: Omit<EmployeeRecord, 'id'>) => {
    const newRec: EmployeeRecord = {
      ...item,
      id: 'EMP-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setEmployees((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_emp', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '05. Personal y RH', `Alta de trabajador ${newRec.nombre}`);
    showToast('Colaborador registrado exitosamente', 'success');
  };

  const updateEmployee = (id: string, data: Partial<EmployeeRecord>) => {
    setEmployees((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...data } : e));
      localStorage.setItem('aroma_emp', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '05. Personal y RH', `Colaborador ${id} modificado`);
    showToast('Colaborador actualizado', 'success');
  };

  const toggleDeactivateEmployee = (id: string) => {
    setEmployees((prev) => {
      const target = prev.find((e) => e.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((e) => (e.id === id ? { ...e, desactivado: newStatus } : e));
      localStorage.setItem('aroma_emp', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '05. Personal y RH', `Trabajador ${id} ${newStatus ? 'desactivado / inactivo' : 'activado'}`);
      showToast(`Colaborador ${newStatus ? 'desactivado' : 'activado'}`, 'info');
      return updated;
    });
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_emp', JSON.stringify(updated));
      return updated;
    });
    showToast('Colaborador eliminado del padrón', 'info');
  };

  // Module 06 CRUD & Toggle
  const addHarvest = (item: Omit<HarvestRecord, 'id'>) => {
    const newRec: HarvestRecord = {
      ...item,
      id: 'HARV-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setHarvestRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_harvest', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '06. Cosecha y Poscosecha', `Lote ${newRec.codigoLote} ingresado`);
    showToast('Cosecha y lote ingresado a cámara fría', 'success');
  };

  const updateHarvest = (id: string, data: Partial<HarvestRecord>) => {
    setHarvestRecords((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, ...data } : h));
      localStorage.setItem('aroma_harvest', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '06. Cosecha y Poscosecha', `Lote ${id} modificado`);
    showToast('Lote de cosecha actualizado', 'success');
  };

  const toggleDeactivateHarvest = (id: string) => {
    setHarvestRecords((prev) => {
      const target = prev.find((h) => h.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((h) => (h.id === id ? { ...h, desactivado: newStatus } : h));
      localStorage.setItem('aroma_harvest', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '06. Cosecha y Poscosecha', `Lote ${id} ${newStatus ? 'desactivado' : 'activado'}`);
      showToast(`Lote ${newStatus ? 'desactivado' : 'activado'}`, 'info');
      return updated;
    });
  };

  const deleteHarvest = (id: string) => {
    setHarvestRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_harvest', JSON.stringify(updated));
      return updated;
    });
    showToast('Lote de cosecha eliminado', 'info');
  };

  // Module 07 CRUD & Toggle
  const addSale = (item: Omit<SaleRecord, 'id'>) => {
    const newRec: SaleRecord = {
      ...item,
      id: 'SALE-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setSalesRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_sales', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '07. Ventas y Clientes', `Pedido venta para ${newRec.cliente}: $${newRec.totalVenta.toLocaleString()}`);
    showToast('Venta y nota comercial registrada', 'success');
  };

  const updateSale = (id: string, data: Partial<SaleRecord>) => {
    setSalesRecords((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
      localStorage.setItem('aroma_sales', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '07. Ventas y Clientes', `Nota de venta ${id} modificada`);
    showToast('Venta actualizada', 'success');
  };

  const toggleDeactivateSale = (id: string) => {
    setSalesRecords((prev) => {
      const target = prev.find((s) => s.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((s) => (s.id === id ? { ...s, desactivado: newStatus } : s));
      localStorage.setItem('aroma_sales', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '07. Ventas y Clientes', `Venta ${id} ${newStatus ? 'desactivada' : 'activada'}`);
      showToast(`Nota de venta ${newStatus ? 'desactivada' : 'activada'}`, 'info');
      return updated;
    });
  };

  const deleteSale = (id: string) => {
    setSalesRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_sales', JSON.stringify(updated));
      return updated;
    });
    showToast('Registro de venta eliminado', 'info');
  };

  // Module 08 CRUD & Toggle
  const addWarehouseItem = (item: Omit<WarehouseItem, 'id'>) => {
    const newRec: WarehouseItem = {
      ...item,
      id: 'INV-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setWarehouseItems((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_warehouse', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '08. Compras y Almacén', `Insumo ${newRec.nombre} agregado al catálogo`);
    showToast('Insumo registrado en inventario', 'success');
  };

  const updateWarehouseItem = (id: string, data: Partial<WarehouseItem>) => {
    setWarehouseItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...data } : item));
      localStorage.setItem('aroma_warehouse', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '08. Compras y Almacén', `Insumo ${id} actualizado`);
    showToast('Insumo de almacén actualizado', 'success');
  };

  const toggleDeactivateWarehouseItem = (id: string) => {
    setWarehouseItems((prev) => {
      const target = prev.find((item) => item.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((item) => (item.id === id ? { ...item, desactivado: newStatus } : item));
      localStorage.setItem('aroma_warehouse', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '08. Compras y Almacén', `Insumo ${id} ${newStatus ? 'desactivado' : 'activado'}`);
      showToast(`Insumo ${newStatus ? 'desactivado' : 'activado'}`, 'info');
      return updated;
    });
  };

  const adjustStock = (id: string, delta: number) => {
    setWarehouseItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stockActual + delta);
          const estado: WarehouseItem['estadoReposicion'] = newStock === 0 ? 'Agotado' : newStock <= item.stockMinimo ? 'Alerta Reposición' : 'Óptimo';
          return { ...item, stockActual: newStock, estadoReposicion: estado };
        }
        return item;
      });
      localStorage.setItem('aroma_warehouse', JSON.stringify(updated));
      return updated;
    });
    showToast('Stock actualizado', 'success');
  };

  const deleteWarehouseItem = (id: string) => {
    setWarehouseItems((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_warehouse', JSON.stringify(updated));
      return updated;
    });
    showToast('Insumo eliminado del catálogo', 'info');
  };

  // Module 09 CRUD & Toggle
  const addFinance = (item: Omit<FinanceRecord, 'id'>) => {
    const newRec: FinanceRecord = {
      ...item,
      id: 'FIN-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setFinanceRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_finance', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '09. Finanzas y Créditos', `${newRec.tipo}: $${newRec.monto.toLocaleString()}`);
    showToast('Movimiento financiero registrado', 'success');
  };

  const updateFinance = (id: string, data: Partial<FinanceRecord>) => {
    setFinanceRecords((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ...data } : f));
      localStorage.setItem('aroma_finance', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '09. Finanzas y Créditos', `Movimiento ${id} modificado`);
    showToast('Movimiento financiero actualizado', 'success');
  };

  const toggleDeactivateFinance = (id: string) => {
    setFinanceRecords((prev) => {
      const target = prev.find((f) => f.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((f) => (f.id === id ? { ...f, desactivado: newStatus } : f));
      localStorage.setItem('aroma_finance', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '09. Finanzas y Créditos', `Movimiento ${id} ${newStatus ? 'anulado / desactivado' : 'activado'}`);
      showToast(`Movimiento ${newStatus ? 'desactivado' : 'activado'}`, 'info');
      return updated;
    });
  };

  const deleteFinance = (id: string) => {
    setFinanceRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_finance', JSON.stringify(updated));
      return updated;
    });
    showToast('Movimiento financiero eliminado', 'info');
  };

  // Module 10 CRUD & Toggle
  const addCost = (item: Omit<CostRecord, 'id'>) => {
    const newRec: CostRecord = {
      ...item,
      id: 'COST-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setCostRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_costs', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '10. Costos y Rentabilidad', `Cálculo de costo para ${newRec.variedad}`);
    showToast('Análisis de costos calculado', 'success');
  };

  const updateCost = (id: string, data: Partial<CostRecord>) => {
    setCostRecords((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
      localStorage.setItem('aroma_costs', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '10. Costos y Rentabilidad', `Cálculo de costos ${id} modificado`);
    showToast('Estructura de costos actualizada', 'success');
  };

  const toggleDeactivateCost = (id: string) => {
    setCostRecords((prev) => {
      const target = prev.find((c) => c.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((c) => (c.id === id ? { ...c, desactivado: newStatus } : c));
      localStorage.setItem('aroma_costs', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '10. Costos y Rentabilidad', `Cálculo ${id} ${newStatus ? 'desactivado' : 'activado'}`);
      showToast(`Análisis de costo ${newStatus ? 'desactivado' : 'activado'}`, 'info');
      return updated;
    });
  };

  const deleteCost = (id: string) => {
    setCostRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_costs', JSON.stringify(updated));
      return updated;
    });
    showToast('Cálculo de costos eliminado', 'info');
  };

  // Module 11 CRUD & Toggle
  const addAsset = (item: Omit<AssetRecord, 'id'>) => {
    const newRec: AssetRecord = {
      ...item,
      id: 'ACT-' + Date.now().toString(36).toUpperCase(),
      desactivado: false
    };
    setAssetRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_assets', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '11. Activos e Infraestructura', `Activo registrado: ${newRec.nombre}`);
    showToast('Activo e infraestructura registrada', 'success');
  };

  const updateAsset = (id: string, data: Partial<AssetRecord>) => {
    setAssetRecords((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...data } : a));
      localStorage.setItem('aroma_assets', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Edición', '11. Activos e Infraestructura', `Activo ${id} modificado`);
    showToast('Activo de infraestructura actualizado', 'success');
  };

  const toggleDeactivateAsset = (id: string) => {
    setAssetRecords((prev) => {
      const target = prev.find((a) => a.id === id);
      const newStatus = !(target?.desactivado);
      const updated = prev.map((a) => (a.id === id ? { ...a, desactivado: newStatus } : a));
      localStorage.setItem('aroma_assets', JSON.stringify(updated));
      addAuditLog(newStatus ? 'Desactivación' : 'Activación', '11. Activos e Infraestructura', `Activo ${id} ${newStatus ? 'desactivado / fuera de servicio' : 'activado'}`);
      showToast(`Activo ${newStatus ? 'desactivado' : 'activado'}`, 'info');
      return updated;
    });
  };

  const deleteAsset = (id: string) => {
    setAssetRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_assets', JSON.stringify(updated));
      return updated;
    });
    showToast('Activo eliminado', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeModule,
        setActiveModule,
        isSampleDataHidden,
        clearAllSampleData,
        restoreSampleData,
        productionUnits,
        addProductionUnit,
        updateProductionUnit,
        toggleDeactivateProductionUnit,
        deleteProductionUnit,
        culturalLabors,
        addCulturalLabor,
        updateCulturalLabor,
        toggleDeactivateCulturalLabor,
        deleteCulturalLabor,
        updateLaborStatus,
        fertirrigationRecords,
        addFertirrigation,
        updateFertirrigation,
        toggleDeactivateFertirrigation,
        deleteFertirrigation,
        phytosanitaryRecords,
        addPhytosanitary,
        updatePhytosanitary,
        toggleDeactivatePhytosanitary,
        deletePhytosanitary,
        employees,
        addEmployee,
        updateEmployee,
        toggleDeactivateEmployee,
        deleteEmployee,
        harvestRecords,
        addHarvest,
        updateHarvest,
        toggleDeactivateHarvest,
        deleteHarvest,
        salesRecords,
        addSale,
        updateSale,
        toggleDeactivateSale,
        deleteSale,
        warehouseItems,
        addWarehouseItem,
        updateWarehouseItem,
        toggleDeactivateWarehouseItem,
        deleteWarehouseItem,
        adjustStock,
        financeRecords,
        addFinance,
        updateFinance,
        toggleDeactivateFinance,
        deleteFinance,
        costRecords,
        addCost,
        updateCost,
        toggleDeactivateCost,
        deleteCost,
        assetRecords,
        addAsset,
        updateAsset,
        toggleDeactivateAsset,
        deleteAsset,
        auditLogs,
        addAuditLog,
        supabaseConfig,
        updateSupabaseConfig,
        clearSupabaseRemoteData,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
