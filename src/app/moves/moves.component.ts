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

  @Input() imagePath;
  classDelivery;

  constructor(private router: Router) { }

  ngOnInit() {
    if(this.valueTipoSolicitud=="R"){
      this.classDelivery = "rejected";
      this.imagePath="assets/imgs/arrow-green.svg";
    }else{
      this.classDelivery = "accept";
      this.imagePath="assets/imgs/arrow-orange.svg";
    }
  }

  verDetalle(){
    console.log("VIENDO DETALLE...");
    localStorage.setItem('accountWhereWishReceive',this.accountWhereWishReceive);
    localStorage.setItem('bankWhereWishReceive',this.bankWhereWishReceive);
    localStorage.setItem('accountWhereReceive',this.accountWhereReceive);
    localStorage.setItem('bankWhereReceive',this.bankWhereReceive);
    localStorage.setItem('referenceSheet',this.referenceSheet);
    localStorage.setItem('dateOperation',this.dateOperation);
    localStorage.setItem('hoursOperation',this.hoursOperation);
    localStorage.setItem('referenceOperation',this.referenceOperation);
    localStorage.setItem('dateAcceptance',this.dateAcceptance);
    localStorage.setItem('rejectionMotive',this.rejectionMotive);
    this.router.navigate(['/detalleConsulta']);
  }

}
