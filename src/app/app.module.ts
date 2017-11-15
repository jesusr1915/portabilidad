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

//Routing
import { routing } from './app.routes';
import { ViewVerifiqueComponent } from './view-verifique/view-verifique.component';
import { SpinnerComponentComponent } from './spinner-component/spinner-component.component';


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
    SpinnerComponentComponent
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
    SpinnerMan
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
