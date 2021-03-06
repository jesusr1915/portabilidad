import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { LoginService } from "../services/loginServices";
import { CopiesService } from "../services/copiesService";
import {
  SeleccionCuentaClass,
  TerminosClass,
} from "../../interfaces/copiesInterface";
import { NgModel } from "@angular/forms";
import { Router, RouterModule, Routes, ActivatedRoute } from "@angular/router";

import { MessageMan } from "../cards/messageMan";
import { StepMan } from "../stepper/stepMan";
import { AlertMan, MessageAlert } from "../message-alert/alertMan";
import { InfoCardMan } from "../personal-card/infoCardMng";

import { Subscription } from "rxjs/Subscription";
import { TermMan } from "../terms/termMng";

import { SpinnerMan } from "../spinner-component/spinnerMng";

declare let ga: any;
declare function getSSO(): any;
declare function requestToken(): any;
import { PageTrack } from "../decorators/page-track.decorator";
import { AnalyticsService } from "../services/analytics.service";
import { WKWebViewService } from "../services/wkWebViewServices";
import { Response } from "@angular/http";
@PageTrack("portabilidad-alta-cliente")
@Component({
  selector: "app-view-alta-cliente",
  templateUrl: "./view-alta-cliente.component.html",
  styleUrls: ["./view-alta-cliente.component.scss", "../app.component.scss"],
})
export class ViewAltaClienteComponent implements OnInit {
  title = "app";
  entry = "";
  copies: SeleccionCuentaClass = new SeleccionCuentaClass();
  terminosText: TerminosClass = new TerminosClass();
  classLabel = "showLabel";
  inputCardInfo = "";
  selectedRadio = "";
  maxLength = "";
  tarjetValue = "";
  selectedBank = "";
  classEnaBank = "contentSelect minTop select-styled";
  classDisBank = "contentSelect minTop select-styled disabled";
  classSelBank = "";
  bankDisable = true;
  sendService = true;
  tipoCuenta = true;
  selectBank = "";
  diablito = false;

  subscription: Subscription;
  subscriptionL: Subscription;
  subscriptionM: Subscription;

  //valid forms
  validClabe = false;
  validBank = true;
  validTerms = false;
  validAccount = true;

  lUsers: any[] = [];
  lBanks: any[] = [
    { id: "0", Name: "Selecciona un banco" },
    //quitar con la red
    /*{ id: 1, Name: 'Bancomer' },
      { id: 2, Name: 'Santander'}*/
  ];

  curUser: any = this.lUsers[0];
  tokenUrl = "";
  tokenType = "";
  pruebasDante = "";

  @Input() valueLabelClabe;
  @Input() valuePlaceHolderClabe;

  constructor(
    private loginServices: LoginService,
    private messageMan: MessageMan,
    private stepMan: StepMan,
    private copiesServ: CopiesService,
    private alertMan: AlertMan,
    private infoCardMng: InfoCardMan,
    private router: Router,
    private termsMng: TermMan,
    private route: ActivatedRoute,
    public spinnerMng: SpinnerMan,
    private analyticsService: AnalyticsService,
    private wkWebViewServices: WKWebViewService
  ) {
    // RECIBE PARAMETROS POR URL CON QUERY
    let tokenSSO = null;
    try {
      tokenSSO = getSSO();
    } catch (err) {}

    if (tokenSSO.wk === true) {
      this.wkWebViewServices.getSSOToken.subscribe((tokenSSO: string) => {
        this.tokenUrl = tokenSSO
          ? tokenSSO
          : this.route.snapshot.queryParamMap.get("token");
      });
    } else if (tokenSSO.connect !== null && tokenSSO.wk === false) {
      this.tokenUrl = tokenSSO
        ? decodeURIComponent(tokenSSO)
        : this.route.snapshot.queryParamMap.get("token");
    }

    console.log("LLAMADA");
    requestToken();

    /* if (test === null) {
      this.wkWebViewServices.getToken();
    } */

    if (
      localStorage.getItem("backButton") !== undefined &&
      localStorage.getItem("backButton") !== null
    ) {
      if (localStorage.getItem("backButton") !== "true") {
        this.reloadData();
      } else {
        // PARA RECUPERAR LOS DATOS DE LA PANTALLA
        localStorage.setItem("fillData", "true");
        localStorage.removeItem("backButton");
      }
    } else {
      // if(localStorage.getItem('sessionID') === "" || localStorage.getItem('sessionID') === undefined || localStorage.getItem('sessionID') === null){
      // SE COMENTA PARA LAS PRUEBAS DE DEV SECOPS
      this.reloadData();
      // }
    }

    this.subscription = this.termsMng.getMessage().subscribe((message) => {
      this.onSaveTermChanged(true);
    });
    this.subscriptionL = this.messageMan.getMessage().subscribe((message) => {
      // console.log("CARRUSEL", message);
      if (message.response === true) {
        this.validAccount = true;
      } else {
        this.validAccount = false;
      }
    });
    this.subscriptionM = this.alertMan.getMessage().subscribe((message) => {
      if (message.title === "done") {
        this.startServices();
        // this.loadMock()
      }
    });
  }

  ngOnInit() {
    // this.loadConfig();
    this.loadCopies();
    let newMessage =
      "Usted está iniciando el proceso de portabilidad de nómina a Santander. ";
    newMessage +=
      "<br/><br/> La portabilidad de nómina es el derecho que tiene usted a decidir en qué banco desea recibir su sueldo, pensión y otras prestaciones de carácter laboral sin costo.";
    this.openAlert("Portabilidad de nómina", newMessage, "", "", 3);
  }

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById(
      "validaSesion"
    ) as HTMLElement;
    element.click();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionL.unsubscribe();
    this.subscriptionM.unsubscribe();
  }

  // loadConfig(){
  //   // SE PIDE LA CONFIGURACIÓN DEL SERVIDOR ANTES DE EJECUTAR SERVICIOS
  //   this.spinnerMng.showSpinner(true);
  //   this.loginServices.getConfig()
  //   .subscribe(
  //     res => {
  //       localStorage.setItem('env', res.ENV_VAR);
  //       localStorage.setItem('dom', res.ENV_DOM);
  //       if(res.ENV_LOG === "false"){
  //         // console.log = function() {};
  //       }
  //     },
  //     err => {
  //       localStorage.setItem('env', 'pre');
  //       localStorage.setItem('dom', 'corp');
  //     }
  //   )
  // }

  loadCopies() {
    this.copiesServ.postCopies().subscribe((res) => {
      this.copies = res.datos.seleccionCuenta;
      this.terminosText = res.datos.terminos;
      this.onSelectionChange(1);
      this.stepMan.sendMessage(1, "Ingrese los datos de su nómina");
    });
  }

  reloadData() {
    // SE COMENTA PARA LAS PRUEBAS DE DEV SECOPS
    // console.log("CLEAR LOCALSTORAGE")
    // if(!localStorage.getItem('sessionID')){
    //   localStorage.clear();
    // }
  }

  recoverSavedData(from) {
    // SE RECUPERA LA INFORMACION CUANDO SE DA BOTON DEL BACK
    if (localStorage.getItem("fillData")) {
      if (localStorage.getItem("tarjet") !== null) {
        if (localStorage.getItem("tarjet").length === 18) {
          this.tipoCuenta = true;
          this.onSelectionChange(1);
        } else {
          this.tipoCuenta = false;
          this.onSelectionChange(2);
        }
        this.tarjetValue = localStorage.getItem("tarjet");
        this.validaCampoCta();
      }
    }
  }

  recoverBankData() {
    // SE RECUPERA LA INFORMACION
    if (localStorage.getItem("fillData")) {
      if (localStorage.getItem("tarjet") !== null) {
        if (localStorage.getItem("tarjet").length === 16) {
          this.selectBank = localStorage.getItem("idBanco");
          this.validBank = true;
          this.validClabe = true;
          this.setNewUser(localStorage.getItem("idBanco"));
        }
      }
    }
  }

  private startServices() {
    this.spinnerMng.showSpinner(true);
    // SERVICIO QUE OBTIENE EL TOKEN OATUH PARA CONSUMIR SERVICIOS
    this.loginServices.postOAuthToken().subscribe(
      (res) => {
        // RECUPERANDO INFORMACION
        this.recoverSavedData("startServices");

        // SE EJECUTA LA PRIMERA VEZ PARA OBTENER EL SESSION ID DEL TOKEN SSO
        if (
          localStorage.getItem("sessionID") === "" ||
          localStorage.getItem("sessionID") === undefined ||
          localStorage.getItem("sessionID") === null
        ) {
          // console.log("TOKEN VALIDATOR")
          // SERVICIO DE VALIDADOR DE TOKEN
          this.loginServices.postValidator(this.tokenUrl).subscribe(
            (response) => {
              // VALIDADOR DE RESPUESTA DE TOKEN
              if (
                response.stokenValidatorResponse.codigoMensaje === "TVT_000"
              ) {
                let pAdicional: any;

                if (response.stokenValidatorResponse.PAdicional) {
                  pAdicional = JSON.parse(
                    decodeURIComponent(
                      decodeURIComponent(
                        response.stokenValidatorResponse.PAdicional
                      )
                    )
                  );
                } else if (response.stokenValidatorResponse.pAdicional) {
                  pAdicional = JSON.parse(
                    decodeURIComponent(
                      decodeURIComponent(
                        response.stokenValidatorResponse.pAdicional
                      )
                    )
                  );
                }

                let mToken = pAdicional;
                let totalSteps = 3;
                if (mToken.OTPId) {
                  if (mToken.OTPId !== "") {
                    totalSteps = 4;
                  }
                }
                localStorage.setItem(
                  "sessionID",
                  mToken.sessionId.substring(11)
                );
                localStorage.setItem("phoneOTP", mToken.OTPId);
                localStorage.setItem("totalSteps", totalSteps.toString());
                this.stepMan.sendMessage(1, "Ingrese los datos de su nómina");
                // SE EJECUTAN LOS SERVICIOS DE CARGA
                this.loadInfo();
              } else {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.openAlert(
                  "Error",
                  response.stokenValidatorResponse.mensaje,
                  "",
                  "",
                  0
                );
              }
              // FIN DE IF DE VALIDADOR DE RESPUESTA DE TOKEN
            },
            (err) => {
              this.spinnerMng.showSpinner(false); // CIERRA LOADER
              this.openAlert("Error", "", "", "", 0);
            }
          );
        } else {
          // SE EJECUTAN LOS SERVICIOS DE CARGA
          this.loadInfo();
        }
      },
      (err) => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.openAlert("Error", "", "", "", 0);
      }
    );
  }

  private loadMock() {
    // RECUPERANDO INFORMACION
    this.recoverSavedData("startServices");

    // SERVICIO DE SALDOS
    this.loginServices.getSaldosMock().subscribe(
      (res3) => {
        // SE LLENA LA INFO DEL CLIENTE
        this.messageMan.sendMessage(res3);

        this.loginServices.getConsultaRFCMock().subscribe(
          (res2) => {
            // SE LLENA LA INFO DEL CLIENTE
            this.infoCardMng.sendMessage(res2.dto);

            this.loginServices.getBancosMock().subscribe(
              (res1) => {
                this.spinnerMng.showSpinner(false);
                if (res1.error.clave === "OK") {
                  for (let arrayVal of res1.dto) {
                    let temp = { id: arrayVal.id, Name: arrayVal.nombreCorto };
                    this.lBanks.push(temp);
                  }
                }
              },
              (err1) => {
                this.spinnerMng.showSpinner(false); // CIERRA LOADER
                this.openAlert("", "", "", "", 0);
              }
            );
          },
          (err2) => {
            this.spinnerMng.showSpinner(false); // CIERRA LOADER
            this.openAlert("", "", "", "", 0);
          }
        );
      },
      (err3) => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.openAlert("", "", "", "", 0);
      }
    );
  }

  loadBancosJson() {
    this.loginServices.getBancosMock().subscribe(
      (res) => {
        this.spinnerMng.showSpinner(false);
        if (res.error.clave === "OK") {
          for (let arrayVal of res.dto) {
            let temp = { id: arrayVal.id, Name: arrayVal.nombreCorto };
            this.lBanks.push(temp);
          }
        }
      },
      (err) => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        this.openAlert("", "", "", "", 0);
      }
    );
  }

  private loadInfo() {
    // SERVICIO DE SALDOS
    this.loginServices.getSaldos().subscribe(
      (res1) => {
        // SE LLENAN LOS CARDS
        this.messageMan.sendMessage(res1);
        // SERVICIO DE CONSULTA DE RFC
        this.loginServices.getConsultaRFC().subscribe(
          (res2) => {
            // SE LLENA LA INFO DEL CLIENTE
            this.infoCardMng.sendMessage(res2.dto);
            // SERVICIO DE CONSULTA DE BANCOS
            this.loginServices.postBancos().subscribe(
              (res3) => {
                // SE LLENA EL LISTADO DE BANCOS
                if (res3.error.clave === "OK") {
                  for (let arrayVal of res3.dto) {
                    let temp = { id: arrayVal.id, Name: arrayVal.nombreCorto };
                    this.lBanks.push(temp);
                  }

                  this.recoverBankData();

                  this.spinnerMng.showSpinner(false); // CIERRA LOADER
                } else {
                  // this.spinnerMng.showSpinner(false); // CIERRA LOADER
                  // this.openAlert(res.error.message);
                  this.loadBancosJson();
                }
              },
              (err3) => {
                // this.spinnerMng.showSpinner(false); // CIERRA LOADER
                // this.openAlert("", "", "", "", 0);
                this.loadBancosJson();
              }
            );
          },
          (err2) => {
            this.spinnerMng.showSpinner(false); // CIERRA LOADER
            this.openAlert("", "", "", "", 0);
          }
        );
      },
      (err1) => {
        this.spinnerMng.showSpinner(false); // CIERRA LOADER
        if (err1.error.clave === "CSCH-SCC-1") {
          this.openAlert(
            "",
            "Los depósitos por concepto de nómina o prestaciones laborales son realizados a su cuenta de cheques. \n\n Por favor acuda a sucursal con identificación oficial vigente y comprobante de domicilio residencial (no mayor a 3 meses) para realizar la portabilidad de nómina.",
            "",
            "",
            0
          );
        } else {
          if (err1.error.message) {
            this.openAlert("", err1.error.message, "", "", 0);
          } else {
            this.openAlert("", "", "", "", 1);
          }
        }
      }
    );
  }

  setNewUser(id: any): void {
    this.curUser = this.lUsers.filter((value) => value.id === id);
    this.analyticsService.enviarDimension("bancoOrigen", this.curUser[0].Name);
    if (this.selectedRadio === "debito") {
      if (id !== "0") {
        this.validBank = true;
      } else {
        this.validBank = false;
      }
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9]+/;
    let inputChar = event.key;
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  private onSaveTermChanged(value: boolean) {
    this.validTerms = value;
    // ga('send', 'event', {
    //   eventCategory: 'terminos',
    //   eventAction: 'aceptarTerminos',
    //   eventValue: 1
    // });
  }

  // PARA EL MENSAJE DE ERROR
  private openAlert(
    tipo?: string,
    mensaje?: string,
    boton?: string,
    icon?: string,
    code?: number
  ) {
    let message = new MessageAlert(tipo, mensaje, boton, icon, code);
    this.alertMan.sendMessage(message);
  }

  onSelectionChange(entry) {
    // radio buttons controll
    this.validBank = false;
    this.validAccount = false;
    this.validClabe = false;
    this.validTerms = false;
    this.selectBank = "0";
    this.tarjetValue = "";
    this.selectedBank = "";
    this.classLabel = "showLabel";
    this.validBank = false;
    if (entry === 1) {
      this.valueLabelClabe = this.copies.textInstClabe;
      this.valuePlaceHolderClabe = this.copies.textPlaceHolderClabe;
      this.maxLength = "18";
      this.selectedRadio = "clabe";
      this.classSelBank = this.classDisBank;
      this.bankDisable = true;
      this.lUsers = [];
    } else {
      this.valueLabelClabe = this.copies.textInstDebito;
      this.valuePlaceHolderClabe = this.copies.textPlaceHolderDebito;
      this.maxLength = "16";
      this.selectedRadio = "debito";
      this.classSelBank = this.classEnaBank;
      this.bankDisable = false;
      this.lUsers = this.lBanks;
    }
    this.analyticsService.enviarDimension(
      "altaMetodoTraspaso",
      this.selectedRadio
    );
  }

  onKey(event: any) {
    // inputs de tarjeta
    this.validaCampoCta();
  }

  validaCampoCta() {
    // inputs de tarjeta
    this.tarjetValue = this.tarjetValue.replace(/[^0-9]/g, "");
    if (this.tarjetValue.length !== 0) {
      this.classLabel = "hideLabel";
      if (this.tarjetValue.length === 18) {
        // this.validacionClabe(this.tarjetValue);
        if (this.sendService) {
          this.spinnerMng.showSpinner(true);
          this.loginServices.postBancosClabe(this.tarjetValue).subscribe(
            (res) => {
              if (res.error.clave === "OK") {
                let recoveredBank = "";
                let idBank = "";
                for (let i = 0; i < this.lBanks.length; i++) {
                  if (this.lBanks[i].Name === res.dto.bancoCuenta) {
                    idBank = this.lBanks[i].id;
                  }
                }

                let temp = { id: idBank, Name: res.dto.bancoCuenta };
                this.lUsers.push(temp);
                this.setNewUser(idBank);
                this.spinnerMng.showSpinner(false);
                this.validClabe = true;
                this.validBank = true;
                this.sendService = false;
                this.selectBank = idBank;
                this.analyticsService.enviarDimension(
                  "bancoOrigen",
                  res.dto.bancoCuenta
                );
              } else {
                this.validClabe = false;
                this.validBank = false;
                this.sendService = false;

                this.openAlert("Error", res.error.message, "Aceptar", "", 0);
              }
            },
            (err) => {
              if (err.error.clave === "ERROR") {
                this.openAlert("Error", err.error.message, "Aceptar", "", 0);
              } else {
                this.openAlert("", "", "", "", 0);
              }
              this.validClabe = false;
              this.validBank = false;
              this.sendService = false;
            }
          );
        }
      } else {
        this.validClabe = false;

        this.sendService = true;

        if (this.selectedRadio === "debito") {
          if (this.tarjetValue.length === 16) {
            this.validClabe = true;
          }
        } else {
          this.lUsers = [];
        }
      }
    } else {
      this.classLabel = "showLabel";
    }
    this.isInvalid();
  }

  // private validacionClabe(clabe: string){
  //   let ponderacion = "37137137137137137";
  //   let clabeA = clabe.substr(0,17);
  //
  //   let arrPond = ponderacion.split('');
  //   let arrClab = clabeA.split('')
  //
  //   for(let i=0; i<arrClab.length; i++){
  //
  //   }
  // }

  isInvalid() {
    this.validAccount = JSON.parse(localStorage.getItem("validAccount"));
    if (
      this.validClabe &&
      this.validBank &&
      this.validTerms &&
      this.validAccount
    ) {
      return false;
    }
    return true;
  }

  /*  getSSOToken() {
    //se declara el callback en el objeto window
    (window as any).ssotokenResponse = (e) => {
      //se recupera el código SSOTOken
      let tokenSSO = JSON.parse(e).params.code;
      //envia la validación de token
      console.log(tokenSSO);

      //en este punto tal vez sea conveniente eliminar este metodo del objeto window
      (window as any).ssotokenResponse.OnDestroy;
    };

    //se recupera el objeto connect
    let connect = (window as any).webkit.messageHandlers.Connect;

    //se hace el llamado al postmessage
    connect.postMessage(
      '{ "name": "getSSOToken", "parameters": null, "callbackName": "ssotokenResponse"}'
    );
  } */

  onBtnActionClickedV() {
    // ga('send', 'event', {
    //   eventCategory: 'tipoOrigen',
    //   eventLabel: this.tipoCuenta,
    //   eventAction: 'seleccion',
    //   eventValue: 1
    // });
    // ga('send', 'event', {
    //   eventCategory: 'bancoOrigen',
    //   eventLabel: this.curUser[0].Name,
    //   eventAction: 'seleccion',
    //   eventValue: 1
    // });
    localStorage.setItem("tarjet", this.tarjetValue);
    localStorage.setItem("idBanco", this.curUser[0].id);
    localStorage.setItem("banco", this.curUser[0].Name);
    this.router.navigate(["/verifica"]);
  }
}
