import { Component, OnInit, Input, NgZone } from '@angular/core';
import { CopiesService } from '../services/copiesService';
import { LoginService } from '../services/loginServices';
import { StepMan } from '../stepper/stepMan';
import { verifique_class } from 'interfaces/copiesInterface';
import { MessageMan } from '../cards/messageMan';
import { TokenMng } from '../token/tokenMng';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { Router, NavigationEnd } from '@angular/router';
import { SpinnerMan } from '../spinner-component/spinnerMng';

declare var ga: any;

@Component({
  selector: 'app-view-alta-verifique',
  templateUrl: './view-alta-verifique.component.html',
  styleUrls: ['../app.component.scss',
      './view-alta-verifique.component.scss'
              ]
})

export class ViewAltaVerifiqueComponent implements OnInit {

  copiesVer : verifique_class = new verifique_class();
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
        if(this.valueInfo.length == 18){
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
      this.copieValidacion = "Para continuar debe tener a la mano el teléfono celular que registró con nosotros, terminación **4242. Si usted no cuenta con este número por favor acuda a una sucursal.";
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
    (window as any).requestToken();
  }

  // FUNCION QUE RECIBE EL TOKEN DESDE LA NATIVA
  receiveTokenFromNative(token: string, tipoOTP: string, date: string, message: string) {
    this.zone.run(() => {
      if(token !== ''){
        this.responseToken(token, tipoOTP, date);
      } else {
        console.log(message);
        //this.openAlert("", message, "", "", 0);
      }
    });
  }

  // FUNCION QUE REALIZA LA ASIGNACION DE VALORES DEL TOKEN
  responseToken(mToken: string, mTipoOTP: string, mDate: string) {
    this.tokenSM = mToken;
    this.tipoOTP = mTipoOTP;
    this.date = mDate;

    let tokenTipo = mTipoOTP != "" ? "SuperToken" : "Token"

    ga('send', 'event', {
      eventCategory: 'token',
      eventLabel: tokenTipo,
      eventAction: 'tipoToken',
      eventValue: 1
    });

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
      "fechaHora" : this.date,
      "operacion" : "PNAR",
      "tipoOTP" : this.tipoOTP,
      "token" : this.tokenSM
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

  // PARA EL MENSAJE DE ERROR
  private openAlert(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
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
