import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

import { SpinnerMan } from '../spinner-component/spinnerMng';

@Injectable()
export class LoginService{
  private ENV = "dev";
  private urlBase = 'https://sp-lightweight-gateway-mxsantanderplus1-'+ this.ENV +'.appls.cto1.paas.gsnetcloud.corp';

  private serviceConfig = '/config.json';
  private serviceOAuth = this.urlBase + '/token';
  private serviceValidator = this.urlBase + '/tokenmanager/tokenValidatorWS'
  private serviceUrlSaldos = this.urlBase + '/clientes/saldosCuentasCheques';
  private serviceUrlRFC = this.urlBase + '/clientes/consultaRFCPN';
  private serviceUrlClabeBancos = this.urlBase + '/bancos/bancoCuenta';
  private serviceUrlBancos = this.urlBase + '/bancos/consultaBancos';
  private serviceUrlAlta = this.urlBase + '/portabilidad/altaRecepcionPN';
  private serviceUrlDetalleConsulta = this.urlBase + '/portabilidad/consultaPN';

  private body = '';
  private headers = new Headers();
  private options;
  data: any = {};

  token = "";

  constructor(public http:Http, public spinnerMng : SpinnerMan) {
    this.getConfig()
    .subscribe(
      res => {
        this.ENV = res.ENV_VAR;
        localStorage.setItem('ENV',this.ENV);
        console.log(res);
      },
      err => {
        this.ENV = "dev";
        localStorage.setItem('ENV',this.ENV);
      }
    )
  }

  getConfig(){
    this.configHeader(false);
    return this.getRequest(this.serviceConfig,this.options);
  }

  postOAuthToken(){
    this.configHeader(false);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append ('client_id','b63dae8e-3dc5-4652-a1c1-cb3f3c2b4a29');
    urlSearchParams.append ('clientSecret','6pW&z3A4lVbzF?$,?GFtEI)Q/j=J/d');
    let body = urlSearchParams.toString();
    return this.postRequest(this.serviceOAuth,body,this.options);
  }

  postValidator(tokenUrl){
    this.configHeader(true);
    let urlSearchParams = {
      'token': tokenUrl
    }
    let body = JSON.stringify(urlSearchParams);
    return this.postRequest(this.serviceValidator,body,this.options)
  }

  getConsultaRFC(){
    this.configHeader(false);
    return this.getRequest(this.serviceUrlRFC,this.options);
  }

  getSaldos(){
    this.configHeader(false);
    return this.getRequest(this.serviceUrlSaldos,this.options);
    //return this.http.get('api/cuentaCheques.json')
  }
  postBancosClabe(cuenta : string){
    this.configHeader(true);
    let urlSearchParams = {
      'cuenta': cuenta
    }
    let body = JSON.stringify(urlSearchParams);
    return this.postRequest(this.serviceUrlClabeBancos,body,this.options)
  }
  postBancos(){
    this.configHeader(true);
    return this.postRequest(this.serviceUrlBancos,"",this.options);

  }
  postAlta(datosEntrada : any){
    this.configHeader(true);
    // let urlSearchParams = new URLSearchParams();
    // urlSearchParams.append ('datosEntrada',datosEntrada);
    // urlSearchParams.toString();
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlAlta,body,this.options)
    //return this.http.get('api/alta.json')
  }
  postDetalleConsulta(datosEntrada: any){
    this.configHeader(true);
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlDetalleConsulta,body,this.options);
  }
  getRequest(url:string, xtras:string){
    this.spinnerMng.showSpinner(true);
    return this.http.get(url,xtras)
    .map((response) => {
      this.spinnerMng.showSpinner(false);
      console.log(response.json());
      return response.json()
      })
      .catch((e) => {
        this.spinnerMng.showSpinner(false);
        return Observable.throw(
          new Error(`${ e.status } ${ e.statusText }`)
        );
      });
  }
  postRequest(url:string, body:string, xtras:string){
    this.spinnerMng.showSpinner(true);
    return this.http.post(url,body,xtras)
    .map((response) => {
      this.spinnerMng.showSpinner(false);
      if(url == this.serviceOAuth){
        this.token = response.json().access_token;
      }
      return response.json()
      })
      .catch((e) => {
        this.spinnerMng.showSpinner(false);
        return Observable.throw(
          new Error(`${ e.status } ${ e.statusText }`)
        );
      });
  }

  configHeader(json:boolean){
    this.headers = new Headers();
    if(json){
      this.headers.append("Content-Type", 'application/json');
    }else{
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }
    let sessionID = 'JSESSIONID='+ localStorage.getItem('sessionID') + ";";
    this.headers.append('Cookie1', sessionID + ' HTTPOnly; Path=/; Secure');
    let tokentemp = 'Bearer '+this.token;
    this.headers.append('Authorization', tokentemp);
    this.options = new RequestOptions({ headers: this.headers, withCredentials: true });

  }
}
