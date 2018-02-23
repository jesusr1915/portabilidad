import { Component, OnInit, Input } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { FormatValue } from '../tools/formatValues';
import { Router, RouterModule, Routes, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['../app.component.scss','./view-status.component.scss'],
  providers: [FormatValue]
})
export class ViewStatusComponent implements OnInit {

  @Input() bankWhereWishReceive; // = localStorage.getItem('banco');
  @Input() accountWhereWishReceive = localStorage.getItem("cardNumeroCuenta");
  @Input() bankWhereReceive = localStorage.getItem('banco');
  @Input() accountWhereReceive =  localStorage.getItem('tarjet');
  @Input() referenceSheet =  localStorage.getItem('folio');
  @Input() dateOperation;
  @Input() referenceOperation = localStorage.getItem('referenciaOperacion');
  @Input() hoursOperation = localStorage.getItem('horaEnvio');

  constructor(
    private _stepMan : StepMan,
    private _utils : FormatValue,
    private router: Router
  ) {
    //this.dateOperation = this._utils.formatDate(localStorage.getItem('fechaOperacion'),"-","aammdd");
    this.dateOperation = localStorage.getItem('fechaOperacion');
    this.bankWhereWishReceive = "SANTANDER";
  }

  ngOnInit() {
    this._stepMan.sendMessage(0,"");
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

  onBtnActionClickedV(){
    localStorage.setItem('backButton', "true");
    //let homePage = "/consulta")
    this.router.navigate(["/consulta"]);
  }

}
