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
  selector: 'app-view-datos-cliente',
  templateUrl: './view-datos-cliente.component.html',
  styleUrls: ['./view-datos-cliente.component.scss',
              '../app.component.scss']
})
export class ViewDatosClienteComponent implements OnInit {

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
  selectBank = "";

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
      this.tokenUrl = params.token

      localStorage.setItem('backButton', "true");
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

    // RECIBE PARAMETROS POR URL
    // this.route.params.subscribe(params => {
    //   this.tokenUrl = params['token'];
    //
    //   // SE OBTIENE EL TOKEN PARA SINGLE SIGN ON
    //   if(this.tokenUrl != ""){
    //     localStorage.setItem('tokenUrl', this.tokenUrl);
    //   }
    // });

    this.subscription = this.termsMng.getMessage()
    .subscribe(
      message => {
        this.onSaveTermChanged(true);
      }
    )
  }

  ngOnInit(){
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
      }
    )

    var message = new messageAlert("Portabilidad de nómina", "Usted está iniciando el proceso de portabilidad de nómina a Santander. <br/><br/> La portabilidad de nómina es el derecho que tiene usted a decidir en qué banco desea recibir su sueldo, pensión y otras prestaciones de carácter laboral sin costo.");
    this.alertMan.sendMessage(message);

    //localStorage.clear();
    this.copiesServ.postCopies()
    .subscribe(
      res => {
        this.copies = res.datos.seleccion_cuenta;
        this.terminosText = res.datos.terminos;
        this.onSelectionChange(1);
        this.stepMan.sendMessage(1,"Ingrese los datos de su nómina");
      }
    )
  }

  reloadData(){
    localStorage.clear();
    // SE OBTIENE EL TOKEN PARA SINGLE SIGN ON
    if(this.tokenUrl !== ""){
      console.log("OBTIENE TOKEN");
      localStorage.setItem('tokenUrl', this.tokenUrl);
    }
  }

  private startServices(){
    this.spinnerMng.showSpinner(true);
    // SERVICIO QUE OBTIENE EL TOKEN OATUH PARA CONSUMIR SERVICIOS
    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {

          // SE RECUPERA LA INFORMACION CUANDO SE DA BOTON DEL BACK
          if(localStorage.getItem('fillData')){
            if(localStorage.getItem('tarjet') !== null){
              if(localStorage.getItem('tarjet').length == 18){
                this.tipoCuenta = true;
                this.onSelectionChange(1)
              } else {
                this.tipoCuenta = false;
                this.onSelectionChange(2)
              }
              this.tarjetValue = localStorage.getItem('tarjet')
              this.validaCampoCta()
            }
          }

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
                  var message = new messageAlert("Error", res.stokenValidatorResponse.mensaje);
                  this.alertMan.sendMessage(message);
                }
                // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN
              },
              err => {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.errorService();
              }
            );
          } else {
            // SE EJECUTAN LOS SERVICIOS DE CARGA
            // this.spinnerMng.showSpinner(false); // CIERRA LOADER
            this.loadInfo();
          }
      },
      err => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.errorService();
      }
    )
  }

  private loadInfo(){
    // SERVICIO DE SALDOS
    this.loginServices.getSaldos()
    .subscribe(
      res => {
        // SE LLENAN LOS CARDS
        this.messageMan.sendMessage(res);
        // SERVICIO DE CONSULTA DE RFC
        this.loginServices.getConsultaRFC()
        .subscribe(
          res => {
            // SE LLENA LA INFO DEL CLIENTE
            this.infoCardMng.sendMessage(res.dto);
            // SERVICIO DE CONSULTA DE BANCOS
            this.loginServices.postBancos()
            .subscribe(
              res => {
                // SE LLENA EL LISTADO DE BANCOS
                if(res.error.clave == "OK"){
                  for(let arrayVal of res.dto){
                    let temp = { id: arrayVal.id, Name: arrayVal.nombreCorto };
                    this.lBanks.push(temp);
                  }

                  if(localStorage.getItem('fillData')){
                    if(localStorage.getItem('tarjet') !== null){
                      this.selectBank = localStorage.getItem('idBanco');
                    }
                  }


                  this.spinnerMng.showSpinner(false); // CIERRA LOADER
                } else {
                  this.spinnerMng.showSpinner(false); // CIERRA LOADER
                  var message = new messageAlert("Error",res.error.message, "Aceptar");
                  this.alertMan.sendMessage(message);
                }
              },
              err => {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.errorService();
              }
            );
          },
          err => {
            this.spinnerMng.showSpinner(false); // CIERRA LOADER
            this.errorService();
          }
        )

      },
      err => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        if(err.error.clave == "CSCH-SCC-1"){
          var message = new messageAlert("Error","Los depósitos por concepto de nómina o prestaciones laborales son realizados a su cuenta de cheques. \n\n Por favor acuda a sucursal con identificación oficial vigente y comprobante de domicilio residencial (no mayor a 3 meses) para realizar la portabilidad de nómina.", "Aceptar");
          this.alertMan.sendMessage(message);
        } else {
          if(err.error.message){
            var message = new messageAlert("Error",err.error.message, "Aceptar");
            this.alertMan.sendMessage(message);
          } else {
            var message = new messageAlert("Error","Por el momento el servicio no está disponible.", "Aceptar");
            this.alertMan.sendMessage(message);
          }
        }
      }
    )
  }

  private setNewUser(id: any): void {
    this.curUser = this.lUsers.filter(value => value.id === id);
    if(this.selectedRadio == "debito"){
      if (id != "0"){
        this.validBank = true;
      }else{
        this.validBank = false;
      }
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9]+/;
    let inputChar = event.key;
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  private onSaveTermChanged(value:boolean){
    this.validTerms = value;
  }

  // PARA EL MENSAJE DE ERROR
  private errorService(mensaje?: string){
    var strMensaje = "";

    if(mensaje)
      strMensaje = mensaje;
    else
      strMensaje = "Por el momento el servicio no esta disponible";
    var message = new messageAlert("Error",strMensaje);
    this.alertMan.sendMessage(message);
  }

  private onSelectionChange(entry){ // radio buttons controll
    this.tarjetValue = "";
    this.selectedBank = "";
    this.classLabel = 'showLabel';
    this.validBank = false;
    if(entry == 1){
      this.value_label_CLABE = this.copies.textInstClabe;
      this.value_placeholder_CLABE = this.copies.textPlaceHolderClabe;
      this.maxLength = '18';
      this.selectedRadio = 'clabe';
      this.classSelBank = this.classDisBank;
      this.bankDisable = true;
      this.lUsers = [];
    }else{
      this.value_label_CLABE = this.copies.textInstDebito;
      this.value_placeholder_CLABE = this.copies.textPlaceHolderDebito;
      this.maxLength = '16';
      this.selectedRadio = "debito";
      this.classSelBank = this.classEnaBank;
      this.bankDisable = false;
      this.lUsers = this.lBanks;
    }
  }

    onKey(event: any) { // inputs de tarjeta
      this.validaCampoCta()
    }

    validaCampoCta() { // inputs de tarjeta
      this.tarjetValue = this.tarjetValue.replace(/[^0-9]/g, '');
      if(this.tarjetValue.length != 0){
        this.classLabel = 'hideLabel';
          if(this.tarjetValue.length == 18){

            // VALIDACION DE clabe

            this.validacionClabe(this.tarjetValue);

// TOKEN MOCKEADO = DhmJ4hiWVTT7TthRscBW8t6%2B5iQBmzTEYU85SWKL%2BwHR2bKQBZPEciyi7YTCYaGXPN5tlfyY8fg%2F%2F4ibMYvVgipOw80QSP%2FM4dS1mkG%2FzsHPjXyoHR49dDh53t6hmaPnwiAPneDmXx8KESvU7a1Tw%2FJOF7pBdCCvueH7LQJPvQ3SpylDT20dG4R7AVqJKeai2yqgHlNUxIJqUkeeKnmDSO7%2FI6ASDRXRGCSMIa6gQS2Qh36joli7QZrK2umBlTKS45%2FBZUgQ%2BbhnkaIoTlQOn1cLknhkQJ6tUOvyAB0kGAlPUu4xpMIwFcBoi3PufvDzAYvEEGxQzNRdlTw5kh0BNw%3D%3D


            //service get Banks
            //mover para demo
            if(this.sendService){
            this.loginServices.postBancosClabe(this.tarjetValue)
            .subscribe(
              res=> {
                if(res.error.clave == "OK"){
                  //console.log(res.dto.bancoCuenta);

                  var recoveredBank = "";
                  var idBank = "";
                  for(let i=0; i < this.lBanks.length; i++){
                    if(this.lBanks[i].Name == res.dto.bancoCuenta){
                      idBank = this.lBanks[i].id;
                    }
                  }

                  let temp = { id: idBank, Name: res.dto.bancoCuenta };
                  this.lUsers.push(temp);
                  this.setNewUser(idBank);
                  this.validClabe = true;
                  this.validBank = true;
                  this.sendService = false;
                } else {
                  this.validClabe = false;
                  this.validBank = false;
                  this.sendService = false;

                  var message = new messageAlert("Error",res.error.message, "Aceptar");
                  this.alertMan.sendMessage(message);
                }
              },
              err => {
                if(err.error.clave == "ERROR"){
                  var message = new messageAlert("Error",err.error.message, "Aceptar");
                  this.alertMan.sendMessage(message);
                } else {
                  this.errorService();
                }


                this.validClabe = false;
                this.validBank = false;
                this.sendService = false;
                /*let temp = { id: 1, Name: "Santander" };
                this.lUsers.push(temp);
                this.setNewUser(1);*/
                //this.errorService();
                //console.log('Something went wrong!' + err.message);
              }
            )}
          } else {
            this.validClabe = false;

                this.sendService = true;

            if(this.selectedRadio == "debito"){
                if(this.tarjetValue.length == 16){
                  this.validClabe = true;
                }
            }else{
              this.lUsers = [];
            }
          }
      }else{
        this.classLabel = 'showLabel';
      }
      this.isInvalid();
    }

    private validacionClabe(clabe: string){
      let ponderacion = "37137137137137137";
      let clabeA = clabe.substr(0,17);

      let arrPond = ponderacion.split('');
      let arrClab = clabeA.split('')

      for(let i=0; i<arrClab.length; i++){

      }
    }


    isInvalid(){
      this.validAccount = JSON.parse(localStorage.getItem('validAccount'));
      if (this.validClabe && this.validBank && this.validTerms && this.validAccount){
        return false;
      }
      return true;
    }
    onBtnActionClickedV() {
      localStorage.setItem('tarjet',this.tarjetValue);
      localStorage.setItem('idBanco',this.curUser[0].id);
      localStorage.setItem('banco',this.curUser[0].Name);
      this.router.navigate(['/verifica']);
    }
}
