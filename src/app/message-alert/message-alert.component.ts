import { Component, OnInit } from '@angular/core';
import { AlertMan } from '../message-alert/alertMan';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['../app.component.scss','../terms/terms.component.scss','./message-alert.component.scss']
})
export class MessageAlertComponent implements OnInit {
  visible = false;
  visibleAnimate = false;
  title="";
  message="";
  button="Aceptar";
  subscription: Subscription;
  icon = "";
  code = 0;
  hasAction = false;

  constructor(private messageMan: AlertMan) {
    this.subscription = this.messageMan.getMessage()
    .subscribe(
      message => {
        if(message.title !== "done"){
          this.showMessage(message.title);
        }
      }
    )
  }

  ngOnInit() {
    //this.hide();
  }

  public showMessage(title: any): void {
    this.title = title.title;
    this.message = title.body;
    this.button = title.button;
    this.code = title.code;
    this.icon = title.icon;

    if(this.code === 1){
      this.hasAction = true;
    } else {
      this.hasAction = false;
    }


    if(this.message === ""){
      this.message = "Por el momento el servicio no está disponible, por favor intente de nuevo más tarde."
    }

    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    // setTimeout(() => this.visible = false, 300);
    this.visible = false;
    if(this.code === 3){
      this.messageMan.sendMessage("done");
    }
  }
}
