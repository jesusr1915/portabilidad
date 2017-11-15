import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { StepMan } from './stepMan';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['../app.component.scss',
  './stepper.component.scss'
              ]
})
export class StepperComponent implements OnInit {

  message: number;
  subscription: Subscription;

  instructions = [
                  "Seleccione una cuenta",
                  "Verifique su información",
                  "Felicidades has completado"
                ];

  widthbar: number = 33;
  value_step = 1;
  max_step = 3;
  value_label_step = "";
  constructor(private stepMan: StepMan) {
      this.subscription = this.stepMan.getMessage()
      .subscribe(
        message => {
          this.setStep(message.response);
        }
      )
  }

  ngOnInit() {

  }

  setStep(step: number){
    this.value_step = step;
    this.value_label_step = this.instructions[step-1];
    this.widthbar = 100*(step/this.max_step);
  }

}
