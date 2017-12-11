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

  totalMov =[];
  allMov = [
    {
      'date':'Sábado 05 de Diciembre, 2015',
      'bills':[
        {
          'origin':'072012345678912345',
          'destination':'89**8753',
          'status' : 'ACEPTADA',
          'delivery': 'E'
        },
        {
          'origin':'654985427789008987',
          'destination':'56**6011',
          'status' : 'RECHAZADA',
          'delivery': 'R'
        }
      ]
    },
    {
      'date':'Sábado 06 de Diciembre, 2015',
      'bills':[
        {
          'origin':'98483920976581',
          'destination':'56**7644',
          'status' : 'RECHAZADA',
          'delivery': 'R'
        }
      ]
    }];
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
        this.filterMoves(message.response);
      }
    )
  }

  ngOnInit() {
  //  localStorage.clear();
    this._stepMan.sendMessage(0,"Consulta solicitud portabilidad");
    /*this.loginServices.postOAuthToken()
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
    );*/
  }
  private errorService(){
    var message = new messageAlert("Error","Por el momento el servicio no esta disponible");
    this.alertMan.sendMessage(message);
  }
  private filterMoves(idBtn:number){
    this.totalMov = [];
    let localDelivery = ""
    switch (idBtn){
      case 1:{
        this.totalMov = this.allMov;
        localDelivery = "A"
      }
      break;
      case 2:{
        localDelivery = "R"
      }
      break;
      case 3:{
        localDelivery = "E"
      }
      break;
      default: {
      break;
      }

    }
    for(let moves of this.allMov){
      let newMove = {
        'date': moves.date,
        'bills':[]
      };
      for(let bill of moves.bills){
        if(bill.delivery == localDelivery){
          newMove.bills.push(bill);
        }
      }
      if(newMove.bills.length >0){
        this.totalMov.push(newMove);
      }
    }
  }

}
