import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

import { SpinnerMan } from '../spinner-component/spinnerMng';

@Injectable()
export class LoginService{
  private ENV: string;
  private urlBase = 'https://sp-lightweight-gateway-mxsantanderplus1-'+ this.ENV +'.appls.cto1.paas.gsnetcloud.corp';

  private serviceConfig = '/config.json';
  private serviceOAuth: string;
  private serviceValidator: string;
  private serviceUrlSaldos: string;
  private serviceUrlRFC: string;
  private serviceUrlClabeBancos: string;
  private serviceUrlBancos: string;
  private serviceUrlAlta: string;
  private serviceUrlDetalleConsulta: string;

  private body = '';
  private headers = new Headers();
  private options;
  data: any = {};
  token = "";

  constructor(public http:Http, public spinnerMng : SpinnerMan) {
    // this.getConfig()
    // .subscribe(
    //   res => {
    //     this.ENV = res.ENV_VAR;
    //     localStorage.setItem('ENV', this.ENV);
    //   },
    //   err => {
    //     this.ENV = "pre";
    //     localStorage.setItem('ENV', this.ENV);
    //   }
    // )
  }

  getUrlBase(){
    return this.urlBase = 'https://sp-lightweight-gateway-mxsantanderplus1-' + localStorage.getItem('ENV') + '.appls.cto1.paas.gsnetcloud.corp';
  }

  getUrls(){
    this.serviceOAuth = this.getUrlBase() + '/token';
    this.serviceValidator = this.getUrlBase() + '/tokenmanager/tokenValidatorWS'
    this.serviceUrlSaldos = this.getUrlBase() + '/clientes/saldosCuentasCheques';
    this.serviceUrlRFC = this.getUrlBase() + '/clientes/consultaRFCPN';
    this.serviceUrlClabeBancos = this.getUrlBase() + '/bancos/bancoCuenta';
    this.serviceUrlBancos = this.getUrlBase() + '/bancos/consultaBancos';
    this.serviceUrlAlta = this.getUrlBase() + '/portabilidad/altaRecepcionPN';
    this.serviceUrlDetalleConsulta = this.getUrlBase() + '/portabilidad/consultaPN';
  }

  getConfig(){
    this.configHeader(false);
    return this.getRequest(this.serviceConfig,this.options);
  }

  postOAuthToken(){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.configHeader(false);
    let urlSearchParams = new URLSearchParams();
    if(localStorage.getItem('ENV') == "dev"){
      urlSearchParams.append ('client_id','b63dae8e-3dc5-4652-a1c1-cb3f3c2b4a29');
      urlSearchParams.append ('clientSecret','6pW&z3A4lVbzF?$,?GFtEI)Q/j=J/d');
    } else {
      urlSearchParams.append ('client_id','cff38f0b-967c-4cc1-ba80-5cfee626d3ea');
      urlSearchParams.append ('clientSecret','2z2Bo9p!4{$ryY1lDw?>KW&a.j#OZw');
    }
    // AQUI VA EL CLIENT ID PARA EL AMBIENTE ADECUADO
    let body = urlSearchParams.toString();
    return this.postRequest(this.serviceOAuth,body,this.options);
  }

  postValidator(tokenUrl){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.configHeader(true);
    let urlSearchParams = {
      'token': tokenUrl
    }
    let body = JSON.stringify(urlSearchParams);
    return this.postRequest(this.serviceValidator,body,this.options)
  }

  getConsultaRFC(){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.configHeader(false);
    return this.getRequest(this.serviceUrlRFC,this.options);
  }

  getSaldos(){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.configHeader(false);
    return this.getRequest(this.serviceUrlSaldos,this.options);
    //return this.http.get('api/cuentaCheques.json')
  }
  postBancosClabe(cuenta : string){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.configHeader(true);
    let urlSearchParams = {
      'cuenta': cuenta
    }
    let body = JSON.stringify(urlSearchParams);
    return this.postRequest(this.serviceUrlClabeBancos,body,this.options)
  }
  postBancos(){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.configHeader(true);
    return this.postRequest(this.serviceUrlBancos,"",this.options);

  }
  postAlta(datosEntrada : any){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.configHeader(true);
    // let urlSearchParams = new URLSearchParams();
    // urlSearchParams.append ('datosEntrada',datosEntrada);
    // urlSearchParams.toString();
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlAlta,body,this.options)
    //return this.http.get('api/alta.json')
  }
  postDetalleConsulta(datosEntrada: any){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.configHeader(true);
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlDetalleConsulta,body,this.options);
  }
  getRequest(url:string, xtras:string){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.spinnerMng.showSpinner(true);
    return this.http.get(url,xtras)
    .map((response) => {
      this.spinnerMng.showSpinner(false);
      //console.log(response.json());
      return response.json()
      })
      .catch((e) => {
        this.spinnerMng.showSpinner(false);
        return Observable.throw(
          e.json()
          //new Error(`${ e.status } ${ e.statusText }`)
        );
      });
  }
  postRequest(url:string, body:string, xtras:string){
    // OBTIENE LAS URLS DE ACUERDO AL AMBIENTE
    this.getUrls();

    this.spinnerMng.showSpinner(true);
    return this.http.post(url,body,xtras)
    .map((response) => {
      //console.log("RESPONSE", response);
      this.spinnerMng.showSpinner(false);
      if(url == this.serviceOAuth){
        this.token = response.json().access_token;
        localStorage.setItem('tokenTemp', this.token);
      }
      return response.json()
      })
      .catch((e: any) => {
        this.spinnerMng.showSpinner(false);
        return Observable.throw(
          e.json()
          // new Error({"ERROR": e.json()})
        );
      });
  }

  question = [{},{},{},{}]

  configHeader(json:boolean){
    this.headers = new Headers();
    if(json){
      this.headers.append("Content-Type", 'application/json');
    }else{
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }
    let sessionID = 'JSESSIONID='+ localStorage.getItem('sessionID') + ";";

    this.headers.append('Cookie1', sessionID + ' HTTPOnly; Path=/; Secure');

    this.token = localStorage.getItem('tokenTemp')
    let tokentemp = 'Bearer '+this.token;
    this.headers.append('Authorization', tokentemp);
    this.options = new RequestOptions({ headers: this.headers, withCredentials: true });

  }
}
