import { Component, OnInit, ElementRef } from '@angular/core';
import { MenuMsg } from '../menu/menuMsg';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  estadoActivo1 = false;
  estadoActivo2 = false;
  estadoActivo3 = false;
  constructor(
    private _menuMan : MenuMsg
  ) {
  }

  ngOnInit() {

  }
  onClick(reference : number){
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

}
