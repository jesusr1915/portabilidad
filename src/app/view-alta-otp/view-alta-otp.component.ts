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
    this.spinnerMng.showSpinner(true);
    this.loginServices.getOtp()
    .subscribe(
      res => {
        this.spinnerMng.showSpinner(false);
        // if(res.statusEnvio){
        //   this.router.navigate(['/status']);
        // }
      },
      err => {
        this.spinnerMng.showSpinner(false);
        console.log("ERROR");
      }
    )

  }

  reenviar(){
    this.spinnerMng.showSpinner(true);
    this.loginServices.getOtp()
    .subscribe(
      res => {
        this.spinnerMng.showSpinner(false);
      },
      err => {
        this.spinnerMng.showSpinner(false);
      }
    )
  }

  continuar(){
    this.sendAltaService();
  }

  sendAltaService(){
    this.spinnerMng.showSpinner(true);
    let body = {
      "datosEntrada" : {
        "banco" : {
          "descripcion" : "",
          "id" : localStorage.getItem('idBanco'),
          "nombreCorto" : localStorage.getItem('banco')
        },
        "cuentaBanco" : localStorage.getItem('tarjet'),
        "cuentaCliente" : localStorage.getItem("numeroCuenta"),
        "fechaNacimiento" : localStorage.getItem('rawBirthday'),
        "nombreCliente" : localStorage.getItem('name'),
        "rfcCliente" : localStorage.getItem('rfc'),
        "tipoSolicitud" : "R"
      },
      "fechaHora" : this.birthdate,
      "operacion" : "OT04",
      "tipoOTP" : "OTPM",
      "token" : this.sms,
      "idParam": "0041"
    }

    this.loginServices.postAlta(body)
    .subscribe(
      res => {
        if(res.error.clave == "OK"){
          localStorage.setItem('folio',res.dto.folio);
          localStorage.setItem('fechaOperacion',res.dto.fechaEnvio);
          localStorage.setItem('horaEnvio',res.dto.horaEnvio);
          localStorage.setItem('referenciaOperacion',res.dto.referenciaOperacion);
          this.spinnerMng.showSpinner(false);
          this.router.navigate(['/status']);
        } else {
          this.openAlert("Error",res.error.message, "Aceptar", "info", 0);
        }
      },
      err => {
        this.openAlert("Error",err.error.message, "Aceptar", "info", 0);
      }
    )

  }

  continue(){
    this.router.navigate(['/otp']);
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

  // PARA EL MENSAJE DE ERROR
  private openAlert(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
