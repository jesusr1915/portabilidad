import { Component, OnInit, Input } from '@angular/core';
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

  @Input() valueInfo = localStorage.getItem('tarjet');
  @Input() valueBank = localStorage.getItem('banco');
  @Input() valueBirthdate = localStorage.getItem('birthday');

  date: string;
  demo : Demo = new Demo(
    localStorage.getItem("cardAlias"),
    "SantanderSelect",
    localStorage.getItem("cardNumeroCuenta"),
    localStorage.getItem("cardDisponible"),
    localStorage.getItem("cardDivisa"),
    localStorage.getItem("cardCuentaMovil")
  );

  constructor(
    private stepMan: StepMan,
    private messageMan: MessageMan,
    private loginServices: LoginService,
    private alertMan: AlertMan,
    private router: Router
  ) { }

  ngOnInit() {
    this.stepMan.sendMessage(2,"Confirme sus datos");

    this.loadMock();

  }

  private loadMock(){
    // SERVICIO DE SALDOS
    this.messageMan.sendMessage(this.demo);
  }

  sendAltaService(){

    let body = {
      "cuenta": localStorage.getItem("numeroCuenta"),
      "cuentaInv": "",
      "tipo": "A"
    }

    this.loginServices.postAltaSP(body)
      .subscribe(
        res => {

          if(res.error.clave == "OK"){
            localStorage.setItem('fechaOperacion',res.dto.fechaOperacion);
            localStorage.setItem('horaEnvio',res.dto.horaOperacion);
            localStorage.setItem('referenciaOperacion',res.dto.referenciaOperacion);
            this.router.navigate(['/resumen']);
          } else {
            this.errorService("Error",res.error.message, "Aceptar", "info", 0);
          }
        },
        err => {
          this.errorService("Error",err.error.message, "Aceptar", "info", 0);
        }
      )

  }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
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
