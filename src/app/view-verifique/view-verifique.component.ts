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
          componentFn: (value) => this.calledFromOutside(value),
          component: this
        };
  }

  ngOnInit(){
    this.copiesServ.postCopies()
    .subscribe(
      res => {
        this.copiesVer = res.datos.verifique;
        this.tipoToken = localStorage.getItem("ttkn");

        this.stepMan.sendMessage(2,"Portabilidad de Nómina");

        this.messageMan.sendMessage(this.demo);
        if(this.valueInfo.length == 18){
          this.copiesVer.infoCount = "CLABE Interbancaria";
        }else{
          this.copiesVer.infoCount = "Tarjeta de débito";
        }
      }
    )
  }

  showToken(){

    // SE MANDA LLAMAR LA FUNCION QUE DEVUELVE EL TOKEN NATIVO
    //this.requestToken()

    Connect.getToken();

    // if(this.tipoToken == "0"){
    //   this.tokenMng.sendMessage("true");
    // } else {
    //   this.requestToken();
    // }
  }

  requestToken() {
    (window as any).requestToken();
  }

  responseToken(newValue) {
    //(window as any).responseToken();
    console.log(newValue);
    this.tokenSM = newValue;
    this.sendAltaService();
  }

  calledFromOutside(newValue:String) {
    this.zone.run(() => {
      this.responseToken(newValue);
    });
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
        "fechaHora" : "",
        "operacion" : "PNAR",
        "tipoOTP" : "",
        "token" : this.tokenSM
      }

      this.loginServices.postAlta(body)
      .subscribe(
        res => {
          console.log("RESPUESTA ALTA " +res.dto);
          localStorage.setItem('folio',res.dto.folio);
          localStorage.setItem('fechaOperacion',res.dto.fechaEnvio);
          localStorage.setItem('horaEnvio',res.dto.horaEnvio);
          localStorage.setItem('referenciaOperacion',res.dto.referenciaOperacion);
          this.router.navigate(['/status']);
        },
        err => {
          this.errorService();
        }
      )

  }

  private errorService(){
    var message = new messageAlert("Error","Por el momento el servicio no esta disponible", "Aceptar");
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
