import { Component, OnInit, Input } from '@angular/core';



@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss',
              '../app.component.scss']
})
export class CardInfoComponent implements OnInit {
  @Input() value_alias;
  @Input() value_disponible;
  @Input() value_divisa;
  @Input() value_numCuenta;
  @Input() value_cuentaMovil;
  @Input() value_bloqueo;
  @Input() value_selected;
  cuentaBloqueada: boolean = false;
  cuentaEnCeros: boolean = false;
  cardStyle: string = "Card";
  cuentaTodos: boolean = false;
  constructor(){
  }

  ngOnInit() {
    this.cuentaBloqueada = this.value_bloqueo == "S" ? true : false;
    this.cuentaEnCeros = this.value_disponible <= 0 ? true : false;
    if(this.value_divisa === "MXP"){
      this.cuentaTodos = false
    } else {
      this.cuentaTodos = true
    }
  }

}
