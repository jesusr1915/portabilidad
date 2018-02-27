import { Component, OnInit, ElementRef } from '@angular/core';
import { MenuMsg } from '../menu/menuMsg';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  subscription: Subscription;
  estadoActivo1 = false;
  estadoActivo2 = false;
  estadoActivo3 = false;
  visible = false;
  constructor(
    private _menuMan : MenuMsg
  ) {

  }

  ngOnInit() {
    this.subscription = this._menuMan.getMessage()
    .subscribe(
      message => {
        this.setButtons(message.response);
      }
    )
    // this.onClick(1);
  }

  setButtons(reference : number){
    this.estadoActivo1 = false;
    this.estadoActivo2 = false;
    this.estadoActivo3 = false;
    if(reference == 1){
      this.estadoActivo1 = true;
    }else if(reference == 2){
      this.estadoActivo2 = true;
    }else if(reference == 3){
      this.estadoActivo3 = true;
    }
  }

  onClick(reference : number){
    this.setButtons(reference)
    this._menuMan.sendMessage(reference);
  }

}
