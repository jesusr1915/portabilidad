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
    this.loadConfig();
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

  loadConfig(){
    // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
    this.spinnerMng.showSpinner(true);
    this.loginServices.getConfig()
    .subscribe(
      res => {
        localStorage.setItem('env', res.ENV_VAR);
        this.spinnerMng.showSpinner(false);
      },
      err => {
        localStorage.setItem('env', 'dev');
        this.spinnerMng.showSpinner(false);
      }
    )
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
          this.spinnerMng.showSpinner(false);
        }
      },
      err => {
        console.log(err);
        this.spinnerMng.showSpinner(false);
      }
    );
  }

}
