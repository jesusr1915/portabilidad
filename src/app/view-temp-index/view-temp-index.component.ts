import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-temp-index',
  templateUrl: './view-temp-index.component.html',
  styleUrls: ['../app.component.scss','./view-temp-index.component.scss']
})
export class ViewTempIndexComponent implements OnInit {
  sessionValue;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }
  onBtnActionClickedV(){
    localStorage.setItem('sessionID', this.sessionValue);
    this.router.navigate(['/cliente'],{queryParams: {token: 'TOKEN'}});
    //token=Qi7CMDaXY%2Bi324OcY%2BwIg4V50ad7zJ6Gc5AMOV8sySdkb7fbxYh2fRPRE%2BPAfZtjEDE%2FTFGRiLhCNU4CNkgGEK35ngFuu8YvcTRpb%2BaGCa6205cAhUbyYHa24bwNnSBu7YKQx%2BajcETuaXjRnxM5BJBibJeBrePLXq4gY7yQI9hy2KiJ%2B250RADW1khjQ4lU4Js19tLdqWd1Y7NuuxN1XUBeTv%2BIqGAT6H2d4s2%2BB45qXb7V76diGlRdCiwr1Z944OAZAUZKXuliZIeGuZ6e6dMsnyUN0q1vnvX9hMqE%2FHqpu0mkE8iRi%2B9p2MjHAZULz6LjWDOqi%2BsoTlkFIiKQtQ%3D%3D
  }

}
