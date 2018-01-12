import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TokenMng } from '../token/tokenMng';
import { LoginService } from '../services/loginServices';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { Router, RouterModule, Routes } from '@angular/router';


@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['../app.component.scss','../terms/terms.component.scss','../message-alert/message-alert.component.scss','./token.component.scss']
})
export class TokenComponent implements OnInit {
  visible = false;
  visibleAnimate = false;

  classLabel = 'showLabel';
  tokenMask = "";
  maxLength = 4;
  tokenValue = "";
  btnState = 'disableBtn';
  tokenType = "";
  tokenLength = 0;

  title = "";
  message = "";
  value_placeholder_CLABE = "";

  subscription: Subscription;

  constructor(
    private tokenMng: TokenMng,
    private serviceManager : LoginService,
    private alertMan: AlertMan,
    private router: Router
  ) {

    if(this.tokenType == "soft"){
      this.title = "Esta operación requiere de autorización de SuperToken. Ingrese la clave SuperToken que usted definió.";
      this.message = "Clave SuperToken";
      this.value_placeholder_CLABE = "Número de 4 dígitos";
      this.tokenLength = 4;
    } else if(this.tokenType == "soft2"){
      this.title = "Esta operación requiere autorización de SuperToken. Usted está utilizando un dispositivo diferente al que instaló en SuperToken. Ingrese el código generado.";
      this.message = "NIP dinámico de SuperToken";
      this.value_placeholder_CLABE = "Número de 8 dígitos";
      this.tokenLength = 8;
    } else {
      this.title = "Esta operación requiere de autorización de Token físico. Ingrese el NIP dinámico generado por su dispositivo Token.";
      this.message = "NIP dinámico Token";
      this.value_placeholder_CLABE = "Número de 8 dígitos";
      this.tokenLength = 8;
    }


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
    if(this.tokenMask.length == this.tokenLength){
      // let body = {
      //   banco:"banamex"
      // }


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
        "fechaHora" : "",
        "operacion" : "PNAR",
        "tipoOTP" : "",
        "token" : "00000000"
      }

      this.serviceManager.postAlta(body)
      .subscribe(
        res => {
          console.log(res.dto);
          localStorage.setItem('folio',res.dto.folio);
          localStorage.setItem('fechaOperacion',res.dto.fechaEnvio);
          localStorage.setItem('horaEnvio',res.dto.horaEnvio);
          localStorage.setItem('referenciaOperacion',res.dto.referenciaOperacion);
          this.router.navigate(['/status']);
        },
        err => {

          this.errorService();
          console.log('Something went wrong!' + err.message);
        }
      )

    }
  }
  private errorService(){
    var message = new messageAlert("Error","Por el momento el servicio no esta disponible", "Aceptar");
    this.alertMan.sendMessage(message);
  }
  onKey(event: any) { // inputs de tarjeta
    if(this.tokenMask.length != 0){
      this.classLabel = 'hideLabel';
      if(this.tokenMask.length == this.maxLength){
        this.btnState = "enableBtn";
      }else{
        this.btnState = "disableBtn";
      }
    }else{
      this.classLabel = 'showLabel';
    }
  }



}
