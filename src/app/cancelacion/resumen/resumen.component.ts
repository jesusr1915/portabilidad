import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit {

  bankWhereReceive: string
  accountWhereReceive: string
  bankWhereWishReceive: string
  accountWhereWishReceive: string
  tipoOperacion: string
  referenceSheet: string
  horaOperacion: string
  referenciaSupermovil: string

  constructor() { }

  ngOnInit() {
    // this.bankWhereReceive = localStorage.getItem('bankWhereReceive');
    // this.accountWhereReceive = localStorage.getItem('accountWhereReceive');
    // this.bankWhereWishReceive = localStorage.getItem('bankWhereWishReceive');
    // this.accountWhereWishReceive = localStorage.getItem('accountWhereWishReceive');
    // this.tipoOperacion = localStorage.getItem('tipoOperacion');
    // this.referenceSheet = localStorage.getItem('referenceSheet');
    // this.horaOperacion = localStorage.getItem('horaOperacion');
    // this.referenciaSupermovil = localStorage.getItem('referenciaSupermovil');
  }

}
