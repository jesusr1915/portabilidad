import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare let ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  constructor(public router: Router){
    this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            ga('set', 'page', event.urlAfterRedirects);
            ga('send', 'pageview');
          }
        });
    }
}
