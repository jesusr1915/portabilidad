import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MessageMan } from '../cards/messageMan';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {
  cards = [];
  viewTipoProducto = "";
  keys = ["saldoDolares",
              "saldoPesos",
              "saldoCuentaPlazos",
              "saldoFondos"];

  subscription: Subscription;
  classMulti = "multi";
  classOne = "one";
  classLabel = this.classMulti;

  constructor(private messageMan: MessageMan) {
    this.subscription = this.messageMan.getMessage()
    .subscribe(
      message => {
        if(message.response["dto"]){
          this.setValues(this.keys,message);
        }else if(message.response["alias"]){
          this.setOneValue(message.response);
        }
        else{
          console.log('Error en la respuesta');
        }
      })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  setValues(keys:any,messages:any){
    this.cards = [];
    let message = messages.response.dto;
    for(let key of this.keys){
      for(const value of (message[key])){
          if(value.alias == ""){
            value.alias = value.tipoProducto;
          }
          let accountLenght = value.numeroCuenta.length;
          value.numeroCuenta = value.numeroCuenta.substr(0,2) + "**" + value.numeroCuenta.substr(accountLenght-4,accountLenght);
          this.cards.push(value);
      }
    }
  }
  setOneValue(value:any){
    this.classLabel = this.classOne;
    this.cards = [];
    this.cards.push(value);
  }

}
