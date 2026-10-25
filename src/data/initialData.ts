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
  SystemAuditLog
} from '../types';

export const INITIAL_PRODUCTION_UNITS: ProductionUnit[] = [
  {
    id: 'UNIT-001',
    predio: 'Predio El Rosal',
    modulo: 'Módulo 1 - Alta Densidad',
    seccion: 'Sección A1-A4',
    superficieM2: 5000,
    tuneles: 6,
    camas: 48,
    variedad: 'Rosa Freedom (Roja)',
    color: 'Rojo Carmesí',
    numPlantas: 35000,
    densidadM2: 7.0,
    coordenadas: '19.4326° N, 99.1332° O',
    altitudMsnm: 2450,
    regimenTenencia: 'Propiedad',
    fechaPlantacion: '2024-03-15',
    metaTallosAnual: 315000,
    croquisUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
    estado: 'En producción'
  },
  {
    id: 'UNIT-002',
    predio: 'Predio El Rosal',
    modulo: 'Módulo 2 - Exportación',
    seccion: 'Sección B1-B4',
    superficieM2: 4800,
    tuneles: 6,
    camas: 44,
    variedad: 'Rosa Mondial (Blanca)',
    color: 'Blanco Puro',
    numPlantas: 31000,
    densidadM2: 6.45,
    coordenadas: '19.4330° N, 99.1328° O',
    altitudMsnm: 2450,
    regimenTenencia: 'Propiedad',
    fechaPlantacion: '2024-05-10',
    metaTallosAnual: 280000,
    croquisUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    estado: 'En producción'
  },
  {
    id: 'UNIT-003',
    predio: 'Predio Las Lomas',
    modulo: 'Módulo 3 - Variedades Especiales',
    seccion: 'Sección C1-C3',
    superficieM2: 3600,
    tuneles: 4,
    camas: 32,
    variedad: 'Rosa Explorer & Pink Floyd',
    color: 'Rojo Oscuro / Fucsia',
    numPlantas: 24000,
    densidadM2: 6.66,
    coordenadas: '19.4350° N, 99.1305° O',
    altitudMsnm: 2465,
    regimenTenencia: 'Arrendamiento',
    fechaPlantacion: '2023-11-20',
    metaTallosAnual: 210000,
    estado: 'En producción'
  }
];

export const INITIAL_CULTURAL_LABORS: CulturalLabor[] = [
  {
    id: 'LAB-101',
    modulo: 'Módulo 1 - Alta Densidad',
    seccion: 'Sección A1-A2',
    labor: 'Desahije',
    fechaProgramada: '2026-10-25',
    responsableEquipo: 'Cuadrilla Norte (Don Juan)',
    avancePorcentaje: 85,
    estado: 'En curso',
    incidencias: 'Brotes vigorosos tras fertirriego equilibrado'
  },
  {
    id: 'LAB-102',
    modulo: 'Módulo 2 - Exportación',
    seccion: 'Sección B3-B4',
    labor: 'Tutoreo',
    fechaProgramada: '2026-10-24',
    responsableEquipo: 'Cuadrilla Central (María R.)',
    avancePorcentaje: 100,
    estado: 'Concluida',
    incidencias: 'Malla tutora nivelada a 60cm'
  },
  {
    id: 'LAB-103',
    modulo: 'Módulo 3 - Variedades Especiales',
    seccion: 'Sección C2',
    labor: 'Pinch',
    fechaProgramada: '2026-10-23',
    responsableEquipo: 'Equipo Técnico (Ing. Carlos)',
    avancePorcentaje: 40,
    estado: 'Atrasada',
    incidencias: 'Retraso por jornada de nebulización matutina'
  },
  {
    id: 'LAB-104',
    modulo: 'Módulo 1 - Alta Densidad',
    seccion: 'Sección A3',
    labor: 'Manejo de cortinas',
    fechaProgramada: '2026-10-25',
    responsableEquipo: 'Operador de Turno',
    avancePorcentaje: 100,
    estado: 'Concluida',
    incidencias: 'Apertura al 70% a las 10:00 AM por incremento térmico'
  }
];

export const INITIAL_FERTIRRIGATION: FertirrigationRecord[] = [
  {
    id: 'FERT-201',
    sector: 'Sector 1 - Nave 1A',
    modulo: 'Módulo 1 - Alta Densidad',
    fecha: '2026-10-25',
    bombaValvula: 'Bomba Principal Goulds 5HP - Válvula Solenoide 01',
    tiempoRiegoMin: 45,
    caudalLitrosHora: 8500,
    volumenM3: 6.37,
    ph: 5.85,
    conductividadElectrica: 1.65,
    tensionCbar: 18,
    tanqueA_kg: 'Nitrato de Calcio 18kg + Quelato Fe EDDHA 450g',
    tanqueB_kg: 'Nitrato de Potasio 14kg + Fosfato Monopotásico 9kg + Sulfato Mg 6kg',
    costoEstimado: 485.50,
    observaciones: 'CE de entrada óptima; drenaje medido al 18%'
  },
  {
    id: 'FERT-202',
    sector: 'Sector 2 - Nave 1B',
    modulo: 'Módulo 2 - Exportación',
    fecha: '2026-10-24',
    bombaValvula: 'Bomba Secundaria 3HP - Válvula 03',
    tiempoRiegoMin: 35,
    caudalLitrosHora: 6200,
    volumenM3: 3.61,
    ph: 5.92,
    conductividadElectrica: 1.58,
    tensionCbar: 22,
    tanqueA_kg: 'Nitrato de Calcio 12kg + Ácido Nítrico 1.2L',
    tanqueB_kg: 'Nitrato de Potasio 10kg + Sulfato de Potasio 5kg',
    costoEstimado: 310.00,
    observaciones: 'Calibración de inyectores Venturi verificada'
  }
];

export const INITIAL_PHYTOSANITARY: PhytosanitaryRecord[] = [
  {
    id: 'SAN-301',
    fecha: '2026-10-25',
    moduloSeccion: 'Módulo 3 - Sección C1',
    plagaEnfermedad: 'Arañita Roja',
    incidenciaPorc: 4.8,
    severidad: 'Leve (1)',
    productoComercial: 'Abamectina 1.8% CE',
    ingredienteActivo: 'Abamectina',
    dosisPorHectolitro: '60 cc / 100 L',
    volumenAguaLitros: 400,
    operarioEquipo: 'Javier Morales (Pistola Maruyama 30 bar)',
    loteProducto: 'ABM-2026-09',
    periodoReingresoHoras: 24,
    eppRequerido: 'Traje Tyvek, Máscara con filtros vapores orgánicos, guantes nitrilo',
    eficaciaPorc: 92,
    costoTotal: 640.00
  },
  {
    id: 'SAN-302',
    fecha: '2026-10-22',
    moduloSeccion: 'Módulo 1 - Sección A4',
    plagaEnfermedad: 'Botrytis',
    incidenciaPorc: 2.1,
    severidad: 'Leve (1)',
    productoComercial: 'Switch 62.5 WG',
    ingredienteActivo: 'Fludioxonil + Ciprodinil',
    dosisPorHectolitro: '100 g / 100 L',
    volumenAguaLitros: 500,
    operarioEquipo: 'Rigoberto Gómez',
    loteProducto: 'SW-8842',
    periodoReingresoHoras: 12,
    eppRequerido: 'Overol completo, careta protectora, botas neopreno',
    eficaciaPorc: 98,
    costoTotal: 890.00
  }
];

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'EMP-01',
    nombre: 'Ing. Carlos Mendoza',
    puesto: 'Supervisor de Campo',
    equipoCuadrilla: 'Supervisión Técnica',
    moduloAsignado: 'Módulos 1, 2 y 3',
    salarioBaseSemanal: 4200,
    bonoProductividad: 800,
    asistenciaDias: 6,
    permisosVacaciones: 'Al corriente (0 pendientes)',
    herramientasEntregadas: 'Medidor pH/CE Hanna, Tensiómetro, Tableta rugerizada',
    estado: 'Activo'
  },
  {
    id: 'EMP-02',
    nombre: 'Don Juan Bautista',
    puesto: 'Cuadrilla de Corte',
    equipoCuadrilla: 'Cuadrilla Norte',
    moduloAsignado: 'Módulo 1 - Alta Densidad',
    salarioBaseSemanal: 2300,
    bonoProductividad: 550,
    asistenciaDias: 6,
    permisosVacaciones: 'Vacaciones programadas Dic 2026',
    herramientasEntregadas: 'Tijeras Felco 2, Cinturón portalatas, Guantes cuero especial',
    estado: 'Activo'
  },
  {
    id: 'EMP-03',
    nombre: 'María Ramos',
    puesto: 'Clasificador Poscosecha',
    equipoCuadrilla: 'Equipo Sala de Empaque',
    moduloAsignado: 'Nave de Poscosecha',
    salarioBaseSemanal: 2200,
    bonoProductividad: 400,
    asistenciaDias: 6,
    permisosVacaciones: 'Sin solicitudes',
    herramientasEntregadas: 'Regla clasificadora de tallos, delantal térmico, cuchilla encintadora',
    estado: 'Activo'
  }
];

export const INITIAL_HARVEST: HarvestRecord[] = [
  {
    id: 'HARV-501',
    codigoLote: 'LOT-FRE-261025',
    fecha: '2026-10-25',
    modulo: 'Módulo 1 - Alta Densidad',
    variedad: 'Rosa Freedom (Roja)',
    tallosCortados: 6250,
    personalCorte: 'Cuadrilla Don Juan (4 cosecheros)',
    longitudCm: '60 cm',
    calidad: 'Exportación',
    paquetes25: 250,
    mermaTallos: 125,
    mermaCausa: 'Tallo torcido y botón asimétrico',
    tratamientoHidratacion: 'Solución STS + Chrysal',
    temperaturaCamaraC: 2.4,
    humedadCamaraPorc: 88,
    estadoLote: 'Listo Despacho'
  },
  {
    id: 'HARV-502',
    codigoLote: 'LOT-MON-261024',
    fecha: '2026-10-24',
    modulo: 'Módulo 2 - Exportación',
    variedad: 'Rosa Mondial (Blanca)',
    tallosCortados: 4500,
    personalCorte: 'Cuadrilla Sur (3 cosecheros)',
    longitudCm: '70 cm',
    calidad: 'Exportación',
    paquetes25: 180,
    mermaTallos: 80,
    mermaCausa: 'Pétalo externo con roce mecánico',
    tratamientoHidratacion: 'Solución STS + Chrysal',
    temperaturaCamaraC: 2.1,
    humedadCamaraPorc: 90,
    estadoLote: 'Cámara Fría'
  }
];

export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'SALE-701',
    fecha: '2026-10-25',
    cliente: 'Florícola Continental Express Inc.',
    mercado: 'Exportación Miami',
    variedad: 'Rosa Freedom 60cm',
    clasificacion: 'Exportación Grado A',
    paquetesVendidos: 200,
    precioPorPaquete: 220.00,
    totalVenta: 44000.00,
    tipoPago: 'Transferencia',
    estadoCobro: 'Cobrado',
    campanaEspecial: 'Semana Regular'
  },
  {
    id: 'SALE-702',
    fecha: '2026-10-24',
    cliente: 'Distribuidora Floral del Centro',
    mercado: 'Central de Abasto',
    variedad: 'Rosa Mondial 70cm',
    clasificacion: 'Nacional Grado 1',
    paquetesVendidos: 150,
    precioPorPaquete: 185.00,
    totalVenta: 27750.00,
    tipoPago: 'Crédito 15 días',
    estadoCobro: 'Pendiente',
    fechaVencimiento: '2026-11-08',
    campanaEspecial: 'Semana Regular'
  }
];

export const INITIAL_WAREHOUSE: WarehouseItem[] = [
  {
    id: 'INV-01',
    codigo: 'FERT-NC-01',
    nombre: 'Nitrato de Calcio Grado Invernadero',
    categoria: 'Fertilizantes',
    unidadMedida: 'Saco 25kg',
    stockActual: 48,
    stockMinimo: 15,
    almacenUbicacion: 'Caseta de Riego',
    proveedorHabitual: 'Yara México / Agroinsumos del Valle',
    costoUnitario: 520.00,
    loteCaducidad: '2027-12-31',
    estadoReposicion: 'Óptimo'
  },
  {
    id: 'INV-02',
    codigo: 'EMP-LIG-25',
    nombre: 'Ligas de Caucho y Mallas Protectoras de Botón',
    categoria: 'Material de Empaque',
    unidadMedida: 'Paquete 1000 pzas',
    stockActual: 6,
    stockMinimo: 10,
    almacenUbicacion: 'Empaque',
    proveedorHabitual: 'Empaques y Plásticos Florales',
    costoUnitario: 340.00,
    estadoReposicion: 'Alerta Reposición'
  },
  {
    id: 'INV-03',
    codigo: 'QUIM-ABA-01',
    nombre: 'Abamectina 1.8% CE (Acaricida)',
    categoria: 'Fitosanitarios',
    unidadMedida: 'Litro',
    stockActual: 12,
    stockMinimo: 4,
    almacenUbicacion: 'Bodega Químicos',
    proveedorHabitual: 'Syngenta / Distribuciones Agrícolas',
    costoUnitario: 780.00,
    loteCaducidad: '2027-08-15',
    estadoReposicion: 'Óptimo'
  }
];

export const INITIAL_FINANCE: FinanceRecord[] = [
  {
    id: 'FIN-01',
    fecha: '2026-10-25',
    tipo: 'Ingreso Operativo',
    categoria: 'Venta de Flor',
    cuentaBancaria: 'BBVA Finca Flores',
    monto: 44000.00,
    concepto: 'Cobro factura #1042 Florícola Continental Express Inc.',
    conciliado: true
  },
  {
    id: 'FIN-02',
    fecha: '2026-10-24',
    tipo: 'Egreso Finca',
    categoria: 'Fertilizantes y Químicos',
    cuentaBancaria: 'Santander Operaciones',
    monto: 15600.00,
    concepto: 'Compra 30 sacos Nitrato de Calcio y Quelato Hierro',
    conciliado: true
  },
  {
    id: 'FIN-03',
    fecha: '2026-10-23',
    tipo: 'Gasto Personal (Excluido Finca)',
    categoria: 'Retiro de Socio',
    cuentaBancaria: 'Caja Chica Efectivo',
    monto: 3500.00,
    concepto: 'Retiro personal cuenta particular (auditado separado de finca)',
    conciliado: true
  }
];

export const INITIAL_COSTS: CostRecord[] = [
  {
    id: 'COST-01',
    modulo: 'Módulo 1 - Alta Densidad (Freedom)',
    variedad: 'Rosa Freedom',
    periodoMes: 'Octubre 2026',
    costoManoObra: 18500,
    costoAguaEnergia: 6200,
    costoInsumos: 14800,
    costoFijoIndirecto: 7500,
    totalCosto: 47000,
    tallosProducidos: 26000,
    costoPorTallo: 1.80,
    costoPorPaquete: 45.00,
    precioPromedioVentaPaquete: 210.00,
    margenContribucionPorc: 78.5
  },
  {
    id: 'COST-02',
    modulo: 'Módulo 2 - Exportación (Mondial)',
    variedad: 'Rosa Mondial',
    periodoMes: 'Octubre 2026',
    costoManoObra: 16200,
    costoAguaEnergia: 5800,
    costoInsumos: 13900,
    costoFijoIndirecto: 7200,
    totalCosto: 43100,
    tallosProducidos: 22000,
    costoPorTallo: 1.95,
    costoPorPaquete: 48.75,
    precioPromedioVentaPaquete: 200.00,
    margenContribucionPorc: 75.6
  }
];

export const INITIAL_ASSETS: AssetRecord[] = [
  {
    id: 'ACT-01',
    codigo: 'INV-NAVE-01',
    nombre: 'Invernadero Multitúnel Gótico 5,000 m² con Ventilación Cenital',
    tipo: 'Invernadero / Nave',
    tenencia: 'Propio',
    valorAdquisicion: 1450000,
    fechaAdquisicion: '2022-04-10',
    vidaUtilAnos: 15,
    proximoMantenimiento: '2026-11-15',
    estadoOperativo: 'Excelente',
    bitacoraNotas: 'Plástico térmico tricapa cambiado hace 14 meses'
  },
  {
    id: 'ACT-02',
    codigo: 'CAM-FRIO-01',
    nombre: 'Cámara Fría de Conservación 80m³ con Unidad Bohn 5HP R404A',
    tipo: 'Cámara Fría',
    tenencia: 'Propio',
    valorAdquisicion: 380000,
    fechaAdquisicion: '2023-01-20',
    vidaUtilAnos: 10,
    proximoMantenimiento: '2026-11-01',
    estadoOperativo: 'Excelente',
    bitacoraNotas: 'Descongelación programada cada 6 horas; sensor calibrado a 2°C'
  },
  {
    id: 'ACT-03',
    codigo: 'RIEGO-CAB-01',
    nombre: 'Cabezal de Fertirriego Automatizado con 3 Inyectores Venturi y Filtro Malla',
    tipo: 'Sistema Fertirriego / Bombeo',
    tenencia: 'Propio',
    valorAdquisicion: 210000,
    fechaAdquisicion: '2023-08-15',
    vidaUtilAnos: 8,
    proximoMantenimiento: '2026-10-30',
    estadoOperativo: 'Requiere Mantenimiento',
    bitacoraNotas: 'Limpieza programada de solenoides y sustitución de juntas tóricas'
  }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-10-25 08:30:12',
    usuario: 'Administrador General',
    modulo: '06. Cosecha y Poscosecha',
    accion: 'Creación',
    detalle: 'Registro de lote LOT-FRE-261025 con 6,250 tallos cosechados'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-10-25 09:15:40',
    usuario: 'Ing. Carlos Mendoza',
    modulo: '03. Riego y Fertirrigación',
    accion: 'Creación',
    detalle: 'Registro de riego Sector 1 (pH 5.85, CE 1.65 mS/cm)'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-10-25 11:00:25',
    usuario: 'Ventas y Despacho',
    modulo: '07. Ventas y Clientes',
    accion: 'Creación',
    detalle: 'Nota de venta #701 para Florícola Continental Express ($44,000.00)'
  }
];
