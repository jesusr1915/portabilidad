import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../services/loginServices';
import { StepMan } from '../stepper/stepMan';
import { verifique_class } from 'interfaces/copiesInterface';
import { MessageMan } from '../cards/messageMan';
import { TokenMng } from '../token/tokenMng';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-view-actualiza-confirma',
  templateUrl: './view-actualiza-confirma.component.html',
  styleUrls: ['../app.component.scss','./view-actualiza-confirma.component.scss']
})
export class ViewActualizaConfirmaComponent implements OnInit {

  value_alias = "";
  value_disponible = "";
  value_divisa = "";
  value_numCuenta = "";
  value_cuentaMovil = "";
  cuentaEnCeros = false;

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
    this.stepMan.sendMessage(2,"Verifique los datos de su cuenta");
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
    this.loadInfo();
  }

  private loadInfo(){
    // SERVICIO DE SALDOS
    this.messageMan.sendMessage(this.demo);
  }

  private loadMock(){
    // SERVICIO DE SALDOS
    this.value_alias = localStorage.getItem("cardAliasSP");
    this.value_disponible = localStorage.getItem("cardDisponibleSP");
    this.value_divisa = localStorage.getItem("cardDivisaSP");
    this.value_numCuenta = localStorage.getItem("cardNumeroCuentaSP");
    this.value_cuentaMovil = localStorage.getItem("cardCuentaMovilSP");
    this.cuentaEnCeros = parseFloat(localStorage.getItem("cardDisponibleSP").replace(",","")) <= 0 ? true : false;

    this.messageMan.sendMessage(this.demo);
  }

  sendAltaService(){
    let body = {
      "cuenta": localStorage.getItem("numeroCuenta"),
      "tipo":"M"
    }

    // this.loginServices.postActualizaSP(body)
    this.loginServices.getActualizaSPMock()
    .subscribe(
      res => {
        if(res.error.clave == "OK"){
          localStorage.setItem('folio',res.dto.folio);
          localStorage.setItem('fechaOperacion',res.dto.fechaOperacion);
          localStorage.setItem('horaEnvio',res.dto.horaOperacion);
          localStorage.setItem('referenciaOperacion',res.dto.referenciaOperacion);
          this.router.navigate(['/fin']);
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
