import { Component, OnInit } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { Subscription } from 'rxjs/Subscription';
import { MenuMsg } from '../menu/menuMsg';
import { LoginService } from '../services/loginServices'
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { MessageMan } from '../cards/messageMan';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { SpinnerMan } from '../spinner-component/spinnerMng';

@Component({
  selector: 'app-view-consulta',
  templateUrl: './view-consulta.component.html',
  styleUrls: ['../app.component.scss','./view-consulta.component.scss']
})
export class ViewConsultaComponent implements OnInit {

  totalMov =[];
  allMov = [];
  portabilidades = [];
  tokenUrl = "";
  tokenType = "";
  respuestaSaldos = {dto:{saldoPesos:[]}};
  saldosCuentas = [];
  consultaPN = [];

  subscription: Subscription;
  subscriptionL: Subscription;

  constructor(
    private _stepMan: StepMan,
    private loginServices: LoginService,
    private _menuMan: MenuMsg,
    private alertMan: AlertMan,
    private messageMan: MessageMan,
    private route: ActivatedRoute,
    public spinnerMng: SpinnerMan
  ) {
    // RECIBE PARAMETROS POR URL CON QUERY
    this.route.queryParams
    .subscribe(params => {
      this.tokenUrl = params.token

      // localStorage.setItem('backButton', "true");
      if(localStorage.getItem('backButton') !== undefined && localStorage.getItem('backButton') !== null){
        if(localStorage.getItem('backButton') !== "true"){
          this.reloadData();
        } else {
          localStorage.removeItem('backButton');
        }
      } else {
        this.reloadData();
      }
    });

    this.subscription = this._menuMan.getMessage()
    .subscribe(
      message => {
        this.filterMoves(message.response);
      }
    )
    this.subscriptionL = this.messageMan.getMessage()
    .subscribe(
      message => {
        this.filterMoves(1);
        this._menuMan.sendMessage(1);
      }
    )
  }

  ngOnInit() {
    // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
    this.spinnerMng.showSpinner(true);
    this.loginServices.getConfig()
    .subscribe(
      res => {
        localStorage.setItem('env', res.ENV_VAR);
        this.startServices();
      },
      err => {
        localStorage.setItem('env', 'pre');
        // this.startServices();
        this.loadMock();
      }
    )

    this._stepMan.sendMessage(0,"Consulta solicitud portabilidad");
    this.filterMoves(1);

  }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    var message = new messageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

  reloadData(){
    localStorage.clear();
    // SE OBTIENE EL TOKEN PARA SINGLE SIGN ON
    if(this.tokenUrl !== ""){
      localStorage.setItem('tokenUrl', this.tokenUrl);
    }
  }

  private startServices(){
    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {
          // SE EJECUTA LA PRIMERA VEZ PARA OBTENER EL SESSION ID DEL TOKEN SSO
          if(localStorage.getItem('sessionID') === "" || localStorage.getItem('sessionID') === undefined || localStorage.getItem('sessionID') === null){
            // SERVICIO DE VALIDADOR DE TOKEN
            this.loginServices.postValidator(this.tokenUrl)
            .subscribe(
              res => {
                // VALIDADOR DE RESPUESTA DE TOKEN
                if(res.stokenValidatorResponse.codigoMensaje == "TVT_000"){
                  // SE GUARDA EL SESSION ID DE LA RESPUESTA
                  let mToken = JSON.parse(decodeURIComponent(decodeURIComponent(res.stokenValidatorResponse.pAdicional)));
                  localStorage.setItem('sessionID',mToken.sessionId.substring(11));
                  // SE EJECUTAN LOS SERVICIOS DE CARGA
                  this.loadInfo();
                } else {
                  this.errorService("Error",res.stokenValidatorResponse.mensaje,"","",1);
                }
                // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN
              },
              err => {
                this.errorService("Error","","","",1);
              }
            );
          } else {
            // SE EJECUTAN LOS SERVICIOS DE CARGA
            this.loadInfo();
          }
      },
      err => {
        this.errorService("Error","","","",1);
      }
    )
  }

  private loadMock(){
    // SE OBTIENEN LAS CUENTAS
    this.loginServices.getSaldosMock()
    .subscribe(
      res => {
        this.respuestaSaldos = res;
        this.saldosCuentas = res.dto.saldoPesos;

        this.loginServices.getDetalleConsultaMock()
        .subscribe(
          res=> {
            this.consultaPN = res.dto
            let myAccounts = this.matchAccounts(this.saldosCuentas, this.consultaPN);
            this.respuestaSaldos.dto.saldoPesos = myAccounts
            this.messageMan.sendMessage(this.respuestaSaldos);

            this.spinnerMng.showSpinner(false);
            this.allMov = res.dto;
            this.filterMoves(1);

            let portabilidades = res.dto
            if(portabilidades.length == 0){
              this.errorService("Portabilidad de nómina", "Usted no cuenta con una solicitud de portabilidad de nómina. <br/><br/> La portabilidad de nómina es el derecho que tiene usted de decidir en qué banco desea recibir su sueldo, pensión u otras prestaciones de carácter laboral sin costo. <br/><br/> Para cualquier duda o aclaración comuníquese a SuperLínea, opción 4.","","",0);
            }

          },
          err => {
            this.spinnerMng.showSpinner(false);
            if(err.res){
              this.errorService("Error", err.res.message,"","",0);
            } else {
              this.errorService("Error","","","",1);
            }
          }
        );
      },
      err => {
        this.spinnerMng.showSpinner(false);
        this.errorService("Error","","","",1);
      }
    );
  }

  private matchAccounts(accounts: any, portabilidades: any){
    var exists = [];
    for(let account of accounts){
      var match = 0;
      for(let portabilidad of portabilidades){
        if(account.numeroCuenta == portabilidad.cuentaCliente){
          match++;
        }
      }
      if(match > 0){
        exists.push(account);
      }
    }
    return exists;
  }

  private loadInfo(){
    // SE OBTIENEN LAS CUENTAS
    this.loginServices.getSaldos()
    .subscribe(
      res => {
        this.respuestaSaldos = res;
        this.saldosCuentas = res.dto.saldoPesos;
        // this.messageMan.sendMessage(res);

        var valores = "";
        for(let cta of this.saldosCuentas){
          // console.log(cta.numeroCuenta);
          valores += cta.numeroCuenta + '-';
        }
        valores = valores.slice(0, -1);

        /* INICIO BLOQUE PARA CONSULTAR DETALLE DE PORTABILIDADES */
        // SE OBTIENE EL VALOR QUE SE VA A ENVIAR AL SERVICIO consultaPN
        let datos = {"valores": valores}
        // SE OBTIENEN LAS CUENTAS CON PORTABILIDAD
        this.loginServices.postDetalleConsulta(datos)
        .subscribe(
          res=> {
            this.consultaPN = res.dto
            let myAccounts = this.matchAccounts(this.saldosCuentas, this.consultaPN);
            this.respuestaSaldos.dto.saldoPesos = myAccounts
            this.messageMan.sendMessage(this.respuestaSaldos);

            this.spinnerMng.showSpinner(false);
            this.allMov = res.dto;
            this.filterMoves(1);

            let portabilidades = res.dto
            if(portabilidades.length == 0){
              this.errorService("Portabilidad de nómina", "Usted no cuenta con una solicitud de portabilidad de nómina. <br/><br/> La portabilidad de nómina es el derecho que tiene usted de decidir en qué banco desea recibir su sueldo, pensión u otras prestaciones de carácter laboral sin costo. <br/><br/> Para cualquier duda o aclaración comuníquese a SuperLínea, opción 4.", "", "", 0);
            }

          },
          err => {
            this.spinnerMng.showSpinner(false);
            if(err.res){
              this.errorService("Error", err.res.message,"","",0);
            } else {
              this.errorService("Error","","","",1);
            }
          }
        );
        /* FIN BLOQUE PARA CONSULTAR DETALLE DE PORTABILIDADES */
      },
      err => {
        this.spinnerMng.showSpinner(false);
        this.errorService("Error","","","",1);
      }
    );
  }

  // PARA FILTRAR MOVIMIENTOS
  private filterMoves(idBtn:number){
    this.totalMov = [];
    let tipoSolicitud = ""
    switch (idBtn){
      case 1:{
        // this.totalMov = this.allMov;
        tipoSolicitud = "A"
      }
      break;
      case 2:{
        tipoSolicitud = "R"
      }
      break;
      case 3:{
        tipoSolicitud = "E"
      }
      break;
      default: {
      break;
      }

    }
    for(let moves of this.allMov){
      let newMoves = [];
      let accountLenght = moves.cuentaCliente.length;
      let maskCuenta = moves.cuentaCliente.substr(0,2) + "**" + moves.cuentaCliente.substr(accountLenght-4,accountLenght);
      let newMove = {
        'fechaEnvio': moves.fechaEnvio,
        'cuentaBanco': moves.cuentaBanco,
        'cuentaCliente': maskCuenta,
        'numeroCuenta': moves.cuentaCliente,
        'estatus': moves.estatus,
        'tipoSolicitud': moves.tipoSolicitud,
        'banco': moves.banco,
        'folio': moves.folio,
        'horaEnvio': moves.horaEnvio,
        'referenciaOperacion': moves.referenciaOperacion
      };

      if(newMove.tipoSolicitud == tipoSolicitud){
        if(localStorage.getItem('numeroCuenta') == newMove.numeroCuenta){
          newMoves.push(newMove);
        }
      } else if(tipoSolicitud == "A"){
        if(localStorage.getItem('numeroCuenta') == newMove.numeroCuenta){
          newMoves.push(newMove);
        }
      }
      if(newMoves.length >0){
        this.totalMov.push(newMove);
      }
    }
  }
}
