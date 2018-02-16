import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../services/loginServices'
import { CopiesService } from '../services/copiesService';
import { seleccion_cuenta_class, terminos_class } from 'interfaces/copiesInterface';
import { NgModel } from '@angular/forms';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';

import { MessageMan } from '../cards/messageMan';
import { StepMan } from '../stepper/stepMan';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { InfoCardMan } from '../personal-card/infoCardMng';

import { Subscription } from 'rxjs/Subscription';
import {TermMan} from '../terms/termMng';

import { SpinnerMan } from '../spinner-component/spinnerMng';

@Component({
  selector: 'app-view-actualiza-cuenta',
  templateUrl: './view-actualiza-cuenta.component.html',
  styleUrls: ['./view-actualiza-cuenta.component.scss',
              '../app.component.scss']
})
export class ViewActualizaCuentaComponent implements OnInit {

  constructor(
    private loginServices: LoginService,
    private messageMan: MessageMan,
    private stepMan: StepMan,
    private copiesServ: CopiesService,
    private alertMan: AlertMan,
    private infoCardMng: InfoCardMan,
    private router: Router,
    private termsMng: TermMan,
    private route: ActivatedRoute,
    public spinnerMng : SpinnerMan
  ) { }

  tokenUrl = "";

  ngOnInit() {
    this.stepMan.sendMessage(1,"Seleccione la cuenta a inscribir");

    // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
    this.spinnerMng.showSpinner(true);
    this.loginServices.getConfig()
    .subscribe(
      res => {
        localStorage.setItem('env', res.ENV_VAR);
        // this.startServices();
      },
      err => {
        localStorage.setItem('env', 'pre');
        // this.startServices();
        this.loadMock()
      }
    )
  }

  private startServices(){
    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {
        // SE EJECUTA LA PRIMERA VEZ PARA OBTENER EL SESSION ID DEL TOKEN SSO
        if(localStorage.getItem('sessionID') === "" || localStorage.getItem('sessionID') === undefined || localStorage.getItem('sessionID') === null){
          // SERVICIO DE VALIDADOR DE TOKEN
          this.loginServices.postValidator(this.tokenUrl)
          .subscribe(
            res => {
              // VALIDADOR DE RESPUESTA DE TOKEN
              if(res.stokenValidatorResponse.codigoMensaje == "TVT_000"){
                  let mToken = JSON.parse(decodeURIComponent(decodeURIComponent(res.stokenValidatorResponse.pAdicional)));
                  localStorage.setItem('sessionID',mToken.sessionId.substring(11));
                  // SE EJECUTAN LOS SERVICIOS DE CARGA
                  this.loadInfo();
              } else {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.errorService("Error", res.stokenValidatorResponse.mensaje, "", "", 0);
              }
              // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN
            },
            err => {
              this.spinnerMng.showSpinner(false); // CIERRA LOADER
              this.errorService("Error", err.stokenValidatorResponse.mensaje, "", "", 0);
            }
          );
        } else {
          // YA TIENE SESION ID, SE EJECUTAN LOS SERVICIOS DE CARGA
          this.spinnerMng.showSpinner(false); // CIERRA LOADER
          this.loadInfo();
        }
      },
      err => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.errorService("Error", err.stokenValidatorResponse.mensaje, "", "", 0);
      }
    )
  }

  private loadInfo(){
    // SERVICIO DE SALDOS
    this.loginServices.postSaldosSP()
    .subscribe(
      res => {
        // SE LLENAN LOS CARDS
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.messageMan.sendMessage(res);
      },
      err => {
        this.errorService("Error",err.error.message, "Aceptar", "", 0);
      }
    )
  }

  private loadMock(){
    // SERVICIO DE SALDOS
    this.loginServices.getSaldosSPMock()
    .subscribe(
      res => {
        // SE LLENAN LOS CARDS
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.messageMan.sendMessage(res);
      },
      err => {
        this.errorService("Error",err.error.message, "Aceptar", "", 0);
      }
    )
  }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
