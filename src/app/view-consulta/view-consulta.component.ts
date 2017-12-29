import { Component, OnInit } from '@angular/core';
import { StepMan } from '../stepper/stepMan';
import { Subscription } from 'rxjs/Subscription';
import { MenuMsg } from '../menu/menuMsg';
import { LoginService } from '../services/loginServices'
import { AlertMan , messageAlert } from '../message-alert/alertMan';
import { MessageMan } from '../cards/messageMan';

@Component({
  selector: 'app-view-consulta',
  templateUrl: './view-consulta.component.html',
  styleUrls: ['../app.component.scss','./view-consulta.component.scss']
})
export class ViewConsultaComponent implements OnInit {

  totalMov =[];
  allMov = [];

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
    private messageMan: MessageMan

  ) {
    // this.subscription = this._menuMan.getMessage()
    // .subscribe(
    //   message => {
    //     this.filterMoves(message.response);
    //   }
    // )
  }

  ngOnInit() {
  //  localStorage.clear();
    this._stepMan.sendMessage(0,"Consulta solicitud portabilidad");

    /* SE DESCOMENTA ESTE BLOQUE */
    this.loginServices.postOAuthToken()
    .subscribe(
      res=> {
        // SE OBTIENEN LAS CUENTAS
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
                this.allMov = res.dto;
                this.filterMoves(1);
              },
              err => {
                  this.errorService();
                  console.log('Something went wrong!' + err.message);
              }
            );
            /* FIN BLOQUE PARA CONSULTAR DETALLE DE PORTABILIDADES */
          },
          err => {
            this.errorService();
            console.log('Something went wrong!' + err.message);
          }
        );
      },
      err => {
          this.errorService();
          console.log('Something went wrong!' + err.message);
      }
    );
    /* SE DESCOMENTA ESTE BLOQUE */
  }
  private errorService(){
    var message = new messageAlert("Error","Por el momento el servicio no esta disponible");
    this.alertMan.sendMessage(message);
  }
  private filterMoves(idBtn:number){
    console.log("LLENANDO...")
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
    console.log(this.totalMov);
    console.log("LLENO...")
  }

}
