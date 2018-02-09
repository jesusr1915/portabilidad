import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/loginServices'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss','./login.component.scss']
})
export class LoginComponent implements OnInit {

  private bucValue;
  private nipValue

  constructor(private router: Router, private loginServices: LoginService) { }

  ngOnInit() {

  }

  clicLogin(){
    //let datos = {"buc": "12020573", "nip": "prueba12"}
    let datos = {"buc": this.bucValue, "nip": this.nipValue};
    this.loginServices.postLogin(datos)
    .subscribe(
      res => {
        if(res.tokenSSO !== "error")
          this.router.navigate(["/"], { queryParams: { token: res.tokenSSO } });
        else
          alert("ERROR");
      },
      err => {
        console.log(err);
      });
  }

}
