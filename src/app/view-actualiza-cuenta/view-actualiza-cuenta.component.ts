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

  tokenUrl = "";
  cuentaEnCeros = false;
  value_alias = "";
  value_disponible = "";
  value_divisa = "";
  value_numCuenta = "";
  value_numCuentaRaw = "";
  value_cuentaMovil = "";
  ctaSantanderPlus = "";

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
    this.route.queryParams
    .subscribe(params => {
      this.tokenUrl = params.token

      // localStorage.setItem('backButton', "true");
      if(localStorage.getItem('backButton') !== undefined && localStorage.getItem('backButton') !== null){
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
    });
  }

  reloadData(){
    localStorage.clear();
    // SE OBTIENE EL TOKEN PARA SINGLE SIGN ON
    if(this.tokenUrl !== ""){
      localStorage.setItem('tokenUrl', this.tokenUrl);
    }
  }


  ngOnInit() {
    this.stepMan.sendMessage(1,"Seleccione la cuenta a inscribir");

    // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
    this.spinnerMng.showSpinner(true);
    this.loginServices.getConfig()
    .subscribe(
      res => {
        localStorage.setItem('env', res.ENV_VAR);
        this.startServices();
      },
      err => {
        localStorage.setItem('env', 'pre');
        this.startServices();
        // this.loadMock()
      }
    )
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
                if(res.stokenValidatorResponse.codigoMensaje == "TVT_000"){
                  var mToken = {"sessionId": "", "telefono":""}
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
                if(cta.numeroCuenta == localStorage.getItem('ctaSantanderPlus')){

                  if(cta.alias == ""){
                    this.value_alias = cta.tipoProducto;
                  } else {
                    this.value_alias = cta.alias;
                  }
                  this.value_disponible = cta.disponible;
                  this.value_divisa = cta.divisa;
                  let accountLenght = cta.numeroCuenta.length;
                  this.value_numCuenta = cta.numeroCuenta.substr(0,2) + "**" + cta.numeroCuenta.substr(accountLenght-4,accountLenght);
                  this.value_cuentaMovil = cta.cuentaMovil;
                  localStorage.setItem("cardAliasSP", this.value_alias);
                  localStorage.setItem("cardDisponibleSP", this.value_disponible);
                  localStorage.setItem("cardDivisaSP", this.value_divisa);
                  localStorage.setItem("cardNumeroCuentaSP", this.value_numCuenta);
                  localStorage.setItem("cardCuentaMovilSP", this.value_cuentaMovil);

                  this.cuentaEnCeros = parseFloat(this.value_disponible.replace(",","")) <= 0 ? true : false;
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
        if(err.error.clave == "SAN123-NOINSCRITO"){
          this.errorService("Error", err.error.message, "Aceptar", "", 0); //1
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
        }
      },
      err => {
        this.errorService("Error", err.error.message, "Aceptar", "", 0);
      }
    )


    // SERVICIO DE SALDOS
    this.loginServices.getSaldosSPMock()
    .subscribe(
      res => {
        // SE LLENAN LOS CARDS
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.messageMan.sendMessage(res);

        this.value_alias = localStorage.getItem("cardAliasSP");
        this.value_disponible = localStorage.getItem("cardDisponibleSP");
        this.value_divisa = localStorage.getItem("cardDivisaSP");
        this.value_numCuenta = localStorage.getItem("cardNumeroCuentaSP");
        this.value_cuentaMovil = localStorage.getItem("cardCuentaMovilSP");
        this.cuentaEnCeros = parseFloat(localStorage.getItem("cardDisponibleSP").replace(",","")) <= 0 ? true : false;
      },
      err => {
        this.errorService("Error",err.error.message, "Aceptar", "", 0);
      }
    )
  }

  continuar() {
    this.router.navigate(['/confirma']);
  }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
