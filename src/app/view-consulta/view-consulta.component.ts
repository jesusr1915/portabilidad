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

  // allMov = [
  //   {
  //     'date':'Sábado 05 de Diciembre, 2015',
  //     'bills':[
  //       {
  //         'origin':'072012345678912345',
  //         'destination':'89**8753',
  //         'status' : 'ACEPTADA',
  //         'delivery': 'E'
  //       },
  //       {
  //         'origin':'654985427789008987',
  //         'destination':'56**6011',
  //         'status' : 'RECHAZADA',
  //         'delivery': 'R'
  //       }
  //     ]
  //   },
  //   {
  //     'date':'Sábado 06 de Diciembre, 2015',
  //     'bills':[
  //       {
  //         'origin':'98483920976581',
  //         'destination':'56**7644',
  //         'status' : 'RECHAZADA',
  //         'delivery': 'R'
  //       }
  //     ]
  //   }];

  // allMov = [{
	// 	"horaEnvio": "16:22",
	// 	"referenciaOperacion": "9310507",
	// 	"fechaRechazo": "",
	// 	"fechaNacimiento": "",
	// 	"banco": {
	// 		"descripcion": "",
	// 		"numBanxico": "",
	// 		"id": "",
	// 		"nombreCorto": "BANAMEX"
	// 	},
	// 	"origen": "RI",
	// 	"cuentaCliente": "13000007738",
	// 	"fechaEnvio": "2017-12-27",
	// 	"motivoRechazo": "",
	// 	"nombreCliente": "",
	// 	"estatus": "SOLICITADA",
	// 	"tipoSolicitud": "R",
	// 	"folio": "2017122716220640014RIA16220603",
	// 	"cuentaBanco": "002580409200249654",
	// 	"rfcCliente": ""
	// }, {
	// 	"horaEnvio": "15:40",
	// 	"referenciaOperacion": "2056175",
	// 	"fechaRechazo": "",
	// 	"fechaNacimiento": "",
	// 	"banco": {
	// 		"descripcion": "",
	// 		"numBanxico": "",
	// 		"id": "",
	// 		"nombreCorto": "BBVA BANCOMER"
	// 	},
	// 	"origen": "RI",
	// 	"cuentaCliente": "13000007738",
	// 	"fechaEnvio": "2017-12-22",
	// 	"motivoRechazo": "",
	// 	"nombreCliente": "",
	// 	"estatus": "SOLICITADA",
	// 	"tipoSolicitud": "R",
	// 	"folio": "2017122215405440014RIA15405482",
	// 	"cuentaBanco": "4152313225070549",
	// 	"rfcCliente": ""
	// }, {
	// 	"horaEnvio": "17:18",
	// 	"referenciaOperacion": "8829912",
	// 	"fechaRechazo": "",
	// 	"fechaNacimiento": "",
	// 	"banco": {
	// 		"descripcion": "",
	// 		"numBanxico": "",
	// 		"id": "",
	// 		"nombreCorto": "BBVA BANCOMER"
	// 	},
	// 	"origen": "RI",
	// 	"cuentaCliente": "25000004114",
	// 	"fechaEnvio": "2017-12-26",
	// 	"motivoRechazo": "",
	// 	"nombreCliente": "",
	// 	"estatus": "SOLICITADA",
	// 	"tipoSolicitud": "R",
	// 	"folio": "2017122617181040014RIA17181008",
	// 	"cuentaBanco": "4152313225070415",
	// 	"rfcCliente": ""
	// }, {
	// 	"horaEnvio": "12:27",
	// 	"referenciaOperacion": "",
	// 	"fechaRechazo": "",
	// 	"fechaNacimiento": "",
	// 	"banco": {
	// 		"descripcion": "",
	// 		"numBanxico": "",
	// 		"id": "",
	// 		"nombreCorto": "BANAMEX"
	// 	},
	// 	"origen": "RI",
	// 	"cuentaCliente": "25000004114",
	// 	"fechaEnvio": "2017-01-10",
	// 	"motivoRechazo": "",
	// 	"nombreCliente": "",
	// 	"estatus": "EN TRAMITE",
	// 	"tipoSolicitud": "R",
	// 	"folio": "2017011012270140014RIA12270152",
	// 	"cuentaBanco": "5709123456789012",
	// 	"rfcCliente": ""
	// }];


  subscription: Subscription;
  constructor(
    private _stepMan : StepMan,
    private loginServices: LoginService,
    private _menuMan : MenuMsg,
    private alertMan: AlertMan,
    private messageMan: MessageMan,
    private route: ActivatedRoute,
    public spinnerMng : SpinnerMan
  ) {
    // RECIBE PARAMETROS POR URL CON QUERY
    this.route.queryParams
    .subscribe(params => {
      this.tokenUrl = params.token

      localStorage.setItem('backButton', "true");
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
    // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
    this.loginServices.getConfig()
    .subscribe(
      res => {
        localStorage.setItem('env', res.ENV_VAR);
        this.startServices();
      },
      err => {
        localStorage.setItem('env', 'pre');
        this.startServices();
      }
    )

    this._stepMan.sendMessage(0,"Consulta solicitud portabilidad");


  }

  reloadData(){
    localStorage.clear();
    // SE OBTIENE EL TOKEN PARA SINGLE SIGN ON
    if(this.tokenUrl !== ""){
      console.log("OBTIENE TOKEN");
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
                  var message = new messageAlert("Error", res.stokenValidatorResponse.mensaje);
                  this.alertMan.sendMessage(message);
                }
                // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN
              },
              err => {
                this.errorService();
              }
            );
          } else {
            // SE EJECUTAN LOS SERVICIOS DE CARGA
            console.log("TOKEN EXISTENTE");
            this.loadInfo();
          }
      },
      err => {
        this.errorService();
      }
    )
  }

  private loadInfo(){
    // SE OBTIENEN LAS CUENTAS
    this.spinnerMng.showSpinner(true);
    this.loginServices.getSaldos()
    .subscribe(
      res => {
        this.messageMan.sendMessage(res);
        /* INICIO BLOQUE PARA CONSULTAR DETALLE DE PORTABILIDADES */
        // SE OBTIENE EL VALOR QUE SE VA A ENVIAR AL SERVICIO consultaPN
        let datos = {"valores": localStorage.getItem('valores')}
        // SE OBTIENEN LAS CUENTAS CON PORTABILIDAD
        this.loginServices.postDetalleConsulta(datos)
        .subscribe(
          res=> {
            // SE ASIGNA EL VALOR DEL ARREGLO DEVUELTO
            //
            // for(let portabilidad of res.dto){
            //   this.portabilidades.push(portabilidad.cuentaCliente)
            // }
            //
            // if(this.portabilidades.length > 0){
            //   localStorage.setItem('portabilidades', this.portabilidades);
            // }

            this.allMov = res.dto;
            this.filterMoves(1);
            this.spinnerMng.showSpinner(false);
          },
          err => {
            this.spinnerMng.showSpinner(false);
            if(err.res){
              var message = new messageAlert("Error", err.res.message);
              this.alertMan.sendMessage(message);
            } else {
              var message = new messageAlert("Error", "Por el momento el servicio no esta disponible");
              this.alertMan.sendMessage(message);
            }
          }
        );
        /* FIN BLOQUE PARA CONSULTAR DETALLE DE PORTABILIDADES */
      },
      err => {
        this.spinnerMng.showSpinner(false);
        this.errorService();
      }
    );
  }

  // PARA FILTRAR MOVIMIENTOS
  private filterMoves(idBtn:number){
    this.totalMov = [];
    let tipoSolicitud = ""
    switch (idBtn){
      case 1:{
        this.totalMov = this.allMov;
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
      let newMove = {
        'fechaEnvio': moves.fechaEnvio,
        'cuentaBanco': moves.cuentaBanco,
        'cuentaCliente': moves.cuentaCliente,
        'estatus': moves.estatus,
        'tipoSolicitud': moves.tipoSolicitud
      };

      if(newMove.tipoSolicitud == tipoSolicitud){
        newMoves.push(newMove);
      }
      if(newMoves.length >0){
        this.totalMov.push(newMove);
      }
    }
    // console.log(this.totalMov + " " + this.totalMov.length);
    if(this.totalMov.length == 0){
      console.log("VACIO");
      var message = new messageAlert("Error", "Usted no cuenta con una solicitud de portabilidad de nómina.\n La portabilidad de nómina es el derecho que tiene usted de decidir en qué banco desea recibir su sueldo, pensión u otras prestaciones de carácter laboral sin costo.\n Para cualquier duda o aclaración comuníquese a SuperLínea, opción 4.");
      this.alertMan.sendMessage(message);
    }
  }

  // PARA EL MENSAJE DE ERROR
  private errorService(mensaje?: string){
    var strMensaje = "";

    if(mensaje)
      strMensaje = mensaje;
    else
      strMensaje = "Por el momento el servicio no esta disponible";
    var message = new messageAlert("Error",strMensaje);
    this.alertMan.sendMessage(message);
  }

}
