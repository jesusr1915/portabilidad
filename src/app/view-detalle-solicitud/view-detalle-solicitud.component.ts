import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { StepMan } from '../stepper/stepMan';


@Component({
  selector: 'app-view-detalle-solicitud',
  templateUrl: './view-detalle-solicitud.component.html',
  styleUrls: ['../app.component.scss','../view-status/view-status.component.scss','./view-detalle-solicitud.component.scss']
})
export class ViewDetalleSolicitudComponent implements OnInit {

  @Input () valueStatus = "Aceptada";
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

  constructor(
    private _stepMan : StepMan,
    private router: Router
  ) { }

  ngOnInit() {
    this._stepMan.sendMessage(0,"Detalle solicitud portabilidad");

    this.accountWhereWishReceive = localStorage.getItem('accountWhereWishReceive');
    this.bankWhereWishReceive = "SANTANDER"; //localStorage.getItem('bankWhereWishReceive');
    this.accountWhereReceive = localStorage.getItem('accountWhereReceive');
    this.bankWhereReceive = localStorage.getItem('bankWhereReceive');
    this.referenceSheet = localStorage.getItem('referenceSheet');
    this.dateOperation = localStorage.getItem('dateOperation');
    this.hoursOperation = localStorage.getItem('hoursOperation');
    this.referenceOperation = localStorage.getItem('referenceOperation');
    this.dateAcceptance = localStorage.getItem('dateAcceptance');
    if(localStorage.getItem('backButton') !== undefined && localStorage.getItem('backButton') !== null){
      this.rejectionMotive = localStorage.getItem('rejectionMotive')
    } else {
      this.rejectionMotive = "";
    }

  }

  goBack(){
    this.router.navigate(['/consulta']);
  }

}
