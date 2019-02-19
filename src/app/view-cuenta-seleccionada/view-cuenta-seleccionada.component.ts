import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../services/loginServices';
import { StepMan } from '../stepper/stepMan';
import { VerifiqueClass } from 'interfaces/copiesInterface';
import { MessageMan } from '../cards/messageMan';
import { TokenMng } from '../token/tokenMng';
import { AlertMan , MessageAlert } from '../message-alert/alertMan';
import { Router, NavigationEnd } from '@angular/router';
import { SpinnerMan } from '../spinner-component/spinnerMng';
import { PageTrack } from '../decorators/page-track.decorator';
import { AnalyticsService } from '../services/analytics.service';
@PageTrack('inscripcion-confirma')
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
    private router: Router,
    public spinnerMng: SpinnerMan,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.stepMan.sendMessage(2,"Verifique los datos de su cuenta o tarjeta");
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
    this.messageMan.sendMessage(this.demo);
  }

  sendAltaService(){
    this.spinnerMng.showSpinner(true); // CIERRA LOADER

    let body = {
      "cuenta": localStorage.getItem("numeroCuenta"),
      "cuentaInv": "",
      "tipo": "A"
    }

    this.loginServices.postAltaSP(body)
      .subscribe(
        res => {

          if(res.error.clave === "OK"){
            localStorage.setItem('fechaOperacion',res.dto.fechaOperacion);
            localStorage.setItem('horaEnvio',res.dto.horaOperacion);
            localStorage.setItem('referenciaOperacion',res.dto.referenciaOperacion);
            localStorage.setItem('necesitaPortabilidad', res.dto.necesitaPortabilidad.toString());
            this.router.navigate(['/resumen']);
            this.analyticsService.enviarMetrica('inscripcionFinalizada', 1);
            this.spinnerMng.showSpinner(false); // CIERRA LOADER
          } else {
            this.analyticsService.enviarDimension('errorInscripcion', res.error.clave);
            this.errorService("Error",res.error.message, "Aceptar", "info", 0);
            this.spinnerMng.showSpinner(false); // CIERRA LOADER
          }
        },
        err => {
          this.errorService("Error",err.error.message, "Aceptar", "info", 1);
          this.spinnerMng.showSpinner(false); // CIERRA LOADER
        }
      )
  }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    let message = new MessageAlert(tipo, mensaje, boton, icon, code);
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
  isSelected: boolean;

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
    this.isSelected = true;
  }
}
