import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { FormatValue } from '../tools/formatValues';
import { Router, RouterModule, Routes, ActivatedRoute, NavigationEnd } from '@angular/router';
import { PageTrack } from '../decorators/page-track.decorator';
import { AnalyticsService } from '../services/analytics.service';
@PageTrack('portabilidad-resumen')
@Component({
  selector: 'app-view-alta-status',
  templateUrl: './view-alta-status.component.html',
  styleUrls: ['../app.component.scss','./view-alta-status.component.scss'],
  providers: [FormatValue]
})
export class ViewAltaStatusComponent implements OnInit, OnDestroy {

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
    private router: Router,
    private analyticsService: AnalyticsService
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
  ngOnDestroy(){
    this.analyticsService.enviarMetrica('portabilidadConfirmada', 1);
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
