import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/loginServices'
import { Router } from '@angular/router';
import { SpinnerMan } from '../spinner-component/spinnerMng';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss','./login.component.scss']
})
export class LoginComponent implements OnInit {

  bucValue = "";
  nipValue = "";
  mPath = "";

  constructor(
    private router: Router,
    private loginServices: LoginService,
    public spinnerMng : SpinnerMan
) { }

  ngOnInit() {

  }

  setOption(selected){
    console.log(selected);
    switch(selected){
      case "1":
        this.mPath = "/";
        break;
      case "2":
        this.mPath = "/consulta";
        break;
      case "3":
        this.mPath = "/cuenta";
        break;
      case "4":
        this.mPath = "/actualiza";
        break;
    }
  }

  clicLogin(){
    this.spinnerMng.showSpinner(true);
    let datos = {"buc": this.bucValue, "nip": this.nipValue};
    this.loginServices.postLogin(datos)
    .subscribe(
      res => {
        if(res.tokenSSO !== "error"){
          let mToken = decodeURIComponent(res.tokenSSO)
          this.router.navigate([this.mPath], { queryParams: { token: mToken } });
          this.spinnerMng.showSpinner(false);
        } else {
          alert("ERROR");
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
