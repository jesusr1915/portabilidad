import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../services/loginServices'
import { CopiesService } from '../services/copiesService';
import { seleccion_cuenta_class, terminos_class } from 'interfaces/copiesInterface';
import { NgModel } from '@angular/forms';

import { MessageMan } from '../cards/messageMan';
import { StepMan } from '../stepper/stepMan';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { InfoCardMan } from '../personal-card/infoCardMng';

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
  selectedBank = "SANTANDER";
  classEnaBank = "select-styled"
  classDisBank = "select-styled disabled"
  classSelBank = "";


  @Input() value_label_CLABE;
  @Input() value_placeholder_CLABE;

  constructor(
    public loginServices: LoginService,
    public messageMan: MessageMan,
    public stepMan: StepMan,
    public copiesServ: CopiesService,
    public alertMan: AlertMan,
    public infoCardMng: InfoCardMan
  ){}

  ngOnInit(){

    this.copiesServ.postCopies()
    .subscribe(
      res => {
        this.copies = res.datos.seleccion_cuenta;
        this.terminosText = res.datos.terminos;
        this.onSelectionChange(1);
        this.stepMan.sendMessage(1);
      }
    )

    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {
        this.loginServices.postBancos()
        .subscribe(
          res => {
            let bancosName = [];
            let bancosId = [];
            for(let arrayVal of res.dto){
              bancosName.push(arrayVal.nombreCorto);
              bancosId.push(arrayVal.id);
            }
            console.log(bancosName);



          },
          err => {
            this.errorService();
          }
        );
        this.loginServices.getconsultaRFC()
        .subscribe(
          res => {
            this.infoCardMng.sendMessage(res.dto);
            this.loginServices.getSaldos()
            .subscribe(
              res => {
                this.messageMan.sendMessage(res);
              },
              err => {
                this.errorService();
                console.log('Something went wrong!' + err.message);
              }
            )
          }
        )
      },
      err => {
        this.errorService();
        console.log('Something went wrong!' + err.message);
      }
    )
  }

  errorService(){
    var message = new messageAlert("Error","Por el momento el servicio no esta disponible");
    this.alertMan.sendMessage(message);
  }

  onSelectionChange(entry){ // radio buttons controll
    this.tarjetValue = "";
    this.selectedBank = "";
    this.classLabel = 'showLabel';
    if(entry == 1){
      this.value_label_CLABE = this.copies.textInstClabe;
      this.value_placeholder_CLABE = this.copies.textPlaceHolderClabe;
      this.maxLength = '18';
      this.selectedRadio = 'clabe';
      this.classSelBank = this.classDisBank;
    }else{
      this.value_label_CLABE = this.copies.textInstDebito;
      this.value_placeholder_CLABE = this.copies.textPlaceHolderDebito;
      this.maxLength = '16';
      this.selectedRadio = "debito";
      this.classSelBank = this.classEnaBank;
    }
  }

    onKey(event: any) { // inputs de tarjeta
      if(this.tarjetValue.length != 0){
        this.classLabel = 'hideLabel';
          if(this.tarjetValue.length == 18){
            //service get Banks
            this.loginServices.postBancosClabe(this.tarjetValue)
            .subscribe(
              res=> {
                this.selectedBank = res.dto.bancoCuenta
              },
              err => {
                this.errorService();
                console.log('Something went wrong!' + err.message);
              }
            )
          }else{

          }
      }else{
        this.classLabel = 'showLabel';
      }
    }
}
