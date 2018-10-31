import { Component, OnInit, Input, NgZone } from '@angular/core';
import { CopiesService } from '../services/copiesService';
import { LoginService } from '../services/loginServices';
import { StepMan } from '../stepper/stepMan';
import { VerifiqueClass } from '../../interfaces/copiesInterface';
import { MessageMan } from '../cards/messageMan';
import { TokenMng } from '../token/tokenMng';
import { AlertMan , MessageAlert } from '../message-alert/alertMan';
import { Router, NavigationEnd } from '@angular/router';
import { SpinnerMan } from '../spinner-component/spinnerMng';

declare let ga: any;

@Component({
  selector: 'app-view-alta-verifique',
  templateUrl: './view-alta-verifique.component.html',
  styleUrls: ['../app.component.scss',
      './view-alta-verifique.component.scss'
              ]
})

export class ViewAltaVerifiqueComponent implements OnInit {

  copiesVer: VerifiqueClass = new VerifiqueClass();
  @Input() valueInfo = localStorage.getItem('tarjet');
  @Input() valueBank = localStorage.getItem('banco');
  @Input() valueBirthdate = localStorage.getItem('birthday');

  copieValidacion = "";
  hideToken = false
  myExtObject: any;
  tipoToken: string;
  tokenSM: string;
  tipoOTP: string;
  date: string;

  demo : Demo = new Demo(
    localStorage.getItem("cardAlias"),
    "SantanderSelect",
    localStorage.getItem("cardNumeroCuenta"),
    localStorage.getItem("cardDisponible"),
    localStorage.getItem("cardDivisa"),
    localStorage.getItem("cardCuentaMovil")
  );

  constructor(
    private copiesServ: CopiesService,
    private stepMan: StepMan,
    private messageMan: MessageMan,
    private tokenMng: TokenMng,
    private zone: NgZone,
    private loginServices: LoginService,
    private alertMan: AlertMan,
    private router: Router,
    public spinnerMng: SpinnerMan,
  ) {
    (window as any).angularComponentRef = {
      zone: this.zone,
      componentFn: (succesTkn, tipoOTP, date, errorTkn) => this.receiveTokenFromNative(succesTkn, tipoOTP, date, errorTkn),
      component: this
    };
  }

  ngOnInit(){
    this.copiesServ.postCopies()
    .subscribe(
      res => {
        this.stepMan.sendMessage(2,"Verifique los datos de su cuenta o tarjeta");
        this.copiesVer = res.datos.verifique;
        this.tipoToken = localStorage.getItem("ttkn");
        this.messageMan.sendMessage(this.demo);
        if(this.valueInfo.length === 18){
          this.copiesVer.infoCount = "CLABE Interbancaria";
        }else{
          this.copiesVer.infoCount = "Tarjeta de débito";
        }
      }
    )
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });

    if(localStorage.getItem('totalSteps') === "4"){
      this.hideToken = true;
      this.copieValidacion = "Para continuar debe tener a la mano el teléfono celular que registró con nosotros, terminación **" + localStorage.getItem('phoneOTP') + ". Si usted no cuenta con este número por favor acuda a una sucursal.";
    } else {
      this.hideToken = false;
      this.copieValidacion = this.copiesVer.inst2LblInit + "<strong class='black'>" + this.copiesVer.inst2LblStrong + "</strong>" +  "<br/>" + this.copiesVer.inst3LblInit + "<strong>" + this.copiesVer.inst3LblStrong + "</strong>"
    }
  }

  ngAfterViewInit(){
    let element: HTMLElement = document.getElementById("validaSesion") as HTMLElement;
    element.click();
  }

  onActivate(e, outlet){
    outlet.scrollTop = 0;
  }

  showToken(){
    this.tokenMng.sendMessage("true");
  }

  requestToken() {
    // console.log("DEMO", localStorage.getItem('demo') === "1");
    if(localStorage.getItem('demo')){
      if(localStorage.getItem('demo') === "1"){
        this.showToken();
      } else {
        (window as any).requestToken();
      }
    } else {
      (window as any).requestToken();
    }
  }

  // FUNCION QUE RECIBE EL TOKEN DESDE LA NATIVA
  receiveTokenFromNative(token: string, tipoOTP: string, date: string, message: string) {
    this.zone.run(() => {
      if(token !== ''){
        this.responseToken(token, tipoOTP, date);
      } else {
        // console.log(message);
        //this.openAlert("", message, "", "", 0);
      }
    });
  }

  // FUNCION QUE REALIZA LA ASIGNACION DE VALORES DEL TOKEN
  responseToken(mToken: string, mTipoOTP: string, mDate: string) {
    this.tokenSM = mToken;
    this.tipoOTP = mTipoOTP;
    this.date = mDate;

    let tokenTipo = mTipoOTP !== "" ? "SuperToken" : "Token"

    ga('send', 'event', {
      eventCategory: 'token',
      eventLabel: tokenTipo,
      eventAction: 'tipoToken',
      eventValue: 1
    });

    this.sendAltaService();
  }

  sendAltaService(){
    if(localStorage.getItem('demo') === "1"){
      this.tokenSM = localStorage.getItem('token');
      this.tipoOTP = "";
    }
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
      "fechaHora" : this.date,
      "operacion" : "PNAR",
      "tipoOTP" : this.tipoOTP,
      "token" : this.tokenSM,
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
          this.router.navigate(['/status']);
        }
      },
      err => {
        // this.openAlert("Error",err.error.message, "Aceptar", "info", 0);
        // if(err.error === "access_denied" || err.error == "expired_access_token"){
        if(err.error == "expired_access_token"){
          // SERVICIO QUE OBTIENE EL TOKEN OATUH PARA CONSUMIR SERVICIOS
          this.spinnerMng.showSpinner(false);
          this.loginServices.postOAuthToken()
          .subscribe(
            res => {
              this.spinnerMng.showSpinner(false);
              this.sendAltaService();
            },
            errM => {
            this.openAlert("Error",errM.error.message, "Aceptar", "info", 0);
          })
        }
      }
    )

  }

  continue(){
    this.router.navigate(['/otp']);
  }

  // PARA EL MENSAJE DE ERROR
  private openAlert(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    let message = new MessageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

}

export class Demo {
  alias : string;
  tipoProducto : string;
  numeroCuenta : string;
  disponible: string;
  divisa: string;
  cuentaMovil: string;


  constructor(
    alias:string,
    tipoProducto:string,
    numeroCuenta:string,
    disponible: string,
    divisa: string,
    cuentaMovil: string
  ){
    this.alias = alias;
    this.tipoProducto = tipoProducto;
    this.numeroCuenta = numeroCuenta;
    this.disponible = disponible;
    this.divisa = divisa;
    this.cuentaMovil =  cuentaMovil;
  }
}
