import { Component, OnInit } from '@angular/core';
import { StepMan } from '../stepper/stepMan';


@Component({
  selector: 'app-view-consulta',
  templateUrl: './view-consulta.component.html',
  styleUrls: ['../app.component.scss','./view-consulta.component.scss']
})
export class ViewConsultaComponent implements OnInit {

  constructor(
    private _stepMan : StepMan
  ) { }

  ngOnInit() {
    this._stepMan.sendMessage(0,"Consulta solicitud portabilidad");
  }

}
