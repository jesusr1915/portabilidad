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
    private route: ActivatedRoute
  ){
    // RECIBE PARAMETROS POR URL
    this.route.params.subscribe(params => {
      this.tokenUrl = params['token'];

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

    // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
    this.loginServices.getConfig()
    .subscribe(
      res => {
        localStorage.setItem('ENV', res.ENV_VAR);
        this.startServices();
      },
      err => {
        localStorage.setItem('ENV', 'pre');
        this.startServices();
      }
    )

    //localStorage.clear();
    this.copiesServ.postCopies()
    .subscribe(
      res => {
        this.copies = res.datos.seleccion_cuenta;
        this.terminosText = res.datos.terminos;
        this.onSelectionChange(1);
        this.stepMan.sendMessage(1,"Portabilidad de Nómina");
      }
    )
  }

  private startServices(){
    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {

        // SERVICIO DE VALIDADOR DE TOKEN
        this.loginServices.postValidator(this.tokenUrl)
        .subscribe(
          res => {


            // VALIDADOR DE RESPUESTA DE TOKEN
            if(res.stokenValidatorResponse.codigoMensaje == "TVT_000"){

              // SE GUARDA EL SESSION ID DE LA RESPUESTA
              if(this.tokenUrl !== "" && this.tokenUrl !== undefined){
                if(localStorage.getItem('sessionID') == ""){
                  localStorage.setItem('sessionID',res.stokenValidatorResponse.PAdicional.substr(11));
                }
              }


              // SERVICIO DE SALDOS
              this.loginServices.getSaldos()
              .subscribe(
                res => {
                  this.messageMan.sendMessage(res);

                  // SERVICIO DE CONSULTA DE RFC
                  this.loginServices.getConsultaRFC()
                  .subscribe(
                    res => {
                      this.infoCardMng.sendMessage(res.dto);

                      // SERVICIO DE CONSULTA DE BANCOS
                      this.loginServices.postBancos()
                      .subscribe(
                        res => {
                          for(let arrayVal of res.dto){
                            let temp = { id: parseInt(arrayVal.id), Name: arrayVal.nombreCorto };
                            this.lBanks.push(temp);
                          }
                        },
                        err => {
                          this.errorService();
                        }
                      );

                    },
                    err => {
                      this.errorService();
                    }
                  )

                },
                err => {
                  this.errorService();
                }
              )

            } else {
              var message = new messageAlert("Error", res.stokenValidatorResponse.mensaje);
              this.alertMan.sendMessage(message);
            }
            // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN


          },
          err => {
            this.errorService();
          }
        );


      },
      err => {
        this.errorService();
      }
    )
  }


  private setNewUser(id: any): void {
    this.curUser = this.lUsers.filter(value => value.id === parseInt(id));
    if(this.selectedRadio == "debito"){
      if (id != 0){
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
       this.tarjetValue = this.tarjetValue.replace(/[^0-9]/g, '');
      if(this.tarjetValue.length != 0){
        this.classLabel = 'hideLabel';
          if(this.tarjetValue.length == 18){

            // VALIDACION DE clabe

            this.validacionClabe(this.tarjetValue);


            //service get Banks
            //mover para demo
            if(this.sendService){
            this.loginServices.postBancosClabe(this.tarjetValue)
            .subscribe(
              res=> {
                console.log(res.dto.bancoCuenta);
                let temp = { id: 1, Name: res.dto.bancoCuenta };
                this.lUsers.push(temp);
                this.setNewUser(1);
                this.validClabe = true;
                this.validBank = true;
                this.sendService = false;
              },
              err => {
                this.validClabe = false;
                this.validBank = false;
                this.sendService = false;
                /*let temp = { id: 1, Name: "Santander" };
                this.lUsers.push(temp);
                this.setNewUser(1);*/
                this.errorService();
                console.log('Something went wrong!' + err.message);
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
