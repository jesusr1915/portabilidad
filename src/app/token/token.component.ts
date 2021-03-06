import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TokenMng } from '../token/tokenMng';
import { LoginService } from '../services/loginServices';
import { AlertMan , MessageAlert } from '../message-alert/alertMan';
import { Router, NavigationEnd } from '@angular/router';
import { SpinnerMan } from '../spinner-component/spinnerMng';


@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['../app.component.scss','../terms/terms.component.scss','../message-alert/message-alert.component.scss','./token.component.scss']
})
export class TokenComponent implements OnInit {

  @Output() saveToken: EventEmitter<any> = new EventEmitter<any>();

  visible = false;
  visibleAnimate = false;

  classLabel = 'showLabel';
  tokenMask = "";
  maxLength = 4;
  tokenValue = "";
  btnState = 'disableBtn';
  tokenType = "";
  tokenLength = 0;
  currentToken = "";

  title = "";
  message = "";
  valuePlaceHolderClabe = "";

  subscription: Subscription;

  constructor(
    private tokenMng: TokenMng,
    private loginServices: LoginService,
    private alertMan: AlertMan,
    private router: Router,
    public spinnerMng : SpinnerMan
  ) {

    this.tokenType = localStorage.getItem("ttkn");

    //if(this.tokenType === "0"){
      this.title = "Esta operación requiere de autorización de Token físico. Ingrese el NIP dinámico generado por su dispositivo Token.";
      this.message = "NIP dinámico Token";
      this.valuePlaceHolderClabe = "Número de 8 dígitos";
      this.tokenLength = 8;
      this.maxLength = 8;
    //}


    this.subscription = this.tokenMng.getMessage()
    .subscribe(
      message => {
        this.show();
      }
    )
  }

  ngOnInit() {
    this.hide();
  }
  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }
  public isValid(){
    if(this.tokenMask.length === this.tokenLength){
      // this.spinnerMng.showSpinner(true);
      localStorage.setItem('token', this.tokenMask);
      this.hide();
      this.saveToken.emit();

      // let body = {
      //   "datosEntrada" : {
      //     "banco" : {
      //       "descripcion" : "",
      //       "id" : localStorage.getItem('idBanco'),
      //       "nombreCorto" : localStorage.getItem('banco')
      //     },
      //     "cuentaBanco" : localStorage.getItem('tarjet'),
      //     "cuentaCliente" : localStorage.getItem("numeroCuenta"),
      //     "fechaNacimiento" : localStorage.getItem('rawBirthday'),
      //     "nombreCliente" : localStorage.getItem('name'),
      //     "rfcCliente" : localStorage.getItem('rfc'),
      //     "tipoSolicitud" : "R"
      //   },
      //   "fechaHora" : "",
      //   "operacion" : "PNAR",
      //   "tipoOTP" : "",
      //   "token" : this.tokenMask,
      //   "idParam": ""
      // }

      // this.loginServices.postAlta(body)
      // .subscribe(
      //   res => {
      //     if(res.error.clave === "OK"){
      //       localStorage.setItem('folio',res.dto.folio);
      //       localStorage.setItem('fechaOperacion',res.dto.fechaEnvio);
      //       localStorage.setItem('horaEnvio',res.dto.horaEnvio);
      //       localStorage.setItem('referenciaOperacion',res.dto.referenciaOperacion);
      //       this.spinnerMng.showSpinner(false);
      //       this.router.navigate(['/status']);
      //     } else {
      //       this.openAlert("Error",res.error.message, "Aceptar", "info", 0);
      //     }
      //   },
      //   err => {
      //     this.openAlert("Error",err.error.message, "Aceptar", "info", 0);
      //   }
      // )

    }
  }

  onKey(event: any) { // inputs de tarjeta
    if(this.tokenMask.length !== 0){
      this.classLabel = 'hideLabel';
      if(this.tokenMask.length === this.maxLength){
        this.btnState = "enableBtn";
      }else{
        this.btnState = "disableBtn";
      }
    }else{
      this.classLabel = 'showLabel';
    }
  }

  // PARA EL MENSAJE DE ERROR
  private openAlert(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    let message = new MessageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}
