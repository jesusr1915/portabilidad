import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AlertMan , MessageAlert } from '../message-alert/alertMan';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from '../services/loginServices';
import { SpinnerMan } from '../spinner-component/spinnerMng';
import { PageTrack } from '../decorators/page-track.decorator';
import { AnalyticsService } from '../services/analytics.service';
@PageTrack('inscripcion-bienvenida')
@Component({
  selector: 'app-view-cuenta-bienvenida',
  templateUrl: './view-cuenta-bienvenida.component.html',
  styleUrls: ['../app.component.scss', './view-cuenta-bienvenida.component.scss']
})
export class ViewCuentaBienvenidaComponent implements OnInit {

  subscriptionM: Subscription;

  constructor(
    private router: Router,
    private alertMan: AlertMan,
    private loginServices: LoginService,
    public spinnerMng : SpinnerMan,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
  }

  finalizar(){
    this.analyticsService.enviarMetrica('finalizarBienvenida', 1);
    // localStorage.setItem('necesitaPortabilidad', "true"); // SE DESCOMENTA PARA PROBAR EL MENSAJE INICIAR
    if(localStorage.getItem('necesitaPortabilidad') === "true"){
      this.errorService("","Para disfrutar de los beneficios de Santander Plus es indispensable tener su nómina en Santander, en caso de no tenerla debe contar con uno o varios depósitos al mes en su(s) cuenta(s) Santander.<br/><br/>Traiga su nómina a Santander sin costo ingresando desde el menú lateral a <strong>SantaderPlus > Traer la nómina.</strong><br/><br/>Por favor cualquier duda o aclaración comuníquese a la línea de<br/>Santander Plus al <br/>01800 0101123.", "Aceptar", "info", 3);
      this.subscriptionM = this.alertMan.getMessage()
      .subscribe(
        message => {
          if(message.title === "done"){
            this.consultaDineroCresciente();
          }
        }
      )
    } else {
      this.consultaDineroCresciente();
    }
  }

  consultaDineroCresciente(){
    this.spinnerMng.showSpinner(true);
    this.loginServices.postDineroCrecienteSP()
    .subscribe(
      res => {
        if(res.error.clave === "OK"){
          this.spinnerMng.showSpinner(false);
          if(res.dto.saldoCreciente === ""){
            this.errorService("","Recibir remuneraciones por el saldo en Dinero Creciente es otro de los beneficios de Santander Plus; contrate sin costo a través de <strong>SuperNet > Inversiones > Contratación Dinero Creciente.</strong><br/><br/>Por favor cualquier duda o aclaración comuníquese a la línea de <br/>Santander Plus al <br/>01800 0101123.", "Aceptar", "info", 1);
          } else {
            let element: HTMLElement = document.getElementById("goRoot") as HTMLElement;
            element.click();
          }
        } else {
          this.spinnerMng.showSpinner(false);
          this.errorService("Error",res.error.message, "Aceptar", "info", 0);
        }
      },
      err => {
        this.spinnerMng.showSpinner(false);
        this.errorService("Error",err.error.message, "Aceptar", "info", 0);
      }
    )
  }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    let message = new MessageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
