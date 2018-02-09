import { Component, OnInit, Input } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { FormatValue } from '../tools/formatValues';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-resumen-inscripcion',
  templateUrl: './view-resumen-inscripcion.component.html',
  styleUrls: ['../app.component.scss','./view-resumen-inscripcion.component.scss'],
  providers: [FormatValue]
})
export class ViewResumenInscripcionComponent implements OnInit {

  @Input() accountSelected = localStorage.getItem("insCtaSel")
  @Input() operation = localStorage.getItem("insOperation")
  @Input() dateOperation = localStorage.getItem("insDateOperation")
  @Input() hoursOperation = localStorage.getItem("inshoursOperation")
  @Input() reference = localStorage.getItem("insReference")
  @Input() reception = localStorage.getItem("insReception")

  constructor(
    private _stepMan : StepMan,
    private _utils : FormatValue,
    private router: Router
  ) { }

  ngOnInit() {
  }

}
