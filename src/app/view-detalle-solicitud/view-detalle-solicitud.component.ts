import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { StepMan } from '../stepper/stepMan';


@Component({
  selector: 'app-view-detalle-solicitud',
  templateUrl: './view-detalle-solicitud.component.html',
  styleUrls: ['../app.component.scss','../view-alta-status/view-alta-status.component.scss','./view-detalle-solicitud.component.scss']
})
export class ViewDetalleSolicitudComponent implements OnInit {

  @Input() valueStatus = "Aceptada";
  accountWhereWishReceive = "";
  bankWhereWishReceive = "";
  accountWhereReceive = "";
  bankWhereReceive = "";
  referenceSheet = "";
  dateOperation = "";
  hoursOperation = "";
  referenceOperation = "";
  dateAcceptance = "";
  rejectionMotive = "";
  hiderejectionMotive = false;
  tipoSolicitud = "";
  envres = "";
  originOperation = "";
  imgStatus = "assets/imgs/ico-cta-exitosa.svg";
  classStatus = "aceptada"

  constructor(
    private _stepMan : StepMan,
    private router: Router
  ) { }

  ngOnInit() {
    this._stepMan.sendMessage(0,"Detalle solicitud portabilidad");


    this.accountWhereWishReceive = localStorage.getItem('accountWhereWishReceive');
    this.bankWhereWishReceive = localStorage.getItem('bankWhereWishReceive');
    this.accountWhereReceive = localStorage.getItem('accountWhereReceive');
    this.bankWhereReceive = localStorage.getItem('bankWhereReceive');
    this.referenceSheet = localStorage.getItem('referenceSheet');
    this.dateOperation = localStorage.getItem('dateOperation');
    this.hoursOperation = localStorage.getItem('hoursOperation');
    this.referenceOperation = localStorage.getItem('referenceOperation');
    this.dateAcceptance = localStorage.getItem('dateAcceptance');
    this.originOperation = localStorage.getItem('originOperation') === "RI" ? "INTERNET" : "SUCURSAL"
    if(localStorage.getItem('rejectionMotive') !== "undefined" && localStorage.getItem('rejectionMotive') !== undefined && localStorage.getItem('rejectionMotive') !== null){
      this.rejectionMotive = localStorage.getItem('rejectionMotive')
      this.hiderejectionMotive = false;
    } else {
      this.hiderejectionMotive = true;
    }

    this.tipoSolicitud = localStorage.getItem('tipoSolicitud');
    if(this.tipoSolicitud == "R"){
      this.envres = "RECEPCIÓN"
    } else {
      this.envres = "ENVÍO"
    }
    this.valueStatus = localStorage.getItem('valueEstatus');
    if(this.valueStatus === "RECHAZADA"){
      this.imgStatus = "assets/imgs/ico-rechazada.svg";
      this.classStatus = "rechazada";
    } else  {
      this.imgStatus = "assets/imgs/ico-cta-exitosa.svg";
      this.classStatus = "aceptada";
    }
    console.log("DETALLE SOLICITUD")

  }

  goBack(){
    this.router.navigate(['/consulta']);
  }

}
