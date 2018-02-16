import { Component, OnInit, Input } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { LoginService } from '../services/loginServices';
import { FormatValue } from '../tools/formatValues';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';
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
    this.stepMan.sendMessage(3,"Verifique los datos de su cuenta o tarjeta");
    this.errorService("","Para disfrutar de los beneficios de Santander Plus es indispensable tener su nómina en Santander, en caso de no tenerla debe contar con uno o varios depósitos al mes en su(s) cuenta(s) Santander.<br/><br/>Traiga su nómina a Santander sin costo ingresando desde el menú lateral a <b>SantaderPlus > Traer la nómina.</b><br/><br/>Por favor cualquier duda o aclaración comuníquese a la línea de<br/>Santander Plus al <br/>01800 0101123.", "Aceptar", "info", 0);
  }



  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
