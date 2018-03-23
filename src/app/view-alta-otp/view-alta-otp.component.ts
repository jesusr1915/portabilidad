import { Component, OnInit } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { SpinnerMan } from '../spinner-component/spinnerMng';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/loginServices'

@Component({
  selector: 'app-view-alta-otp',
  templateUrl: './view-alta-otp.component.html',
  styleUrls: ['./view-alta-otp.component.scss',
              '../app.component.scss']
})
export class ViewAltaOtpComponent implements OnInit {

  validCode = false;
  validDate = false;
  public sms = "";
  public birthdate = "";
  body = {
    "idModulo": "SMOV",
    "idParam": "0041"
  }

  constructor(
    private loginServices: LoginService,
    private stepMan: StepMan,
    private alertMan: AlertMan,
    private router: Router,
    public spinnerMng : SpinnerMan
  ) { }

  ngOnInit() {
    this.stepMan.sendMessage(3,"Lo estamos autenticando");
  }

  reenviar(){
    this.loginServices.getOtp()
  }

  continuar(){
    this.loginServices.getOtp()
    .subscribe(
      res => {
        if(res.statusEnvio){
          this.router.navigate(['/status']);
        }
      },
      err => {
        console.log("ERROR");
      }
    )
  }

  validateField(type: string){
    if(type === "code"){
      this.sms = this.sms.toString().replace(/[^0-9]/g, '');
      if(this.sms.length == 8){
        this.validCode = true;
      } else {
        this.validCode = false;
      }
    } else {
      if(this.birthdate.length === 10){
        this.validDate = true;
      } else {
        this.validDate = false;
      }
    }
  }

  isInvalid(){
    if (this.validCode && this.validDate){
      return false;
    }
    return true;
  }

}
