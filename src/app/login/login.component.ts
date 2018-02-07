import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/loginServices'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss','./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginServices: LoginService) { }

  ngOnInit() {
    let datos = {"buc": "12020573", "nip": "prueba12"}
    this.loginServices.postLogin(datos)
    .subscribe(
      res => {
        this.router.navigate(['/?token=' + res.tokenSSO]);
      },
      err => {
        console.log(err);
      })
  }

}
