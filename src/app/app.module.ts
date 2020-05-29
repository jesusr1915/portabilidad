import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpModule } from "@angular/http";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { CardInfoComponent } from "./card-info/card-info.component";
import { CardsComponent } from "./cards/cards.component";
import { PersonalCardComponent } from "./personal-card/personal-card.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TermsComponent } from "./terms/terms.component";
import { ViewAltaClienteComponent } from "./view-alta-cliente/view-alta-cliente.component";
import { MessageAlertComponent } from "./message-alert/message-alert.component";

//services
import { MainService } from "./services/main.service";
import { LoginService } from "./services/loginServices";
import { CopiesService } from "./services/copiesService";
import { AppLoadService } from "./services/app-load.service";
import { MessageService } from "./services/message.service";
import { StepperComponent } from "./stepper/stepper.component";
import { WKWebViewService } from "./services/wkWebViewServices";
import { AnalyticsService } from "./services/analytics.service";

//manager RX
import { MessageMan } from "./cards/messageMan";
import { StepMan } from "./stepper/stepMan";
import { AlertMan } from "./message-alert/alertMan";
import { InfoCardMan } from "./personal-card/infoCardMng";
import { SpinnerMan } from "./spinner-component/spinnerMng";
import { TermMan } from "./terms/termMng";
import { TokenMng } from "./token/tokenMng";
import { MenuMsg } from "./menu/menuMsg";

//Routing
import { routing } from "./app.routes";
import { ViewAltaVerifiqueComponent } from "./view-alta-verifique/view-alta-verifique.component";
import { SpinnerComponentComponent } from "./spinner-component/spinner-component.component";
import { TokenComponent } from "./token/token.component";
import { ViewAltaStatusComponent } from "./view-alta-status/view-alta-status.component";
import { ViewConsultaComponent } from "./view-consulta/view-consulta.component";
import { MenuComponent } from "./menu/menu.component";
import { MovesComponent } from "./moves/moves.component";
import { ViewDetalleSolicitudComponent } from "./view-detalle-solicitud/view-detalle-solicitud.component";
import { ViewTempIndexComponent } from "./view-temp-index/view-temp-index.component";
import { LoginComponent } from "./login/login.component";
import { ViewCuentaInscripcionComponent } from "./view-cuenta-inscripcion/view-cuenta-inscripcion.component";
import { ViewCuentaSeleccionadaComponent } from "./view-cuenta-seleccionada/view-cuenta-seleccionada.component";
import { ViewCuentaResumenComponent } from "./view-cuenta-resumen/view-cuenta-resumen.component";
import { ViewActualizaCuentaComponent } from "./view-actualiza-cuenta/view-actualiza-cuenta.component";
import { ViewActualizaResumenComponent } from "./view-actualiza-resumen/view-actualiza-resumen.component";
import { ViewActualizaConfirmaComponent } from "./view-actualiza-confirma/view-actualiza-confirma.component";
import { ViewCuentaBienvenidaComponent } from "./view-cuenta-bienvenida/view-cuenta-bienvenida.component";
import { ViewAltaOtpComponent } from "./view-alta-otp/view-alta-otp.component";
import { AlertCommonComponent } from "./alert-common/alert-common.component";
import { ValidaComponent } from "./cancelacion/valida/valida.component";
import { ResumenComponent } from "./cancelacion/resumen/resumen.component";
import { OtpComponent } from "./cancelacion/otp/otp.component";

export function get_settings(appLoadService: AppLoadService) {
  return () => appLoadService.getSettings();
}

@NgModule({
  declarations: [
    AppComponent,
    CardInfoComponent,
    CardsComponent,
    PersonalCardComponent,
    StepperComponent,
    TermsComponent,
    ViewAltaClienteComponent,
    ViewAltaVerifiqueComponent,
    MessageAlertComponent,
    SpinnerComponentComponent,
    TokenComponent,
    ViewAltaStatusComponent,
    ViewConsultaComponent,
    MenuComponent,
    MovesComponent,
    ViewDetalleSolicitudComponent,
    ViewTempIndexComponent,
    LoginComponent,
    ViewCuentaInscripcionComponent,
    ViewCuentaSeleccionadaComponent,
    ViewCuentaResumenComponent,
    ViewActualizaCuentaComponent,
    ViewActualizaResumenComponent,
    ViewActualizaConfirmaComponent,
    ViewCuentaBienvenidaComponent,
    ViewAltaOtpComponent,
    AlertCommonComponent,
    ValidaComponent,
    ResumenComponent,
    OtpComponent,
  ],
  imports: [BrowserModule, HttpModule, HttpClientModule, FormsModule, routing],
  providers: [
    MainService,
    AnalyticsService,
    LoginService,
    MessageMan,
    CopiesService,
    StepMan,
    AlertMan,
    InfoCardMan,
    SpinnerMan,
    TermMan,
    TokenMng,
    AppLoadService,
    MenuMsg,
    MessageService,
    WKWebViewService,
    {
      provide: APP_INITIALIZER,
      useFactory: get_settings,
      deps: [AppLoadService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
