import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { MessageMan } from '../cards/messageMan';

declare var jQuery:any;
declare var $:any;
declare var Sly:any;

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
  valores = "";

  constructor(private messageMan: MessageMan, private alertMan: AlertMan) {
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
          value.unmaskCuenta = value.numeroCuenta;
          value.numeroCuenta = value.numeroCuenta.substr(0,2) + "**" + value.numeroCuenta.substr(accountLenght-4,accountLenght);
          this.cards.push(value);
          this.valores += value.unmaskCuenta + '-';
      }
    }
    this.setSly();
    localStorage.setItem("valores", this.valores.slice(0, -1));
  }
  setOneValue(value:any){
    this.classLabel = this.classOne;
    this.cards = [];
    this.cards.push(value);
  }
  setCurrentLocalCard(cards:any){
    localStorage.setItem("cardAlias",cards.alias);
    localStorage.setItem("cardDisponible",cards.disponible);
    localStorage.setItem("cardDivisa",cards.divisa);
    localStorage.setItem("cardNumeroCuenta",cards.numeroCuenta);
    localStorage.setItem("cardCuentaMovil",cards.cuentaMovil);
    localStorage.setItem("numeroCuenta",cards.unmaskCuenta);
    localStorage.setItem("numeroCuenta",cards.numeroSubProducto);
    if(cards.numeroSubProducto == "0025"){
      var message = new messageAlert("Atención","Este tipo de cuentas sólo puede recibir depósitos de hasta $17, 000 mesuales. Si cree que rebasará el límite seleccione otra cuenta.","Entendido");
      this.alertMan.sendMessage(message);
    }
  }


  private setSly():void {
    let frame:any;
    let local = this;
    setTimeout(()=> {
      let options = {
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateMiddle: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1
      };
      frame = new Sly(document.getElementById("frame"), options).init();
      local.setCurrentLocalCard(local.cards[0]);
      frame.on('active', function (eventName, itemIndex ) {
        //console.log('Current', local.cards[itemIndex]);
        local.setCurrentLocalCard(local.cards[itemIndex]);
      });
      $(window).resize();
      $(window).resize();
    }, 1000);
    $(window).resize(function(e) {
      frame.reload();
    });
  }

}