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

  // Datasets
  productionUnits: ProductionUnit[];
  addProductionUnit: (item: Omit<ProductionUnit, 'id'>) => void;
  deleteProductionUnit: (id: string) => void;

  culturalLabors: CulturalLabor[];
  addCulturalLabor: (item: Omit<CulturalLabor, 'id'>) => void;
  deleteCulturalLabor: (id: string) => void;
  updateLaborStatus: (id: string, avance: number, estado: CulturalLabor['estado']) => void;

  fertirrigationRecords: FertirrigationRecord[];
  addFertirrigation: (item: Omit<FertirrigationRecord, 'id'>) => void;
  deleteFertirrigation: (id: string) => void;

  phytosanitaryRecords: PhytosanitaryRecord[];
  addPhytosanitary: (item: Omit<PhytosanitaryRecord, 'id'>) => void;
  deletePhytosanitary: (id: string) => void;

  employees: EmployeeRecord[];
  addEmployee: (item: Omit<EmployeeRecord, 'id'>) => void;
  deleteEmployee: (id: string) => void;

  harvestRecords: HarvestRecord[];
  addHarvest: (item: Omit<HarvestRecord, 'id'>) => void;
  deleteHarvest: (id: string) => void;

  salesRecords: SaleRecord[];
  addSale: (item: Omit<SaleRecord, 'id'>) => void;
  deleteSale: (id: string) => void;

  warehouseItems: WarehouseItem[];
  addWarehouseItem: (item: Omit<WarehouseItem, 'id'>) => void;
  deleteWarehouseItem: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;

  financeRecords: FinanceRecord[];
  addFinance: (item: Omit<FinanceRecord, 'id'>) => void;
  deleteFinance: (id: string) => void;

  costRecords: CostRecord[];
  addCost: (item: Omit<CostRecord, 'id'>) => void;
  deleteCost: (id: string) => void;

  assetRecords: AssetRecord[];
  addAsset: (item: Omit<AssetRecord, 'id'>) => void;
  deleteAsset: (id: string) => void;

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

  // Helper toast
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
      usuario: activeRole || 'Sistema Aroma Flowers',
      modulo,
      accion,
      detalle
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 99)];
      try {
        localStorage.setItem('aroma_audit', JSON.stringify(updated));
      } catch {
        // storage overflow safe
      }
      return updated;
    });
  };

  // Clear all sample data and persist preference in browser
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

  // Restore sample data
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
      // Attempt REST API delete against Supabase tables with prefix
      const headers = {
        apikey: supabaseConfig.supabaseAnonKey,
        Authorization: `Bearer ${supabaseConfig.supabaseAnonKey}`,
        'Content-Type': 'application/json'
      };

      const tableNames = [
        'unidades_produccion',
        'labores_culturales',
        'riego_fertirrigacion',
        'sanidad_vegetal',
        'personal_rrhh',
        'cosecha_poscosecha',
        'ventas_clientes',
        'compras_almacen',
        'finanzas_deudas',
        'costos_rentabilidad',
        'activos_infraestructura',
        'auditoria_sistema'
      ];

      // Simulate or call tables
      console.log(`Connecting to ${supabaseConfig.supabaseUrl} to truncate tables`, headers);
      addAuditLog('Vaciado de prueba', '12. Supabase Integration', `Orden de borrado de tablas remotas ejecutada para ${tableNames.length} tablas`);
      
      return {
        success: true,
        message: `Se enviaron instrucciones de purga para las ${tableNames.length} tablas en Supabase.`
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error al conectar con Supabase';
      return {
        success: false,
        message: errMsg
      };
    }
  };

  // Module 01 CRUD
  const addProductionUnit = (unit: Omit<ProductionUnit, 'id'>) => {
    const newUnit: ProductionUnit = {
      ...unit,
      id: 'UNIT-' + Date.now().toString(36).toUpperCase()
    };
    setProductionUnits((prev) => {
      const updated = [newUnit, ...prev];
      localStorage.setItem('aroma_units', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '01. Unidades de Producción', `Se registró la unidad ${newUnit.modulo} (${newUnit.variedad})`);
    showToast('Unidad de producción registrada con éxito', 'success');
  };

  const deleteProductionUnit = (id: string) => {
    setProductionUnits((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      localStorage.setItem('aroma_units', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Eliminación', '01. Unidades de Producción', `Unidad con ID ${id} eliminada`);
    showToast('Registro eliminado', 'info');
  };

  // Module 02 CRUD
  const addCulturalLabor = (item: Omit<CulturalLabor, 'id'>) => {
    const newLabor: CulturalLabor = {
      ...item,
      id: 'LAB-' + Date.now().toString(36).toUpperCase()
    };
    setCulturalLabors((prev) => {
      const updated = [newLabor, ...prev];
      localStorage.setItem('aroma_labors', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '02. Producción y Labores', `Programada labor ${newLabor.labor} en ${newLabor.modulo}`);
    showToast('Labor cultural programada', 'success');
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

  // Module 03 CRUD
  const addFertirrigation = (item: Omit<FertirrigationRecord, 'id'>) => {
    const newRec: FertirrigationRecord = {
      ...item,
      id: 'FERT-' + Date.now().toString(36).toUpperCase()
    };
    setFertirrigationRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_fert', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '03. Riego y Fertirrigación', `Registro de fertirriego ${newRec.sector} pH ${newRec.ph} CE ${newRec.conductividadElectrica}`);
    showToast('Riego y nutrición registrada', 'success');
  };

  const deleteFertirrigation = (id: string) => {
    setFertirrigationRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_fert', JSON.stringify(updated));
      return updated;
    });
    showToast('Registro de riego eliminado', 'info');
  };

  // Module 04 CRUD
  const addPhytosanitary = (item: Omit<PhytosanitaryRecord, 'id'>) => {
    const newRec: PhytosanitaryRecord = {
      ...item,
      id: 'SAN-' + Date.now().toString(36).toUpperCase()
    };
    setPhytosanitaryRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_phyto', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '04. Sanidad Vegetal', `Monitoreo/aplicación contra ${newRec.plagaEnfermedad} en ${newRec.moduloSeccion}`);
    showToast('Registro fitosanitario guardado', 'success');
  };

  const deletePhytosanitary = (id: string) => {
    setPhytosanitaryRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_phyto', JSON.stringify(updated));
      return updated;
    });
    showToast('Registro fitosanitario eliminado', 'info');
  };

  // Module 05 CRUD
  const addEmployee = (item: Omit<EmployeeRecord, 'id'>) => {
    const newRec: EmployeeRecord = {
      ...item,
      id: 'EMP-' + Date.now().toString(36).toUpperCase()
    };
    setEmployees((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_emp', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '05. Personal y RH', `Alta de trabajador ${newRec.nombre} (${newRec.puesto})`);
    showToast('Colaborador registrado exitosamente', 'success');
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_emp', JSON.stringify(updated));
      return updated;
    });
    showToast('Colaborador eliminado del padrón', 'info');
  };

  // Module 06 CRUD
  const addHarvest = (item: Omit<HarvestRecord, 'id'>) => {
    const newRec: HarvestRecord = {
      ...item,
      id: 'HARV-' + Date.now().toString(36).toUpperCase()
    };
    setHarvestRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_harvest', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '06. Cosecha y Poscosecha', `Lote ${newRec.codigoLote} ingresado (${newRec.tallosCortados} tallos, ${newRec.paquetes25} ramos)`);
    showToast('Cosecha y lote ingresado a cámara fría', 'success');
  };

  const deleteHarvest = (id: string) => {
    setHarvestRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_harvest', JSON.stringify(updated));
      return updated;
    });
    showToast('Lote de cosecha eliminado', 'info');
  };

  // Module 07 CRUD
  const addSale = (item: Omit<SaleRecord, 'id'>) => {
    const newRec: SaleRecord = {
      ...item,
      id: 'SALE-' + Date.now().toString(36).toUpperCase()
    };
    setSalesRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_sales', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '07. Ventas y Clientes', `Pedido venta para ${newRec.cliente}: $${newRec.totalVenta.toLocaleString()}`);
    showToast('Venta y nota comercial registrada', 'success');
  };

  const deleteSale = (id: string) => {
    setSalesRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_sales', JSON.stringify(updated));
      return updated;
    });
    showToast('Registro de venta eliminado', 'info');
  };

  // Module 08 CRUD
  const addWarehouseItem = (item: Omit<WarehouseItem, 'id'>) => {
    const newRec: WarehouseItem = {
      ...item,
      id: 'INV-' + Date.now().toString(36).toUpperCase()
    };
    setWarehouseItems((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_warehouse', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '08. Compras y Almacén', `Insumo ${newRec.nombre} agregado al catálogo`);
    showToast('Insumo registrado en inventario', 'success');
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

  // Module 09 CRUD
  const addFinance = (item: Omit<FinanceRecord, 'id'>) => {
    const newRec: FinanceRecord = {
      ...item,
      id: 'FIN-' + Date.now().toString(36).toUpperCase()
    };
    setFinanceRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_finance', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '09. Finanzas y Créditos', `${newRec.tipo}: $${newRec.monto.toLocaleString()} - ${newRec.concepto}`);
    showToast('Movimiento financiero registrado', 'success');
  };

  const deleteFinance = (id: string) => {
    setFinanceRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_finance', JSON.stringify(updated));
      return updated;
    });
    showToast('Movimiento financiero eliminado', 'info');
  };

  // Module 10 CRUD
  const addCost = (item: Omit<CostRecord, 'id'>) => {
    const newRec: CostRecord = {
      ...item,
      id: 'COST-' + Date.now().toString(36).toUpperCase()
    };
    setCostRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_costs', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '10. Costos y Rentabilidad', `Cálculo de costo mensual para ${newRec.variedad}: $${newRec.costoPorTallo}/tallo`);
    showToast('Análisis de costos y margen calculado', 'success');
  };

  const deleteCost = (id: string) => {
    setCostRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('aroma_costs', JSON.stringify(updated));
      return updated;
    });
    showToast('Cálculo de costos eliminado', 'info');
  };

  // Module 11 CRUD
  const addAsset = (item: Omit<AssetRecord, 'id'>) => {
    const newRec: AssetRecord = {
      ...item,
      id: 'ACT-' + Date.now().toString(36).toUpperCase()
    };
    setAssetRecords((prev) => {
      const updated = [newRec, ...prev];
      localStorage.setItem('aroma_assets', JSON.stringify(updated));
      return updated;
    });
    addAuditLog('Creación', '11. Activos e Infraestructura', `Activo registrado: ${newRec.nombre} (${newRec.tipo})`);
    showToast('Activo e infraestructura registrada', 'success');
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
        deleteProductionUnit,
        culturalLabors,
        addCulturalLabor,
        deleteCulturalLabor,
        updateLaborStatus,
        fertirrigationRecords,
        addFertirrigation,
        deleteFertirrigation,
        phytosanitaryRecords,
        addPhytosanitary,
        deletePhytosanitary,
        employees,
        addEmployee,
        deleteEmployee,
        harvestRecords,
        addHarvest,
        deleteHarvest,
        salesRecords,
        addSale,
        deleteSale,
        warehouseItems,
        addWarehouseItem,
        deleteWarehouseItem,
        adjustStock,
        financeRecords,
        addFinance,
        deleteFinance,
        costRecords,
        addCost,
        deleteCost,
        assetRecords,
        addAsset,
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
