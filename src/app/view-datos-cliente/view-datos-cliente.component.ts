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
import { TermMan } from '../terms/termMng';

import { SpinnerMan } from '../spinner-component/spinnerMng';

import { JavaScriptInterface } from 'interfaces/JavaScriptInterface';

declare var Connect: JavaScriptInterface;

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
  subscriptionL: Subscription;
  subscriptionM: Subscription;

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
    pruebasDante = "";

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

    this.subscription = this.termsMng.getMessage()
    .subscribe(
      message => {
        this.onSaveTermChanged(true);
      }
    )
    this.subscription = this.messageMan.getMessage()
    .subscribe(
      message => {
        if(message.response == true)
          this.validAccount = true;
        else
          this.validAccount = false;
      }
    )
  }

  ngOnInit(){
    this.loadConfig();
    this.loadCopies();

    this.openAlert("Portabilidad de nómina", "Usted está iniciando el proceso de portabilidad de nómina a Santander. <br/><br/> La portabilidad de nómina es el derecho que tiene usted a decidir en qué banco desea recibir su sueldo, pensión y otras prestaciones de carácter laboral sin costo.", "", "", 3)
    this.subscriptionM = this.alertMan.getMessage()
    .subscribe(
      message => {
        if(message.title == "done"){
          // this.startServices();
          this.loadMock()
        }
      }
    )

  }

  loadConfig(){
    // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
    this.spinnerMng.showSpinner(true);
    this.loginServices.getConfig()
    .subscribe(
      res => {
        localStorage.setItem('env', res.ENV_VAR);
      },
      err => {
        localStorage.setItem('env', 'pre');
      }
    )
  }

  loadCopies(){
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
      localStorage.setItem('tokenUrl', this.tokenUrl);

    }
  }

  recoverBankData(){
    // SE RECUPERA LA INFORMACION
    if(localStorage.getItem('fillData')){
      if(localStorage.getItem('tarjet') !== null){
        if(localStorage.getItem('tarjet').length === 16){
          this.selectBank = localStorage.getItem('idBanco');
          this.validBank = true;
          this.validClabe = true;
          this.setNewUser(localStorage.getItem('idBanco'));
        }
      }
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
                  this.openAlert("Error",res.stokenValidatorResponse.mensaje,"","",0);
                }
                // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN
              },
              err => {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.openAlert("Error", "", "", "", 0);
              }
            );
          } else {
            // SE EJECUTAN LOS SERVICIOS DE CARGA
            this.loadInfo();
          }
      },
      err => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.openAlert("Error", "", "", "", 0);
      }
    )
  }

  private loadMock(){
    this.loginServices.getSaldosMock()
    .subscribe(
      res => {
        // SE LLENA LA INFO DEL CLIENTE
        this.messageMan.sendMessage(res);

        this.loginServices.getConsultaRFCMock()
        .subscribe(
          res => {
            // SE LLENA LA INFO DEL CLIENTE
            this.infoCardMng.sendMessage(res.dto);

            this.loginServices.getBancosMock()
            .subscribe(
              res => {
                this.spinnerMng.showSpinner(false);
                if(res.error.clave == "OK"){
                  for(let arrayVal of res.dto){
                    let temp = { id: arrayVal.id, Name: arrayVal.nombreCorto };
                    this.lBanks.push(temp);
                  }
                }
              },
              err => {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.openAlert("", "", "", "", 0);
              }
            );
          },
          err => {
            this.spinnerMng.showSpinner(false); // CIERRA LOADER
            this.openAlert("", "", "", "", 0);
          }
        );
      },
      err => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.openAlert("", "", "", "", 0);
      }
    );
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

                  this.recoverBankData();

                  this.spinnerMng.showSpinner(false); // CIERRA LOADER
                } else {
                  this.spinnerMng.showSpinner(false); // CIERRA LOADER
                  this.openAlert(res.error.message);
                }
              },
              err => {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.openAlert("", "", "", "", 0);
              }
            );
          },
          err => {
            this.spinnerMng.showSpinner(false); // CIERRA LOADER
            this.openAlert("", "", "", "", 0);
          }
        )

      },
      err => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        if(err.error.clave == "CSCH-SCC-1"){
          this.openAlert("", "Los depósitos por concepto de nómina o prestaciones laborales son realizados a su cuenta de cheques. \n\n Por favor acuda a sucursal con identificación oficial vigente y comprobante de domicilio residencial (no mayor a 3 meses) para realizar la portabilidad de nómina.", "", "", 0);
        } else {
          if(err.error.message){
            this.openAlert("", err.error.message, "", "", 0);
          } else {
            this.openAlert("","","","",1);
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
  private openAlert(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

  private onSelectionChange(entry){ // radio buttons controll
    this.validBank = false;
    this.validAccount = false;
    this.validClabe = false;
    this.validTerms = false;
    this.selectBank = "0"
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
        // this.validacionClabe(this.tarjetValue);
        if(this.sendService){
          this.spinnerMng.showSpinner(true);
          this.loginServices.postBancosClabe(this.tarjetValue)
          .subscribe(
            res=> {
              if(res.error.clave == "OK"){
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
                this.spinnerMng.showSpinner(false);
                this.validClabe = true;
                this.validBank = true;
                this.sendService = false;
                this.selectBank = idBank
              } else {
                this.validClabe = false;
                this.validBank = false;
                this.sendService = false;

                this.openAlert("Error", res.error.message, "Aceptar", "", 0);
              }
            },
            err => {
              if(err.error.clave == "ERROR"){
                this.openAlert("Error", err.error.message, "Aceptar" , "", 0);
              } else {
                this.openAlert("", "", "", "", 1);
              }
              this.validClabe = false;
              this.validBank = false;
              this.sendService = false;
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

  // private validacionClabe(clabe: string){
  //   let ponderacion = "37137137137137137";
  //   let clabeA = clabe.substr(0,17);
  //
  //   let arrPond = ponderacion.split('');
  //   let arrClab = clabeA.split('')
  //
  //   for(let i=0; i<arrClab.length; i++){
  //
  //   }
  // }


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
