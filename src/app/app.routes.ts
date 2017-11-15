import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewDatosClienteComponent } from './view-datos-cliente/view-datos-cliente.component';
import { ViewVerifiqueComponent } from './view-verifique/view-verifique.component';
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
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
