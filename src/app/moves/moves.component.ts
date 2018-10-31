import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['../app.component.scss','./moves.component.scss']
})
export class MovesComponent implements OnInit {

  @Input() valueCuentaBanco;
  @Input() valueCuentaCliente;
  @Input() valueEstatus;
  @Input() valueTipoSolicitud;

  @Input() accountWhereWishReceive;
  @Input() bankWhereWishReceive;
  @Input() accountWhereReceive;
  @Input() bankWhereReceive;
  @Input() referenceSheet;
  @Input() dateOperation;
  @Input() hoursOperation;
  @Input() referenceOperation;
  @Input() dateAcceptance;
  @Input() rejectionMotive;
  @Input() tipoSolicitud;
  @Input() originOperation;

  @Input() imagePath;
  classDelivery;
  origen: string = "";
  destino: string = "";
  bancoOrigen: string = "";
  bancoDestino: string = "";

  constructor(
    private router: Router,
    private mainService: MainService
  ) { }

  ngOnInit() {
    if(this.valueTipoSolicitud=="R"){
      this.classDelivery = "rejected";
      this.imagePath="assets/imgs/arrow-green.svg";
    }else{
      this.classDelivery = "accept";
      this.imagePath="assets/imgs/arrow-orange.svg";
    }

    if(this.tipoSolicitud === "R"){
      this.origen = this.accountWhereReceive
      this.destino = this.accountWhereWishReceive
      this.bancoOrigen = this.bankWhereReceive
      this.bancoDestino = "SANTANDER"
    } else {
      this.origen = this.accountWhereWishReceive
      this.destino = this.accountWhereReceive
      this.bancoOrigen = "SANTANDER"
      this.bancoDestino = this.bankWhereReceive
    }
  }

  setValues(){
    localStorage.setItem('accountWhereWishReceive',this.destino);
    localStorage.setItem('bankWhereWishReceive',this.bancoDestino);
    localStorage.setItem('accountWhereReceive',this.origen);
    localStorage.setItem('bankWhereReceive',this.bancoOrigen);
    localStorage.setItem('referenceSheet',this.referenceSheet);
    localStorage.setItem('dateOperation',this.dateOperation);
    localStorage.setItem('hoursOperation',this.hoursOperation);
    localStorage.setItem('referenceOperation',this.referenceOperation);
    localStorage.setItem('dateAcceptance',this.dateAcceptance);
    localStorage.setItem('rejectionMotive',this.rejectionMotive);
    localStorage.setItem('tipoSolicitud',this.tipoSolicitud);
    localStorage.setItem('originOperation', this.originOperation);
    localStorage.setItem('valueEstatus', this.valueEstatus);
  }

  verDetalle(valueEstatus: any){
    this.router.navigate(['/detalleConsulta']);
  }

  cancelaPorta(item: any){
    this.setValues();
    this.mainService.showAlert({
      title: "Cancelación de envío de nómina",
      body: "Está a punto de cancelar el envío de nómina que había solicitado.<br/><br/>Banco Santander realizará, sin costo, el regreso de su nómina a la cuenta que usted elija.",
      buttonAccept: "Aceptar",
      buttonCancel: "Cancelar",
      item: null
    })
  }

}
