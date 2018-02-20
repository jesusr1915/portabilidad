import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/loginServices'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss','./login.component.scss']
})
export class LoginComponent implements OnInit {

  bucValue = "";
  nipValue = "";
  optValue = "";

  constructor(private router: Router, private loginServices: LoginService) { }

  ngOnInit() {

  }

  clicLogin(){
    let mPath = "";
    console.log(this.optValue);
    switch(this.optValue){
      case "portabilidad":
        mPath = "/";
        break;
      case "consulta":
        mPath = "/consulta";
        break;
      case "inscripcion":
        mPath = "/cuenta";
        break;
      case "modificacion":
        mPath = "/actualiza";
        break;
    }
    console.log(mPath);

    // let datos = {"buc": this.bucValue, "nip": this.nipValue};
    // this.loginServices.postLogin(datos)
    // .subscribe(
    //   res => {
    //     if(res.tokenSSO !== "error"){
    //       let mToken = decodeURIComponent(res.tokenSSO)
    //       let mPath = "";
    //
    //
    //       //this.router.navigate([mPath], { queryParams: { token: mToken } });
    //
    //     } else {
    //       alert("ERROR");
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }

}
