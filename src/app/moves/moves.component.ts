import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

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

  @Input() imagePath;
  classDelivery;
  origen: string = "";
  destino: string = "";
  bancoOrigen: string = "";
  bancoDestino: string = "";

  constructor(private router: Router) { }

  ngOnInit() {
    if(this.valueTipoSolicitud=="R"){
      this.classDelivery = "rejected";
      this.imagePath="assets/imgs/arrow-green.svg";
    }else{
      this.classDelivery = "accept";
      this.imagePath="assets/imgs/arrow-orange.svg";
    }

    if(this.tipoSolicitud == "R"){
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

  verDetalle(){
    console.log("VIENDO DETALLE...");
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
    this.router.navigate(['/detalleConsulta']);
  }

}
