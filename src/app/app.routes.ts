import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewDatosClienteComponent } from './view-datos-cliente/view-datos-cliente.component';
import { ViewVerifiqueComponent } from './view-verifique/view-verifique.component';
import { ViewStatusComponent } from './view-status/view-status.component';
import { ViewConsultaComponent } from './view-consulta/view-consulta.component';
import { ViewDetalleSolicitudComponent } from './view-detalle-solicitud/view-detalle-solicitud.component'

import { ViewInscripcionComponent } from './view-inscripcion/view-inscripcion.component'
import { LoginComponent } from './login/login.component'
import { ViewTempIndexComponent } from './view-temp-index/view-temp-index.component'
import { ViewCuentaInscripcionComponent } from './view-cuenta-inscripcion/view-cuenta-inscripcion.component'
import { ViewCuentaSeleccionadaComponent } from './view-cuenta-seleccionada/view-cuenta-seleccionada.component';
import { ViewCuentaResumenComponent } from './view-cuenta-resumen/view-cuenta-resumen.component';


// Route Configuration
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
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
  },
  {
    path: 'detalleConsulta',
    component: ViewDetalleSolicitudComponent,
    pathMatch: 'full'
  },
  {
    path: 'sesion',
    component: ViewTempIndexComponent,
    pathMatch: 'full'
  },
  {
    path: 'cliente',
    component: ViewDatosClienteComponent,
    pathMatch: 'full'
  },
  {
    path: 'inscripcion',
    component: ViewInscripcionComponent,
    pathMatch: 'full'
  }, // EMPIEZAN LAS PAGINAS DE INSCRIPCION
  {
    path: 'cuenta',
    component: ViewCuentaInscripcionComponent,
    pathMatch: 'full'
  },
  {
    path: 'seleccion',
    component: ViewCuentaSeleccionadaComponent,
    pathMatch: 'full'
  },
  {
    path: 'resumen',
    component: ViewCuentaResumenComponent,
    pathMatch: 'full'
  },
  {
    // path: ':token',
    path: '',
    component: ViewDatosClienteComponent,
    pathMatch: 'full'
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
