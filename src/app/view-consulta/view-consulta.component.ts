import { Component, OnInit } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { Subscription } from 'rxjs/Subscription';
import { MenuMsg } from '../menu/menuMsg';
import { LoginService } from '../services/loginServices'
import { MainService } from '../services/main.service'
import { AlertMan , MessageAlert } from '../message-alert/alertMan';
import { MessageMan } from '../cards/messageMan';
import { Router, RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { SpinnerMan } from '../spinner-component/spinnerMng';
import { InfoCardMan } from '../personal-card/infoCardMng';
import { PageTrack } from '../decorators/page-track.decorator';
declare function validaSesion(): any;
declare function quitPorta(): any;
@PageTrack('portabilidad-consulta')
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
  numAction = 0;

  subscription: Subscription;
  subscriptionL: Subscription;
  subscriptionM: Subscription;

  constructor(
    private _stepMan: StepMan,
    private loginServices: LoginService,
    private mainService: MainService,
    private _menuMan: MenuMsg,
    private alertMan: AlertMan,
    private messageMan: MessageMan,
    private route: ActivatedRoute,
    private router: Router,
    private infoCardMng: InfoCardMan,
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
  }

  ngOnInit() {
    // this.loadConfig();
    this.startServices();


    // SUBSCRIPCION A LOS MENSAJES PARA DETECTAR CAMBIO EN OPCIONES DEL BOTON Y EN EL CAMBIO DE CARDS
    this.subscription = this._menuMan.getMessage()
    .subscribe(
      message => {
        this.filterMoves(message.response);
      }
    )
    this.subscriptionL = this.messageMan.getMessage()
    .subscribe(
      message => {
        this._menuMan.sendMessage(1);
      }
    )

    this._stepMan.sendMessage(0,"Consulta solicitud portabilidad");
    // this.filterMoves(1);
  }

  candidatoOtp(){
    let json = {
      "operacion": "PNAR",
      "idParametro": "0041",
      "operacionOTP": "OT04"
    }
    this.loginServices.postAccesoOtp(json)
    .subscribe(
      res => {
        // console.log(res);

        let totalSteps = 3;
        if(res.dto.telefonoOTP){
           if(res.dto.telefonoOTP !== ""){
             totalSteps = 4;
           }
         }

         // totalSteps = 4;

        localStorage.setItem('phoneOTP', res.dto.telefonoOTP.slice(0, -4));
        localStorage.setItem('totalSteps', totalSteps.toString());
      },
      err => {
        // console.log(err);
        localStorage.setItem('phoneOTP', '8246');
        localStorage.setItem('totalSteps', '3');
      }
    )
  }


  // loadConfig(){
  //   // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
  //   this.spinnerMng.showSpinner(true);
  //   // console.log("LOAD CONFIG");
  //   // this.loginServices.getConfig()
  //   // .subscribe(
  //   //   res => {
  //   //     localStorage.setItem('env', res.ENV_VAR);
  //   //     localStorage.setItem('dom', res.ENV_DOM);
  //   //     if(res.ENV_LOG === "false"){
  //   //       window['console']['log'] = function() {};
  //   //     }
  //   //     this.startServices();
  //   //   },
  //   //   err => {
  //   //     localStorage.setItem('env', 'pre');
  //   //     localStorage.setItem('dom', 'corp');
  //   //     this.startServices();
  //   //   }
  //   // )
  // }

  // PARA EL MENSAJE DE ERROR
  private errorService(tipo?: string, mensaje?: string, boton?: string, icon?: string, code?: number){
    let message = new MessageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

  reloadData(){
    // localStorage.clear();
    // SE OBTIENE EL TOKEN PARA SINGLE SIGN ON
    if(this.tokenUrl !== ""){
      localStorage.setItem('tokenUrl', this.tokenUrl);
    }
  }

  private startServices(){
    this.spinnerMng.showSpinner(true);
    // SERVICIO QUE OBTIENE EL TOKEN OATUH PARA CONSUMIR SERVICIOS
    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {
          // SE EJECUTA LA PRIMERA VEZ PARA OBTENER EL SESSION ID DEL TOKEN SSO
          if(localStorage.getItem('sessionID') === "" || localStorage.getItem('sessionID') === undefined || localStorage.getItem('sessionID') === null){
          // console.log("TOKEN VALIDATOR")
            // SERVICIO DE VALIDADOR DE TOKEN
            this.loginServices.postValidator(this.tokenUrl)
            .subscribe(
              res => {
                // VALIDADOR DE RESPUESTA DE TOKEN
                if(res.stokenValidatorResponse.codigoMensaje === "TVT_000"){
                  let mToken = {"sessionId": "", "telefono":""}
                  let pAdicional: any

                  if(res.stokenValidatorResponse.PAdicional){
                    pAdicional = JSON.parse(decodeURIComponent(decodeURIComponent(res.stokenValidatorResponse.PAdicional)));
                  } else if(res.stokenValidatorResponse.pAdicional){
                    pAdicional = JSON.parse(decodeURIComponent(decodeURIComponent(res.stokenValidatorResponse.pAdicional)));
                  }

                  mToken = pAdicional;
                  localStorage.setItem('sessionID', mToken.sessionId.substring(11));
                  // SE EJECUTAN LOS SERVICIOS DE CARGA
                  this.loadInfo();
                } else {
                  this.spinnerMng.showSpinner(false); // CIERRA LOADER
                  // this.errorService("Error",res.stokenValidatorResponse.mensaje,"","",0);
                  this.mainService.showAlert({
                    title: "Error",
                    body: res.stokenValidatorResponse.mensaje,
                    buttonAccept: "Aceptar",
                    item: {exit: 1}
                  });
                }
                // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN
              },
              err => {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                // this.errorService("Error", "", "", "", 0);
                this.mainService.showAlert({
                  title: "Error",
                  body: res.stokenValidatorResponse.mensaje,
                  buttonAccept: "Aceptar",
                  item: {exit: 1}
                });
              }
            );
          } else {
            // SE EJECUTAN LOS SERVICIOS DE CARGA
            this.loadInfo();
          }
      },
      err => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        // this.errorService("Error", "", "", "", 0);
        // this.mainService.showAlert({title: "Error", body: err.stokenValidatorResponse.mensaje, buttonAccept: "Aceptar"});
      }
    )
  }

  private matchAccounts(accounts: any, portabilidades: any){
    // MUESTRA SOLO CUENTAS QUE TIENEN PORTABILIDAD EN EL CARRUSEL
    let exists = [];
    let card0 = {
      "numeroCuenta": "0",
      "disponible": "Todas las cuentas",
      "alias": "CONSULTAR"
    }
    exists.push(card0);
    for(let account of accounts){
      let match = 0;
      for(let portabilidad of portabilidades){
        if(account.numeroCuenta === portabilidad.cuentaCliente){
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
    // SE PREGUNTA SI ES CANDIDATO OTP
    this.candidatoOtp();

    // SE OBTIENEN LAS CUENTAS
    this.loginServices.getSaldos()
    .subscribe(
      res => {
        this.respuestaSaldos = res;
        this.saldosCuentas = res.dto.saldoPesos;
        // this.messageMan.sendMessage(res);

        let valores = "";
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
            this._menuMan.sendMessage(1);
            // this.filterMoves(1);

            let portabilidades = res.dto
            if(portabilidades.length === 0){
              // this.errorService("Portabilidad de nómina", "Usted no cuenta con una solicitud de portabilidad de nómina. <br/><br/> La portabilidad de nómina es el derecho que tiene usted de decidir en qué banco desea recibir su sueldo, pensión u otras prestaciones de carácter laboral sin costo. <br/><br/> Para cualquier duda o aclaración comuníquese a SuperLínea, opción 4.", "", "", 1);
              this.mainService.showAlert({
                title: "Portabilidad de nómina",
                body: "Usted no cuenta con una solicitud de portabilidad de nómina. <br/><br/> La portabilidad de nómina es el derecho que tiene usted de decidir en qué banco desea recibir su sueldo, pensión u otras prestaciones de carácter laboral sin costo. <br/><br/> Para cualquier duda o aclaración comuníquese a SuperLínea, opción 4.",
                buttonAccept: "Aceptar",
                item: {exit:1}
              });
            }


            this.loginServices.getConsultaRFC()
            .subscribe(
              res2 => {
                localStorage.setItem('name',res2.dto.nombreCliente);
                localStorage.setItem('rawBirthday',res2.dto.fechaNacimiento);
                localStorage.setItem('birthday',this.formatDate(res2.dto.fechaNacimiento));
                localStorage.setItem('rfc',res2.dto.rfcCliente.trim());
              },
              err2 => {
                this.mainService.showAlert({
                  title: "Portabilidad de nómina",
                  body: "Por el momento el servicio no está disponible, por favor intenta de nuevo más tarde",
                  buttonAccept: "Aceptar",
                  item: {exit:1}
                });
              }
            );

          },
          err => {
            this.spinnerMng.showSpinner(false);
            if(err.res){
              // this.errorService("Error", err.res.message, "", "", 0);
              this.mainService.showAlert({
                title: "Error",
                body: err.res.message,
                buttonAccept: "Aceptar",
                item: {exit:1}
              });
            } else {
              // this.errorService("Error","","","",1); // 1
              this.mainService.showAlert({
                title: "Error",
                body: "",
                buttonAccept: "Aceptar",
                item: {exit:1}
              });
            }
          }
        );
        /* FIN BLOQUE PARA CONSULTAR DETALLE DE PORTABILIDADES */
      },
      err => {
        this.spinnerMng.showSpinner(false);
        // this.errorService("Error","","","",1); // 1
        // this.mainService.showAlert();
      }
    );
  }

  // private loadMock(){
  //   // SE OBTIENEN LAS CUENTAS
  //   this.loginServices.getSaldosMock()
  //   .subscribe(
  //     res => {
  //       this.respuestaSaldos = res;
  //       this.saldosCuentas = res.dto.saldoPesos;
  //
  //       this.loginServices.getDetalleConsultaMock()
  //       .subscribe(
  //         res=> {
  //           this.consultaPN = res.dto
  //           let myAccounts = this.matchAccounts(this.saldosCuentas, this.consultaPN);
  //           this.respuestaSaldos.dto.saldoPesos = myAccounts
  //           this.messageMan.sendMessage(this.respuestaSaldos);
  //
  //           this.spinnerMng.showSpinner(false);
  //           this.allMov = res.dto;
  //           this._menuMan.sendMessage(1);
  //           // this.filterMoves(1);
  //
  //           let portabilidades = res.dto
  //           if(portabilidades.length === 0){
  //             this.errorService("Portabilidad de nómina", "Usted no cuenta con una solicitud de portabilidad de nómina. <br/><br/> La portabilidad de nómina es el derecho que tiene usted de decidir en qué banco desea recibir su sueldo, pensión u otras prestaciones de carácter laboral sin costo. <br/><br/> Para cualquier duda o aclaración comuníquese a SuperLínea, opción 4.","","",0);
  //           }
  //
  //         },
  //         err => {
  //           this.spinnerMng.showSpinner(false);
  //           if(err.res){
  //             this.errorService("Error", err.res.message,"","",0);
  //           } else {
  //             this.errorService("Error","","","",1);
  //           }
  //         }
  //       );
  //     },
  //     err => {
  //       this.spinnerMng.showSpinner(false);
  //       this.errorService("Error","","","",1);
  //     }
  //   );
  // }

  // PARA FILTRAR MOVIMIENTOS
  private filterMoves(idBtn:number){
    this.totalMov = [];
    let tipoSolicitud = ""
    switch (idBtn){
      case 1:{
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
        'referenciaOperacion': moves.referenciaOperacion,
        'origen': moves.origen,
        'motivoRechazo': moves.motivoRechazo
      };

      if(newMove.tipoSolicitud === tipoSolicitud){
        if(localStorage.getItem('numeroCuenta') === newMove.numeroCuenta){
          newMoves.push(newMove);
        } else if(localStorage.getItem('cardDisponible') === "Todas las cuentas"){
          newMoves.push(newMove);
        }
      } else if(tipoSolicitud === "A"){
        if(localStorage.getItem('numeroCuenta') === newMove.numeroCuenta){
          newMoves.push(newMove);
        } else if(localStorage.getItem('cardDisponible') === "Todas las cuentas"){
          newMoves.push(newMove);
        }
      }
      if(newMoves.length >0){
        this.totalMov.push(newMove);
      }
    }
    this.totalMov = this.totalMov.sort((a, b) => {
      if (a.fechaEnvio < b.fechaEnvio) return 1;
      else if (a.fechaEnvio > b.fechaEnvio) return -1;
      else return 0;
    });
  }

  formatDate(date:string):string{
    let values = date.split("-", 3);
    let index = parseInt(values[1])-1;
    let month = ["Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"];
    return (values[2]+" "+month[index]+" "+values[0]);
  }

  alertAccept(event: any){
    if(event){
      if(event.exit === 1){
        quitPorta()
      }
    } else {
      this.router.navigate(['/cancelacion/valida']);
    }
  }
  alertCancel(event: any){
    // DO SOMETJING
  }


}
