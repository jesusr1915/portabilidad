import { Component, OnInit, Input } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { LoginService } from '../services/loginServices';
import { FormatValue } from '../tools/formatValues';
import { Router, RouterModule, Routes, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AlertMan , messageAlert } from '../message-alert/alertMan';

@Component({
  selector: 'app-view-cuenta-resumen',
  templateUrl: './view-cuenta-resumen.component.html',
  styleUrls: ['../app.component.scss','./view-cuenta-resumen.component.scss'],
  providers: [FormatValue]
})
export class ViewCuentaResumenComponent implements OnInit {

  @Input() accountWhereWishReceive = localStorage.getItem("cardNumeroCuenta");
  @Input() dateOperation;
  @Input() referenceOperation = localStorage.getItem('referenciaOperacion');
  @Input() hoursOperation = localStorage.getItem('horaEnvio');

  constructor(
    private stepMan : StepMan,
    private loginServices: LoginService,
    private _utils : FormatValue,
    private router: Router,
    private alertMan: AlertMan
  ) {
    this.dateOperation = localStorage.getItem('fechaOperacion');
  }

  ngOnInit() {
    this.stepMan.sendMessage(0,"");
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
  }

  ngAfterViewInit(){
    let element: HTMLElement = document.getElementById("something") as HTMLElement;
    element.click();
  }

  finalizar(){
    this.router.navigate(['/bienvenida']);
  }


  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
