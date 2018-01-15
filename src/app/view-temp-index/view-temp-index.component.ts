import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-view-temp-index',
  templateUrl: './view-temp-index.component.html',
  styleUrls: ['../app.component.scss','./view-temp-index.component.scss']
})
export class ViewTempIndexComponent implements OnInit {
  sessionValue;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  onBtnActionClickedV(){
    localStorage.setItem('sessionID',this.sessionValue);
    this.router.navigate(['TOKEN/1']);
  }

}
