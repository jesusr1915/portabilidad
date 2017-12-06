import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewDatosClienteComponent } from './view-datos-cliente/view-datos-cliente.component';
import { ViewVerifiqueComponent } from './view-verifique/view-verifique.component';
import { ViewStatusComponent } from './view-status/view-status.component';
import { ViewConsultaComponent } from './view-consulta/view-consulta.component';
// Route Configuration
export const routes: Routes = [
  {
    path: '',
    component: ViewDatosClienteComponent,
    pathMatch: 'full'
  },
  {
    path: 'verifica',
    component: ViewVerifiqueComponent,
    pathMatch: 'full'
  },
  {
    path: 'status',
    component: ViewStatusComponent,
    pathMatch: 'full'
  },
  {
    path: 'consulta',
    component: ViewConsultaComponent,
    pathMatch: 'full'
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
