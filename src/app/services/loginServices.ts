import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

import { SpinnerMan } from '../spinner-component/spinnerMng';

@Injectable()
export class LoginService{
  private env: string;
  private urlBase = 'https://sp-lightweight-gateway-mxsantanderplus1-'+ this.env +'.appls.cto1.paas.gsnetcloud.corp';
  private urlLogin = 'https://sp-login-mxsantanderplus1-'+ this.env +'.appls.cto1.paas.gsnetcloud.corp';

  private serviceConfig = '/config.json';
  private serviceOAuth: string;
  private serviceValidator: string;
  private serviceUrlSaldos: string;
  private serviceUrlRFC: string;
  private serviceUrlClabeBancos: string;
  private serviceUrlBancos: string;
  private serviceUrlAlta: string;
  private serviceUrlDetalleConsulta: string;

  private serviceUrlSaldosSP: string;
  private serviceUrlAltaSP: string;
  private serviceUrlDineroCrecienteSP: string;

  private serviceUrlModificaSP: string;
  private serviceUrlActualizaSP: string;

  private serviceUrlOtp: string;

  private body = '';
  private headers = new Headers();
  private options;
  data: any = {};
  token = "";

  constructor(public http:Http, public spinnerMng : SpinnerMan) {
    // PORTABILIDAD
    this.serviceOAuth = this.getUrlBase() + '/token';
    this.serviceValidator = this.getUrlBase() + '/tokenmanager/tokenValidatorWS'
    this.serviceUrlSaldos = this.getUrlBase() + '/clientes/saldosCuentasCheques';
    this.serviceUrlRFC = this.getUrlBase() + '/clientes/consultaRFCPN';
    this.serviceUrlClabeBancos = this.getUrlBase() + '/bancos/bancoCuenta';
    this.serviceUrlBancos = this.getUrlBase() + '/bancos/consultaBancos';
    this.serviceUrlAlta = this.getUrlBase() + '/portabilidad/altaRecepcionPN';
    this.serviceUrlDetalleConsulta = this.getUrlBase() + '/portabilidad/consultaPN';
    // INSCRIPCION
    this.serviceUrlSaldosSP = this.getUrlBase() + '/clientes/saldosCuentasChequesSantanderPlus';
    this.serviceUrlAltaSP = this.getUrlBase() + '/santanderplus/registraCuentaSantanderPlus';
    this.serviceUrlDineroCrecienteSP = this.getUrlBase() + '/santanderplus/dineroCreciente'
    // CAMBIO DE CUENTA
    this.serviceUrlModificaSP = this.getUrlBase() + '/santanderplus/isModificarSantanderPlus';
    this.serviceUrlActualizaSP = this.getUrlBase() + '/santanderplus/insertaActualizaCuentasSantanderPlus';
    // OTP MAGICA
    this.serviceUrlOtp = this.getUrlBase() + '/otp';
  }

  getUrlBase(){
    return this.urlBase = 'https://sp-lightweight-gateway-mxsantanderplus1-' + localStorage.getItem('env') + '.appls.cto1.paas.gsnetcloud.corp';
  }

  getUrlLogin(){
    return this.urlLogin = 'https://sp-login-mxsantanderplus1-' + localStorage.getItem('env') + '.appls.cto1.paas.gsnetcloud.corp/login';
  }

  getUrls(){
    // PORTABILIDAD
    this.serviceOAuth = this.getUrlBase() + '/token';
    this.serviceValidator = this.getUrlBase() + '/tokenmanager/tokenValidatorWS'
    this.serviceUrlSaldos = this.getUrlBase() + '/clientes/saldosCuentasCheques';
    this.serviceUrlRFC = this.getUrlBase() + '/clientes/consultaRFCPN';
    this.serviceUrlClabeBancos = this.getUrlBase() + '/bancos/bancoCuenta';
    this.serviceUrlBancos = this.getUrlBase() + '/bancos/consultaBancos';
    this.serviceUrlAlta = this.getUrlBase() + '/portabilidad/altaRecepcionPN';
    this.serviceUrlDetalleConsulta = this.getUrlBase() + '/portabilidad/consultaPN';
    // INSCRIPCION
    this.serviceUrlSaldosSP = this.getUrlBase() + '/clientes/saldosCuentasChequesSantanderPlus';
    this.serviceUrlAltaSP = this.getUrlBase() + '/santanderplus/registraCuentaSantanderPlus';
    this.serviceUrlDineroCrecienteSP = this.getUrlBase() + '/santanderplus/dineroCreciente'
    // CAMBIO DE CUENTA
    this.serviceUrlModificaSP = this.getUrlBase() + '/santanderplus/isModificarSantanderPlus';
    this.serviceUrlActualizaSP = this.getUrlBase() + '/santanderplus/insertaActualizaCuentasSantanderPlus';
    // OTP MAGICA
    this.serviceUrlOtp = this.getUrlBase() + '/otp';
  }

  getConfig(){
    this.configHeader(false);
    return this.getRequest(this.serviceConfig,this.options);
  }

  postLogin(datosEntrada: any){
    this.configHeader(true);
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.getUrlLogin(),body,this.options);
  }

  postOAuthToken(){
    this.getUrls();
    this.configHeader(false);
    let urlSearchParams = new URLSearchParams();
    if(localStorage.getItem('env') == "dev"){
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
    this.configHeader(true);
    let urlSearchParams = {
      'token': tokenUrl
    }
    let body = JSON.stringify(urlSearchParams);
    return this.postRequest(this.serviceValidator,body,this.options)
  }

  // =================== SERVICIOS MOCK UP
  getSaldosMock(){
    this.configHeader(false);
    return this.getRequest('api/saldosCuentasCheques.json','');
  }

  getConsultaRFCMock(){
    this.configHeader(false);
    return this.getRequest('api/consultaRFC.json','');
  }

  getBancosMock(){
    this.configHeader(false);
    return this.getRequest('api/consultaBancos.json','');
  }

  getDetalleConsultaMock(){
    this.configHeader(true);
    return this.getRequest('api/consultaPN.json','');
  }

  getSaldosSPMock(){
    this.configHeader(false);
    return this.getRequest('api/saldosCuentasChequesSP.json','');
  }

  getAltaSPMock(){
    this.configHeader(false);
    return this.getRequest('api/altaSP.json','');
  }

  getDineroCrecienteSPMock(){
    this.configHeader(false);
    return this.getRequest('api/dineroCreciente.json','');
  }

  getModificaSPMock(){
    this.configHeader(false);
    return this.getRequest('api/isModificarSantanderPlus.json','');
  }

  getActualizaSPMock(){
    this.configHeader(false);
    return this.getRequest('api/insertaActualizaCuentasSantanderPlus.json','');
  }

  // =================== SERVICIOS DE PORTABILIDAD
  getConsultaRFC(){
    this.configHeader(false);
    return this.getRequest(this.serviceUrlRFC,this.options);
  }

  getSaldos(){
    this.configHeader(false);
    return this.getRequest(this.serviceUrlSaldos,this.options);
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
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlAlta,body,this.options)
    //return this.http.get('api/alta.json')
  }

  postDetalleConsulta(datosEntrada: any){
    this.configHeader(true);
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlDetalleConsulta,body,this.options);
  }

  postOtp(datosEntrada: any){
    this.configHeader(true);
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlOtp,body,this.options);
  }

  // =================== SERVICIOS DE INSCRIPCION DE CUENTA
  getSaldosSP(){
    this.configHeader(false);
    return this.getRequest(this.serviceUrlSaldosSP,this.options);
  }

  postAltaSP(datosEntrada: any){
    this.configHeader(true);
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlAltaSP,body,this.options)
  }

  postDineroCrecienteSP(){
    this.configHeader(true);
    return this.postRequest(this.serviceUrlDineroCrecienteSP,'',this.options)
  }

  // =================== SERVICIOS DE MODIFICACION DE CUENTA
  postModificaSP(){
    this.configHeader(true);
    let body = JSON.stringify('');
    return this.postRequest(this.serviceUrlModificaSP,body,this.options);
  }

  postActualizaSP(datosEntrada: any){
    this.configHeader(true);
    let body = JSON.stringify(datosEntrada);
    return this.postRequest(this.serviceUrlActualizaSP,body,this.options)
  }

  // =================== FUNCIONES GET Y POST GENERICAS
  getRequest(url:string, xtras:string){
    // this.spinnerMng.showSpinner(true);
    return this.http.get(url,xtras)
    .map((response) => {
        // this.spinnerMng.showSpinner(false);
        // localStorage.setItem('env', response.json().ENV_VAR);
        return response.json()
      })
      .catch((e) => {
        // this.spinnerMng.showSpinner(false);
        // localStorage.setItem('env', 'pre');
        return Observable.throw(
          e.json()
          //new Error(`${ e.status } ${ e.statusText }`)
        );
      });
  }

  postRequest(url:string, body:string, xtras:string){
    // this.spinnerMng.showSpinner(true);
    return this.http.post(url,body,xtras)
    .map((response) => {
      //console.log("RESPONSE", response);
      // this.spinnerMng.showSpinner(false);
      if(url == this.serviceOAuth){
        this.token = response.json().access_token;
        localStorage.setItem('bearer', this.token);
      }
      return response.json()
      })
      .catch((e: any) => {
        // this.spinnerMng.showSpinner(false);
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

    this.token = localStorage.getItem('bearer')
    let bearer = 'Bearer '+this.token;
    this.headers.append('Authorization', bearer);
    this.options = new RequestOptions({ headers: this.headers, withCredentials: true });

  }
}
