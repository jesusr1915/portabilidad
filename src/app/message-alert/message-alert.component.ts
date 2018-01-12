import { Component, OnInit } from '@angular/core';
import { AlertMan } from '../message-alert/alertMan';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['../app.component.scss','../terms/terms.component.scss','./message-alert.component.scss']
})
export class MessageAlertComponent implements OnInit {
  public visible = false;
  private visibleAnimate = false;
  private title="";
  private message="";
  private button="Aceptar";
  private subscription: Subscription;
  private icon = "";

  constructor(private messageMan: AlertMan) {
    this.subscription = this.messageMan.getMessage()
    .subscribe(
      message => {
        this.shower(message.title);
      }
    )
  }

  ngOnInit() {
    //this.hide();
  }
  public shower(title: any): void {
    this.title = title.title;
    this.message = title.body;
    this.button = title.button;
    if(title.icon == "info")
      this.icon = "assets/imgs/ico-info.svg";
    else if(title.icon == "error")
      this.icon = "assets/imgs/ico-warnning.svg";
    else
      this.icon = "assets/imgs/ico-warnning.svg";
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }
}
