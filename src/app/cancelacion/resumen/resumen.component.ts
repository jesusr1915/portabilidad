import { Component, OnInit } from '@angular/core';


import { PageTrack } from '../../decorators/page-track.decorator';
@PageTrack('cancelacion-resumen')
@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['../../app.component.scss','./resumen.component.scss']
})
export class ResumenComponent implements OnInit {

  bankWhereReceive: string
  accountWhereReceive: string
  bankWhereWishReceive: string
  accountWhereWishReceive: string
  tipoOperacion: string
  referenceSheet: string
  horaOperacion: string
  referenceOperation: string

  constructor() { }

  ngOnInit() {
    this.bankWhereReceive = localStorage.getItem('bankWhereReceive');
    this.accountWhereReceive = localStorage.getItem('accountWhereReceive');
    this.bankWhereWishReceive = localStorage.getItem('bankWhereWishReceive');
    this.accountWhereWishReceive = localStorage.getItem('accountWhereWishReceive');
    this.tipoOperacion = localStorage.getItem('tipoOperacion');
    this.referenceSheet = localStorage.getItem('referenceSheet');
    this.horaOperacion = localStorage.getItem('horaEnvio');
    this.referenceOperation = localStorage.getItem('referenceOperation');
    this.tipoOperacion = "Cancelación de envío de nómina";
  }

}
