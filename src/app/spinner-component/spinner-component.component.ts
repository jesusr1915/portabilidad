import { Component, OnInit } from '@angular/core';
import { SpinnerMan } from '../spinner-component/spinnerMng';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-spinner-component',
  templateUrl: './spinner-component.component.html',
  styleUrls: ['../app.component.scss','../terms/terms.component.scss','./spinner-component.component.scss']
})
export class SpinnerComponentComponent implements OnInit {

  public visible = false;
  private visibleAnimate = false;
  private subscription: Subscription;

  constructor(private messageMan: SpinnerMan) {
    this.subscription = this.messageMan.getMessage()
    .subscribe(
      message => {
        if(message.action){
          this.show();
        }else{
          this.hide();
        }
      }
    )
  }

  ngOnInit() {
  }

  public show() : void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }
  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }
}
