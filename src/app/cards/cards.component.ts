import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  @Input() data;

  cards = [];
  viewTipoProducto = "";
  keys = ["saldoPesos"];
  subscription: Subscription;
  classMulti = "multi";
  classOne = "one";
  classLabel = this.classMulti;
  valores = "";
  className = ""
  newClass = "";
  selectedAccountIndex = 0;

  constructor(private messageMan: MessageMan, private alertMan: AlertMan) {
    this.subscription = this.messageMan.getMessage()
    .subscribe(
      message => {
        if(message.response["dto"]){
          console.log("MULTIPLE VALUE");
          this.setValues(this.keys,message);
          this.newClass="contentCarr"
        }else if(message.response["alias"]){
          console.log("ONE VALUE");
          this.setOneValue(message.response);
          this.newClass="contentCarr verifica"
        }
      })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  setValues(keys:any,messages:any){
    // console.log("LLENANDO CARDS")
    this.cards = [];
    let message = messages.response.dto;
    let index = 0;
    for(let key of this.keys){
      for(const value of (message[key])){

        if(value.indicadorBloqueo === "N"){

          if(value.alias == ""){
            value.alias = value.tipoProducto;
          }
          let accountLenght = value.numeroCuenta.length;
          value.unmaskCuenta = value.numeroCuenta;
          value.numeroCuenta = value.numeroCuenta.substr(0,2) + "**" + value.numeroCuenta.substr(accountLenght-4,accountLenght);
          value.isSelected = false;
          this.cards.push(value);
          this.valores += value.unmaskCuenta + '-';

          if(localStorage.getItem('numeroCuenta') === value.unmaskCuenta){
            localStorage.setItem('selectedAccountIndex', index.toString());
          }
          index++;

        }
        
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
    if(cards.indicadorBloqueo === "S"){
      localStorage.setItem('validAccount','false');
      var message = new messageAlert("Cuenta bloqueada","Esta cuenta no puede ser utilizada dado que tiene un bloqueo. <br/><br/>  Para cualquier duda o aclaración comuníquese a SuperLínea, opción 4.","Aceptar","info",0);
      this.alertMan.sendMessage(message);
      cards.isSelected = false;
    } else {
      // console.log("GUARDA CARD...")
      localStorage.setItem('validAccount','true');
      localStorage.setItem("cardAlias", cards.alias);
      localStorage.setItem("cardDisponible", cards.disponible);
      localStorage.setItem("cardDivisa", cards.divisa);
      localStorage.setItem("cardNumeroCuenta", cards.numeroCuenta);
      localStorage.setItem("cardCuentaMovil", cards.cuentaMovil);
      localStorage.setItem("numeroCuenta", cards.unmaskCuenta);
      localStorage.setItem("numeroSubProducto", cards.numeroSubProducto);
      if(cards.numeroSubProducto == "0025"){
        setTimeout(()=> {
          var message = new messageAlert("Límite depósitos en cuenta","Este tipo de cuenta sólo puede recibir depósitos de hasta $17, 000 mensuales. Si considera que rebasará este límite seleccione otra cuenta o acuda a sucursal con identificación oficial vigente y comprobante de domicilio residencial (no mayor a 3 meses).","Aceptar","info",0);
          this.alertMan.sendMessage(message);
        }, 700);
      }
      cards.isSelected = true;
    }
    this.messageMan.sendMessage(cards.isSelected);
  }


  private setSly():void {
    console.log("SLY");
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
        // console.log("CAMBIA CARD");
        local.setCurrentLocalCard(local.cards[itemIndex]);
      });



      setTimeout(()=> {
        $(window).resize();
        // $(window).resize();
      }, 500);
    }, 500);

    $(window).resize(function(e) {
      frame.reload();
      if(localStorage.getItem('numeroCuenta') !== ""){
          console.log("ONE VALUE");
          frame.activatePage(parseInt(localStorage.getItem('selectedAccountIndex')), false);
      }
    });
  }

}
