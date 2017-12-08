import { Component, OnInit, ElementRef } from '@angular/core';
import { MenuMsg } from '../menu/menuMsg';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  classStatus = "desactive";
  classActive = "active";
  classDesactive = "desactive";
  constructor(
    private _menuMan : MenuMsg
  ) {
  }

  ngOnInit() {

  }
  onClick(reference : ElementRef){
    console.log(reference);
    this._menuMan.sendMessage(1);
  }

}
