import { Component, OnInit, Input } from '@angular/core';
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
  visible = false;
  @Input() valueHeader = "";
  message: number;
  subscription: Subscription;

  instructions = [
                  "Ingrese los datos de su nómina",
                  "Verifique los datos de su cuenta o tarjeta",
                  "Felicidades has completado",
                ];

  widthbar: number = 33;
  valueStep = 1;
  max_step = 3;
  valueLabelStep = "";
  constructor(private stepMan: StepMan) {
      this.subscription = this.stepMan.getMessage()
      .subscribe(
        message => {
          this.valueLabelStep = message.response.title;
          this.setStep(message.response.number);
        }
      )
  }

  ngOnInit() {

  }

  setStep(step: number){
    this.max_step = localStorage.getItem('totalSteps') !== null ? parseInt(localStorage.getItem('totalSteps')) : 3;
    if(step!=0)
    {
      this.visible = true;
      this.valueStep = step;
      //this.valueLabelStep = this.instructions[step-1];
      this.widthbar = 100*(step/this.max_step);
    }else{
      this.visible = false;
    }

  }

  // setTitle(title: string){
  //   if(title !== ""){
  //     this.
  //   }
  // }

}
