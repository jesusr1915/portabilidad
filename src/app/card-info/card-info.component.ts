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
  constructor(){
  }

  ngOnInit() {
    this.cuentaBloqueada = this.value_bloqueo == "S" ? true : false;
    this.cuentaEnCeros = this.value_disponible <= 0 ? true : false;
    this.cardStyle = this.value_selected == true ? "Card selected" : "Card";
  }

}
