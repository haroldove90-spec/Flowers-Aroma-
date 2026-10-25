import React from 'react';
import { useApp } from '../context/AppContext';
import { UnidadesProduccionModule } from './modules/UnidadesProduccionModule';
import { ProduccionLaboresModule } from './modules/ProduccionLaboresModule';
import { RiegoFertirrigacionModule } from './modules/RiegoFertirrigacionModule';
import { SanidadVegetalModule } from './modules/SanidadVegetalModule';
import { PersonalRRHHModule } from './modules/PersonalRRHHModule';
import { CosechaPoscosechaModule } from './modules/CosechaPoscosechaModule';
import { VentasClientesModule } from './modules/VentasClientesModule';
import { ComprasAlmacenModule } from './modules/ComprasAlmacenModule';
import { FinanzasDeudasModule } from './modules/FinanzasDeudasModule';
import { CostosRentabilidadModule } from './modules/CostosRentabilidadModule';
import { ActivosMantenimientoModule } from './modules/ActivosMantenimientoModule';
import { ReportesAdminModule } from './modules/ReportesAdminModule';

export const ModuleRenderer: React.FC = () => {
  const { activeModule } = useApp();

  switch (activeModule) {
    case 1:
      return <UnidadesProduccionModule />;
    case 2:
      return <ProduccionLaboresModule />;
    case 3:
      return <RiegoFertirrigacionModule />;
    case 4:
      return <SanidadVegetalModule />;
    case 5:
      return <PersonalRRHHModule />;
    case 6:
      return <CosechaPoscosechaModule />;
    case 7:
      return <VentasClientesModule />;
    case 8:
      return <ComprasAlmacenModule />;
    case 9:
      return <FinanzasDeudasModule />;
    case 10:
      return <CostosRentabilidadModule />;
    case 11:
      return <ActivosMantenimientoModule />;
    case 12:
      return <ReportesAdminModule />;
    default:
      return <UnidadesProduccionModule />;
  }
};
