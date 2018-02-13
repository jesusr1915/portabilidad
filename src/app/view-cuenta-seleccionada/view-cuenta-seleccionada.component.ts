import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/loginServices';
import { StepMan } from '../stepper/stepMan';
import { verifique_class } from 'interfaces/copiesInterface';
import { MessageMan } from '../cards/messageMan';
import { TokenMng } from '../token/tokenMng';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-cuenta-seleccionada',
  templateUrl: './view-cuenta-seleccionada.component.html',
  styleUrls: ['../app.component.scss','./view-cuenta-seleccionada.component.scss']
})
export class ViewCuentaSeleccionadaComponent implements OnInit {

  constructor(
    private stepMan: StepMan,
    private messageMan: MessageMan,
    private loginServices: LoginService,
    private alertMan: AlertMan,
    private router: Router
  ) { }

  ngOnInit() {
    this.stepMan.sendMessage(2,"Confirme sus datos");
  }

  subscribe(){
    // CONECTAR CON SERVICIO DE ALTA SP
    this.router.navigate(['/resumen']);
  }


  private errorService(){
    var message = new messageAlert("Error","Por el momento el servicio no esta disponible", "Aceptar");
    this.alertMan.sendMessage(message);
  }

}

export class Demo {
  alias : string;
  tipoProducto : string;
  numeroCuenta : string;
  disponible: string;
  divisa: string;
  cuentaMovil: string;

  demo : Demo = new Demo(
    localStorage.getItem("cardAlias"),
    "SantanderSelect",
    localStorage.getItem("cardNumeroCuenta"),
    localStorage.getItem("cardDisponible"),
    localStorage.getItem("cardDivisa"),
    localStorage.getItem("cardCuentaMovil")
  );

  constructor(
    alias:string,
    tipoProducto:string,
    numeroCuenta:string,
    disponible: string,
    divisa: string,
    cuentaMovil: string
  ){
    this.alias = alias;
    this.tipoProducto = tipoProducto;
    this.numeroCuenta = numeroCuenta;
    this.disponible = disponible;
    this.divisa = divisa;
    this.cuentaMovil =  cuentaMovil;
  }
}
