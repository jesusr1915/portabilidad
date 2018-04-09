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
  selector: 'app-view-cuenta-inscripcion',
  templateUrl: './view-cuenta-inscripcion.component.html',
  styleUrls: ['./view-cuenta-inscripcion.component.scss',
              '../app.component.scss']
})
export class ViewCuentaInscripcionComponent implements OnInit {

    title = 'app';
    entry = "";
    copies : seleccion_cuenta_class = new seleccion_cuenta_class();
    terminosText : terminos_class = new terminos_class();
    classLabel = 'showLabel';
    inputCardInfo = "";
    selectedRadio = "";
    maxLength = "";
    tarjetValue = "";
    selectedBank = "";
    classEnaBank = "contentSelect minTop select-styled"
    classDisBank = "contentSelect minTop select-styled disabled"
    classSelBank = "";
    bankDisable = true;
    sendService = true;
    tipoCuenta = true;


    subscription: Subscription;

    //valid forms
    validClabe = false;
    validBank = true;
    validTerms = false;
    validAccount = true;

      lUsers: any[] = [
      ];
      lBanks: any[] = [
        { id: "0", Name: "Selecciona un banco" },
        //quitar con la red
        /*{ id: 1, Name: 'Bancomer' },
        { id: 2, Name: 'Santander'}*/
      ];

      curUser: any = this.lUsers[0];
      tokenUrl = "";
      tokenType = "";

    @Input() value_label_CLABE;
    @Input() value_placeholder_CLABE;

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
    ){
      // RECIBE PARAMETROS POR URL CON QUERY
      this.route.queryParams
      .subscribe(params => {
        // SE LEE EL TOKEN DE LA URL
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

        // SE OBTIENE EL TOKEN PARA SINGLE SIGN ON
        if(this.tokenUrl != ""){
          localStorage.setItem('tokenUrl', this.tokenUrl);
        }
      });

      this.subscription = this.termsMng.getMessage()
      .subscribe(
        message => {
          this.onSaveTermChanged(true);
        }
      )
    }

    ngOnInit(){
      //localStorage.clear();
      this.copiesServ.postCopies()
      .subscribe(
        res => {
          this.copies = res.datos.seleccion_cuenta;
          this.terminosText = res.datos.terminos;
          this.stepMan.sendMessage(1,"Seleccione una cuenta");
        }
      )
      // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
      this.spinnerMng.showSpinner(true);
      this.loadConfig()
    }

    loadConfig(){
      // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
      this.spinnerMng.showSpinner(true);
      console.log("LOAD CONFIG");
      this.loginServices.getConfig()
      .subscribe(
        res => {
          localStorage.setItem('env', res.ENV_VAR);
          localStorage.setItem('dom', res.ENV_DOM);
          if(res.ENV_LOG === "false"){
            console.log = function() {};
          }
          this.startServices();
        },
        err => {
          localStorage.setItem('env', 'pre');
          localStorage.setItem('dom', 'corp');
          this.startServices();
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
      // SERVICIO DE SALDOS
      this.spinnerMng.showSpinner(true);
      this.loginServices.getSaldosSP()
      .subscribe(
        res => {
          // SE LLENAN LOS CARDS
          this.messageMan.sendMessage(res);
          this.spinnerMng.showSpinner(false); // CIERRA LOADER
        },
        err => {
          this.errorService("Error",err.error.message, "Aceptar", "", 0);
          this.spinnerMng.showSpinner(false); // CIERRA LOADER
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

    private onSaveTermChanged(value:boolean){
      this.validTerms = value;
    }

    // PARA EL MENSAJE DE ERROR
    private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
      var message = new messageAlert(tipo, mensaje, boton, icon, code);
      this.alertMan.sendMessage(message);
    }

    isInvalid(){
      this.validAccount = JSON.parse(localStorage.getItem('validAccount'));
      if (this.validAccount){
        return false;
      }
      return true;
    }

    continuar() {
      this.router.navigate(['/seleccion']);
    }
  }
