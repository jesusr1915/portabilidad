import { Component, OnInit, Input } from '@angular/core';
import { StepMan } from '../stepper/stepMan';


@Component({
  selector: 'app-view-detalle-solicitud',
  templateUrl: './view-detalle-solicitud.component.html',
  styleUrls: ['../app.component.scss','../view-status/view-status.component.scss','./view-detalle-solicitud.component.scss']
})
export class ViewDetalleSolicitudComponent implements OnInit {

  @Input () valueStatus = "Aceptada";

  constructor(
    private _stepMan : StepMan,
  ) { }

  ngOnInit() {
    this._stepMan.sendMessage(0,"Detalle solicitud portabilidad");
  }

}
