import { Component, OnInit, Input } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { FormatValue } from '../tools/formatValues';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['../app.component.scss','./view-status.component.scss'],
  providers: [FormatValue]
})
export class ViewStatusComponent implements OnInit {

  @Input() bankWhereWishReceive = "SANTANDER";//localStorage.getItem('banco');
  @Input() accountWhereWishReceive = localStorage.getItem("cardNumeroCuenta");
  @Input() bankWhereReceive = localStorage.getItem('banco');
  @Input() accountWhereReceive =  localStorage.getItem('tarjet');
  @Input() referenceSheet =  localStorage.getItem('folio');
  @Input() dateOperation;
  @Input() referenceOperation = localStorage.getItem('referenciaOperacion');
  @Input() hoursOperation = localStorage.getItem('horaEnvio');

  constructor(
    private _stepMan : StepMan,
    private _utils : FormatValue
  ) {
    //this.dateOperation = this._utils.formatDate(localStorage.getItem('fechaOperacion'),"-","aammdd");
    this.dateOperation = localStorage.getItem('fechaOperacion');
  }

  ngOnInit() {
    this._stepMan.sendMessage(0,"Portabilidad de Nómina");
  }

}
