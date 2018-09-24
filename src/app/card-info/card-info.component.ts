import { Component, OnInit, Input } from '@angular/core';



@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss',
              '../app.component.scss']
})
export class CardInfoComponent implements OnInit {
  @Input() valueAlias;
  @Input() valueDisponible;
  @Input() valueDivisa;
  @Input() valueNumCuenta;
  @Input() valueCuentaMovil;
  @Input() valueBloqueo;
  @Input() valueSelected;
  @Input() valueSp;
  cuentaBloqueada: boolean = false;
  cuentaEnCeros: boolean = false;
  cardStyle: string = "Card";
  cuentaTodos: boolean = false;
  cardBorder: string = "";
  constructor(){
  }

  ngOnInit() {
    this.cuentaBloqueada = this.valueBloqueo === "S" ? true : false;
    this.cuentaEnCeros = this.valueDisponible <= 0 ? true : false;
    if(this.valueDivisa === "MXP"){
      this.valueDivisa = "MXN";
      this.cuentaTodos = false
    } else {
      this.cuentaTodos = true
    }
    if(this.valueSelected){
      this.cardBorder = "active";
    } else {
      this.cardBorder = "";
    }
  }

}
