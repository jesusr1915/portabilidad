import { Component, OnInit, Input, NgZone } from '@angular/core';
import { CopiesService } from '../services/copiesService';
import { LoginService } from '../services/loginServices';
import { StepMan } from '../stepper/stepMan';
import { verifique_class } from 'interfaces/copiesInterface';
import { MessageMan } from '../cards/messageMan';
import { TokenMng } from '../token/tokenMng';
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-verifique',
  templateUrl: './view-verifique.component.html',
  styleUrls: ['../app.component.scss',
      './view-verifique.component.scss'
              ]
})
export class ViewVerifiqueComponent implements OnInit {

  copiesVer : verifique_class = new verifique_class();
  @Input() valueInfo = localStorage.getItem('tarjet');
  @Input() valueBank = localStorage.getItem('banco');
  @Input() valueBirthdate = localStorage.getItem('birthday');

  myExtObject: any;
  tipoToken: string;
  tokenSM: string;
  tipoOTP: string;
  date: string;
  isDanteTest = false;
  isRealTest = false;

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
    private router: Router
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
        this.copiesVer = res.datos.verifique;
        this.tipoToken = localStorage.getItem("ttkn");

        this.stepMan.sendMessage(2,"Verifique los datos de su cuenta o tarjeta");

        this.messageMan.sendMessage(this.demo);
        if(this.valueInfo.length == 18){
          this.copiesVer.infoCount = "CLABE Interbancaria";
        }else{
          this.copiesVer.infoCount = "Tarjeta de débito";
        }
      }
    )

    if(localStorage.getItem('pruebasDante') === "true"){
      this.isDanteTest = true;
      this.isRealTest = false;
    } else {
      this.isDanteTest = false;
      this.isRealTest = true;
    }

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
      if(token !== '')
        this.responseToken(token, tipoOTP, date);
      else
        this.errorService("", message, "", "", 0);
    });
  }

  // FUNCION QUE REALIZA LA ASIGNACION DE VALORES DEL TOKEN
  responseToken(mToken: string, mTipoOTP: string, mDate: string) {
    this.tokenSM = mToken;
    this.tipoOTP = mTipoOTP;
    this.date = mDate;
    this.sendAltaService();
  }

  sendAltaService(){

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
            this.router.navigate(['/status']);
          } else {
            this.errorService("Error",res.error.message, "Aceptar", "info", 0);
          }
        },
        err => {
          this.errorService("Error",err.error.message, "Aceptar", "info", 0);
        }
      )

  }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
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
