import { Component, OnInit } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { Subscription } from 'rxjs/Subscription';
import { MenuMsg } from '../menu/menuMsg';
import { LoginService } from '../services/loginServices'
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { MessageMan } from '../cards/messageMan';


@Component({
  selector: 'app-view-consulta',
  templateUrl: './view-consulta.component.html',
  styleUrls: ['../app.component.scss','./view-consulta.component.scss']
})
export class ViewConsultaComponent implements OnInit {

  subscription: Subscription;
  constructor(
    private _stepMan : StepMan,
    private loginServices: LoginService,
    private _menuMan : MenuMsg,
    private alertMan: AlertMan,
    private messageMan: MessageMan

  ) {
    this.subscription = this._menuMan.getMessage()
    .subscribe(
      message => {
        console.log(message);
      }
    )
  }

  ngOnInit() {
    localStorage.clear();
    this._stepMan.sendMessage(0,"Consulta solicitud portabilidad");
    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {
        this.loginServices.getSaldos()
        .subscribe(
          res => {
            this.messageMan.sendMessage(res);
          },
          err => {
            this.errorService();
            console.log('Something went wrong!' + err.message);
          }
        );
      },
      err => {
          this.errorService();
          console.log('Something went wrong!' + err.message);
      }
    );
  }
  private errorService(){
    var message = new messageAlert("Error","Por el momento el servicio no esta disponible");
    this.alertMan.sendMessage(message);
  }

}
