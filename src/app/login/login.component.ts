import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/loginServices'
import { Router } from '@angular/router';
import { SpinnerMan } from '../spinner-component/spinnerMng';
import { AlertMan , MessageAlert } from '../message-alert/alertMan';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss','./login.component.scss']
})
export class LoginComponent implements OnInit {

  bucValue = "";
  nipValue = "";
  mPath = "";
  mVersion = "v1.0.0";

  constructor(
    private router: Router,
    private alertMan: AlertMan,
    private loginServices: LoginService,
    public spinnerMng : SpinnerMan
) { }

  ngOnInit() {
    localStorage.clear();
    this.loadConfig();
  }

  setOption(selected){
    // console.log(selected);
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
      default:
        this.mPath = "/";
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
        localStorage.setItem('version', res.VERSION);
        localStorage.setItem('dom', res.ENV_DOM);
        this.mVersion = "v" + res.VERSION;
        this.spinnerMng.showSpinner(false);
      },
      err => {
        localStorage.setItem('env', 'pre');
        localStorage.setItem('version', "v1.0.0");
        localStorage.setItem('dom', 'corp');
        this.spinnerMng.showSpinner(false);
      }
    )
  }

  clicLogin(){
    this.spinnerMng.showSpinner(true);
    this.loginServices.postOAuthToken()
    .subscribe(
      res => {
        let datos = {"buc": this.bucValue, "nip": this.nipValue};
        this.loginServices.postLogin(datos)
        .subscribe(
          res => {
            if(res.tokenSSO !== "error"){
              let mToken = decodeURIComponent(res.tokenSSO)
              if(res.tokenSSO === ""){
                localStorage.setItem('sessionID', res.Cookie.substring(11));
              }
              this.spinnerMng.showSpinner(false);
              // console.log(res.tokenSSO);
              this.router.navigate([this.mPath], { queryParams: { token: mToken, demo: 1 } });
            } else {
              this.openAlert("Error", "", "Aceptar", "", 0);
              this.spinnerMng.showSpinner(false);
            }
          },
          err => {
            // console.log(err);
            this.spinnerMng.showSpinner(false);
          }
        );
      },
      err => {
        this.spinnerMng.showSpinner(false);
      }
    )
  }

  // PARA EL MENSAJE DE ERROR
  private openAlert(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    let message = new MessageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
