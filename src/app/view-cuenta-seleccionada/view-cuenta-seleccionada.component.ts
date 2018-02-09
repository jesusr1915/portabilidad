import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { StepMan } from '../stepper/stepMan';

@Component({
  selector: 'app-view-cuenta-seleccionada',
  templateUrl: './view-cuenta-seleccionada.component.html',
  styleUrls: ['../app.component.scss','./view-cuenta-seleccionada.component.scss']
})
export class ViewCuentaSeleccionadaComponent implements OnInit {

  constructor(
    private stepMan: StepMan,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.stepMan.sendMessage(2,"Confirme sus datos");
  }

  subscribe(){
    // CONECTAR CON SERVICIO DE ALTA SP
    this.router.navigate(['/resumen']);
  }

}
