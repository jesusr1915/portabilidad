import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { CardInfoComponent } from './card-info/card-info.component';
import { CardsComponent } from './cards/cards.component';
import { PersonalCardComponent } from './personal-card/personal-card.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsComponent } from './terms/terms.component';
import { ViewDatosClienteComponent } from './view-datos-cliente/view-datos-cliente.component';
import { MessageAlertComponent } from './message-alert/message-alert.component';

//services
import { LoginService } from './services/loginServices';
import { CopiesService } from './services/copiesService';
import { StepperComponent } from './stepper/stepper.component';

//manager RX
import { MessageMan } from './cards/messageMan';
import { StepMan } from './stepper/stepMan';
import { AlertMan } from './message-alert/alertMan';
import { InfoCardMan } from './personal-card/infoCardMng';
import { SpinnerMan } from './spinner-component/spinnerMng';
import { TermMan } from './terms/termMng';
import { TokenMng } from './token/tokenMng';
import { MenuMsg } from './menu/menuMsg';

//Routing
import { routing } from './app.routes';
import { ViewVerifiqueComponent } from './view-verifique/view-verifique.component';
import { SpinnerComponentComponent } from './spinner-component/spinner-component.component';
import { TokenComponent } from './token/token.component';
import { ViewStatusComponent } from './view-status/view-status.component';
import { ViewConsultaComponent } from './view-consulta/view-consulta.component';
import { MenuComponent } from './menu/menu.component';
import { MovesComponent } from './moves/moves.component';
import { ViewDetalleSolicitudComponent } from './view-detalle-solicitud/view-detalle-solicitud.component';
import { ViewTempIndexComponent } from './view-temp-index/view-temp-index.component';
import { ViewInscripcionComponent } from './view-inscripcion/view-inscripcion.component';
import { LoginComponent } from './login/login.component';
import { ViewCuentaInscripcionComponent } from './view-cuenta-inscripcion/view-cuenta-inscripcion.component';
import { ViewCuentaSeleccionadaComponent } from './view-cuenta-seleccionada/view-cuenta-seleccionada.component';
import { ViewCuentaResumenComponent } from './view-cuenta-resumen/view-cuenta-resumen.component';


@NgModule({
  declarations: [
    AppComponent,
    CardInfoComponent,
    CardsComponent,
    PersonalCardComponent,
    StepperComponent,
    TermsComponent,
    ViewDatosClienteComponent,
    ViewVerifiqueComponent,
    MessageAlertComponent,
    SpinnerComponentComponent,
    TokenComponent,
    ViewStatusComponent,
    ViewConsultaComponent,
    MenuComponent,
    MovesComponent,
    ViewDetalleSolicitudComponent,
    ViewTempIndexComponent,
    ViewInscripcionComponent,
    LoginComponent,
    ViewCuentaInscripcionComponent,
    ViewCuentaSeleccionadaComponent,
    ViewCuentaResumenComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing
  ],
  providers: [
    LoginService,
    MessageMan,
    CopiesService,
    StepMan,
    AlertMan,
    InfoCardMan,
    SpinnerMan,
    TermMan,
    TokenMng,
    MenuMsg
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
