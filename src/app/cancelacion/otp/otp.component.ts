import { Component, OnInit } from '@angular/core';
import { StepMan } from '../../stepper/stepMan';
import { SpinnerMan } from '../../spinner-component/spinnerMng';
import { AlertMan , MessageAlert } from '../../message-alert/alertMan';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../services/loginServices';
import { MainService } from '../../services/main.service';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss','../../view-alta-otp/view-alta-otp.component.scss']
})
export class OtpComponent  implements OnInit {

  validCode = false;
  validDate = false;
  public sms:string = "";
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
    private mainService: MainService,
    public spinnerMng : SpinnerMan
  ) { }

  ngOnInit() {
    this.stepMan.sendMessage(3,"Lo estamos autenticando");
    this.spinnerMng.showSpinner(true);
    this.loginServices.getOtp()
    .subscribe(
      res => {
        this.spinnerMng.showSpinner(false);
      },
      err => {
        this.spinnerMng.showSpinner(false);

        if(err.error === "access_denied"){
          // SERVICIO QUE OBTIENE EL TOKEN OATUH PARA CONSUMIR SERVICIOS
          this.loginServices.postOAuthToken()
          .subscribe(
            res2 => {
              this.loginServices.getOtp()
              .subscribe(
                res3 => {
                  this.spinnerMng.showSpinner(false);
                },
                err3 => {
                  this.spinnerMng.showSpinner(false);
                }
              )
            },
            err2 => {
              this.mainService.showAlert({
                title: "Error",
                body: "Por el momento el servicio no está disponible, por favor intente más tarde",
                buttonAccept: "Aceptar"
              });
            }
          )
        }
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
        this.mainService.showAlert({
          title: "Error",
          body: "Por el momento el servicio no está disponible, por favor intente más tarde",
          buttonAccept: "Aceptar"
        });
        this.spinnerMng.showSpinner(false);
      }
    )
  }

  validateField(type: string){
    if(type === "code"){
      this.sms = this.sms.toString().replace(/[^0-9]/g, '');
      // console.log(this.sms);
      if(this.sms.length === 8){
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
          "nombreCorto" : localStorage.getItem('bankWhereReceive')
        },
        "cuentaBanco" : localStorage.getItem('accountWhereReceive'),
        "cuentaCliente" : localStorage.getItem("numeroCuenta"),
        "fechaNacimiento" : localStorage.getItem('rawBirthday'),
        "nombreCliente" : localStorage.getItem('name'),
        "rfcCliente" : localStorage.getItem('rfc'),
        "tipoSolicitud" : "R",
        "folio": localStorage.getItem("referenceSheet")
      },
      "fechaHora" : "",
      "operacion" : "PNCA",
      "tipoOTP" : "CT",
      "token" : localStorage.getItem('token'),
      "idParam": ""
    }

    this.loginServices.postAlta(body)
    .subscribe(
      res => {
        if(res.error.clave === "OK"){
          localStorage.setItem('folio',res.dto.folio);
          localStorage.setItem('fechaOperacion',res.dto.fechaEnvio);
          localStorage.setItem('horaEnvio',res.dto.horaEnvio);
          localStorage.setItem('referenciaOperacion',res.dto.referenciaOperacion);
          this.spinnerMng.showSpinner(false);
          this.router.navigate(['/cancelacion/resumen']);
        } else {
          this.mainService.showAlert({
            title: "Error",
            body: "Por el momento el servicio no está disponible, por favor intente más tarde",
            buttonAccept: "Aceptar"
          });
        }
      },
      err => {
        if(err.error.message){
          this.mainService.showAlert({
            title: "Error",
            body: err.error.message,
            buttonAccept: "Aceptar"
          });
        } else {
          if(err.error === "access_denied" || err.error === "expired_access_token"){
            // SERVICIO QUE OBTIENE EL TOKEN OATUH PARA CONSUMIR SERVICIOS
            this.loginServices.postOAuthToken()
            .subscribe(
              res2 => {
                this.sendAltaService()
              },
              err2 => {
                this.mainService.showAlert({
                  title: "Error",
                  body: "Por el momento el servicio no está disponible, por favor intente más tarde",
                  buttonAccept: "Aceptar"
                });
              }
            )
          }
        }

      }
    )
  }

}
