import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../services/loginServices'
import { CopiesService } from '../services/copiesService';
import { SeleccionCuentaClass, TerminosClass } from 'interfaces/copiesInterface';
import { NgModel } from '@angular/forms';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';

import { MessageMan } from '../cards/messageMan';
import { StepMan } from '../stepper/stepMan';
import { AlertMan , MessageAlert } from '../message-alert/alertMan';
import { InfoCardMan } from '../personal-card/infoCardMng';

import { Subscription } from 'rxjs/Subscription';
import {TermMan} from '../terms/termMng';

import { SpinnerMan } from '../spinner-component/spinnerMng';
import { PageTrack } from '../decorators/page-track.decorator';
declare function getSSO(): any;
@PageTrack('portabilidad-actualiza-cuenta')
@Component({
  selector: 'app-view-actualiza-cuenta',
  templateUrl: './view-actualiza-cuenta.component.html',
  styleUrls: ['./view-actualiza-cuenta.component.scss',
              '../app.component.scss']
})
export class ViewActualizaCuentaComponent implements OnInit {

  tokenUrl = "";
  cuentaEnCeros = false;
  valueAlias = "";
  valueDisponible = "";
  valueDivisa = "";
  valueNumCuenta = "";
  valueNumCuentaRaw = "";
  valueCuentaMovil = "";
  valueSelected = true;
  valueSp = true;
  ctaSantanderPlus = "";
  subscriptionM: Subscription;

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
  ) {
    // RECIBE PARAMETROS POR URL CON QUERY

    let tokenSSO = null;
    try { tokenSSO = getSSO(); } catch (err) { }
    this.tokenUrl = tokenSSO ? decodeURIComponent(tokenSSO) : this.route.snapshot.queryParamMap.get('token');
    if(this.tokenUrl) {
      localStorage.setItem('backButton', "true");
      if (localStorage.getItem('backButton') !== undefined && localStorage.getItem('backButton') !== null){
        if(localStorage.getItem('backButton') !== "true"){
          this.reloadData();
        } else {
          // PARA RECUPERAR LOS DATOS DE LA PANTALLA
          localStorage.setItem('fillData','true');
          localStorage.removeItem('backButton');
        }
      } else {
        this.reloadData();
      }
    }
    // this.route.queryParams
    // .subscribe(params => {
    //   this.tokenUrl = params.token

    //   // localStorage.setItem('backButton', "true");
    //   if(localStorage.getItem('backButton') !== undefined && localStorage.getItem('backButton') !== null){
    //     if(localStorage.getItem('backButton') !== "true"){
    //       this.reloadData();
    //     } else {
    //       // PARA RECUPERAR LOS DATOS DE LA PANTALLA
    //       localStorage.setItem('fillData','true');
    //       localStorage.removeItem('backButton');
    //     }
    //   } else {
    //     this.reloadData();
    //   }
    // });

    this.subscriptionM = this.alertMan.getMessage()
    .subscribe(
      message => {
        if(message.title === "done"){
          this.startServices();
          // this.loadMock()
        }
      }
    )

  }

  ngOnInit() {
    this.stepMan.sendMessage(1,"Seleccione la cuenta a inscribir");
    this.loadConfig();
    this.errorService("", "Usted está iniciando el proceso de cambio de cuenta inscrita a Santander Plus. Esta opción le permitirá recibir los beneficios de Santander Plus en una cuenta diferente a la seleccionada en el proceso de inscripción. <br/><br/> Por favor cualquier duda o aclaración comuníquese a la línea de Santander Plus al 01800 0101123.", "Aceptar", "", 3);
  }

  loadConfig(){
    // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
    this.spinnerMng.showSpinner(true);
    // console.log("LOAD CONFIG");
    this.loginServices.getConfig()
    .subscribe(
      res => {
        localStorage.setItem('env', res.ENV_VAR);
        localStorage.setItem('dom', res.ENV_DOM);
        if(res.ENV_LOG === "false"){
          console.log = function() {};
        }
        // this.startServices();
      },
      err => {
        localStorage.setItem('env', 'pre');
        localStorage.setItem('dom', 'corp');
        // this.startServices();
      }
    )
  }

  reloadData(){
    localStorage.clear();
    // SE OBTIENE EL TOKEN PARA SINGLE SIGN ON
    if(this.tokenUrl !== ""){
      localStorage.setItem('tokenUrl', this.tokenUrl);
    }
  }


  private startServices(){
    this.spinnerMng.showSpinner(true);
    // SERVICIO QUE OBTIENE EL TOKEN OATUH PARA CONSUMIR SERVICIOS
    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {
          // SE EJECUTA LA PRIMERA VEZ PARA OBTENER EL SESSION ID DEL TOKEN SSO
          if(localStorage.getItem('sessionID') === "" || localStorage.getItem('sessionID') === undefined || localStorage.getItem('sessionID') === null){
          // console.log("TOKEN VALIDATOR")
            // SERVICIO DE VALIDADOR DE TOKEN
            this.loginServices.postValidator(this.tokenUrl)
            .subscribe(
              res => {
                // VALIDADOR DE RESPUESTA DE TOKEN
                if(res.stokenValidatorResponse.codigoMensaje === "TVT_000"){
                  let mToken = {"sessionId": "", "telefono":""}
                  let pAdicional: any

                  if(res.stokenValidatorResponse.PAdicional){
                    pAdicional = JSON.parse(decodeURIComponent(decodeURIComponent(res.stokenValidatorResponse.PAdicional)));
                  } else if(res.stokenValidatorResponse.pAdicional){
                    pAdicional = JSON.parse(decodeURIComponent(decodeURIComponent(res.stokenValidatorResponse.pAdicional)));
                  }

                  mToken = pAdicional;
                  localStorage.setItem('sessionID', mToken.sessionId.substring(11));
                  // SE EJECUTAN LOS SERVICIOS DE CARGA
                  this.loadInfo();
                } else {
                  this.spinnerMng.showSpinner(false); // CIERRA LOADER
                  this.errorService("Error",res.stokenValidatorResponse.mensaje,"","",0);
                }
                // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN
              },
              err => {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.errorService("Error", "", "", "", 0);
              }
            );
          } else {
            // SE EJECUTAN LOS SERVICIOS DE CARGA
            this.loadInfo();
          }
      },
      err => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.errorService("Error", "", "", "", 0);
      }
    )
  }

  private loadInfo(){

    this.loginServices.postModificaSP()
    .subscribe(
      res => {
        if(res.dto.isSantanderPlus){
          // this.ctaSantanderPlus = res.dto.cuenta;
          localStorage.setItem('isSantanderPlus', 'true');
          localStorage.setItem('ctaSantanderPlus', res.dto.cuenta)

          // BUSCA CUENTA EN EL SERVICIO DE SALDOS CUENTA
          this.loginServices.getSaldos()
          .subscribe(
            res => {
              for(let cta of res.dto.saldoPesos){
                if(cta.numeroCuenta === localStorage.getItem('ctaSantanderPlus')){

                  if(cta.alias === ""){
                    this.valueAlias = cta.tipoProducto;
                  } else {
                    this.valueAlias = cta.alias;
                  }
                  this.valueDisponible = cta.disponible;
                  this.valueDivisa = cta.divisa;
                  let accountLenght = cta.numeroCuenta.length;
                  this.valueNumCuenta = cta.numeroCuenta.substr(0,2) + "**" + cta.numeroCuenta.substr(accountLenght-4,accountLenght);
                  this.valueCuentaMovil = cta.cuentaMovil;
                  localStorage.setItem("cardAliasSP", this.valueAlias);
                  localStorage.setItem("cardDisponibleSP", this.valueDisponible);
                  localStorage.setItem("cardDivisaSP", this.valueDivisa);
                  localStorage.setItem("cardNumeroCuentaSP", this.valueNumCuenta);
                  localStorage.setItem("cardCuentaMovilSP", this.valueCuentaMovil);

                  this.cuentaEnCeros = parseFloat(this.valueDisponible.replace(",","")) <= 0 ? true : false;
                }
              }
            },
            err => {
              this.errorService("Error", err.error.message, "Aceptar", "", 0);
            }
          )
        }
      },
      err => {
        if(err.error.clave === "SAN123-NOINSCRITO"){
          this.errorService("", err.error.message, "Aceptar", "", 1); //1
        } else {
          this.errorService("Error", err.error.message, "Aceptar", "", 0);
        }
      }
    )

    // SERVICIO DE SALDOS SP
    this.loginServices.getSaldosSP()
    .subscribe(
      res => {
        // SE QUITA LA CUENTA ACTUAL DEL CARRUSEL
        let temp = {"dto": { "saldoPesos": []}};
        for(let cta of res.dto.saldoPesos){
          if(cta.numeroCuenta !== localStorage.getItem('ctaSantanderPlus')){
            temp.dto.saldoPesos.push(cta);
          }
        }
        // SE LLENAN LOS CARDS
        this.messageMan.sendMessage(temp);
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
      },
      err => {
        this.errorService("Error", err.error.message, "Aceptar", "", 0);
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
      }
    )
  }

  private loadMock(){

    this.loginServices.getModificaSPMock()
    .subscribe(
      res => {
        if(res.dto.isSantanderPlus){
          // this.ctaSantanderPlus = res.dto.cuenta;
          localStorage.setItem('isSantanderPlus', 'true');
          localStorage.setItem('ctaSantanderPlus', res.dto.cuenta)

          // BUSCA CUENTA EN EL SERVICIO DE SALDOS CUENTA
          this.loginServices.getSaldosMock()
          .subscribe(
            res => {
              for(let cta of res.dto.saldoPesos){
                if(cta.numeroCuenta === localStorage.getItem('ctaSantanderPlus')){

                  if(cta.alias === ""){
                    this.valueAlias = cta.tipoProducto;
                  } else {
                    this.valueAlias = cta.alias;
                  }
                  this.valueDisponible = cta.disponible;
                  this.valueDivisa = cta.divisa;
                  let accountLenght = cta.numeroCuenta.length;
                  this.valueNumCuenta = cta.numeroCuenta.substr(0,2) + "**" + cta.numeroCuenta.substr(accountLenght-4,accountLenght);
                  this.valueCuentaMovil = cta.cuentaMovil;
                  localStorage.setItem("cardAliasSP", this.valueAlias);
                  localStorage.setItem("cardDisponibleSP", this.valueDisponible);
                  localStorage.setItem("cardDivisaSP", this.valueDivisa);
                  localStorage.setItem("cardNumeroCuentaSP", this.valueNumCuenta);
                  localStorage.setItem("cardCuentaMovilSP", this.valueCuentaMovil);

                  this.cuentaEnCeros = parseFloat(this.valueDisponible.replace(",","")) <= 0 ? true : false;
                }
              }
            },
            err => {
              this.errorService("Error", err.error.message, "Aceptar", "", 0);
            }
          )
        }
      },
      err => {
        this.errorService("Error", err.error.message, "Aceptar", "", 0);
      }
    )

    this.loginServices.getSaldosMock()


    // SERVICIO DE SALDOS
    this.loginServices.getSaldosSPMock()
    .subscribe(
      res => {
        // SE QUITA LA CUENTA ACTUAL DEL CARRUSEL
        let temp = {"dto": { "saldoPesos": []}};
        for(let cta of res.dto.saldoPesos){
          if(cta.numeroCuenta !== localStorage.getItem('ctaSantanderPlus')){
            temp.dto.saldoPesos.push(cta);
          }
        }
        // SE LLENAN LOS CARDS
        this.messageMan.sendMessage(temp);
        this.spinnerMng.showSpinner(false); // CIERRA LOADER

        this.valueAlias = localStorage.getItem("cardAliasSP");
        this.valueDisponible = localStorage.getItem("cardDisponibleSP");
        this.valueDivisa = localStorage.getItem("cardDivisaSP");
        this.valueNumCuenta = localStorage.getItem("cardNumeroCuentaSP");
        this.valueCuentaMovil = localStorage.getItem("cardCuentaMovilSP");
        this.cuentaEnCeros = parseFloat(localStorage.getItem("cardDisponibleSP").replace(",","")) <= 0 ? true : false;
        this.valueSelected = true;
        this.valueSp = true;
      },
      err => {
        this.errorService("Error", err.error.message, "Aceptar", "", 0);
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
      }
    )
  }

  continuar() {
    this.router.navigate(['/confirma']);
  }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    let message = new MessageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
