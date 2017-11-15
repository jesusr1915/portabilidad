import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

import { SpinnerMan } from '../spinner-component/spinnerMng';

@Injectable()
export class LoginService{
  private serviceUrlAnalyse = 'https://qai.supermovil.mx:2443/SuperMovil/loginAnalyzeS2U.go';
  private serviceUrlSegment = 'https://qai.supermovil.mx:2443/SuperMovil/loginSegmentacion.go';

  private urlBase = 'https://sp-lightweight-gateway-mxsantanderplus1-dev.appls.cto1.paas.gsnetcloud.corp';

  private serviceOAuth = this.urlBase + '/token';
  private serviceUrlSaldos = this.urlBase + '/cuentas/saldosCuentasCheques';
  private serviceUrlRFC = this.urlBase + '/clientes/consultaRFCPN';
  private body = '';
  private headers = new Headers();
  data: any = {};

  constructor(public http:Http, public spinnerMng : SpinnerMan) {
    this.configHeader();
  }

  postOAuthToken(){
    let options = new RequestOptions({ headers: this.headers, withCredentials: true });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append ('client_id','b63dae8e-3dc5-4652-a1c1-cb3f3c2b4a29');
    urlSearchParams.append ('clientSecret','6pW&z3A4lVbzF?$,?GFtEI)Q/j=J/d');
    let body = urlSearchParams.toString();
    this.spinnerMng.showSpinner(true);
    return this.http.post(this.serviceOAuth,body,options)
    .map((response) => {
      this.spinnerMng.showSpinner(false);
      return response.json()
      })
      .catch((e) => {
        this.spinnerMng.showSpinner(false);
        return Observable.throw(
          new Error(`${ e.status } ${ e.statusText }`)
        );
      });
  }

  getconsultaRFC(token : string){
    this.configHeader();
    let tokentemp = 'Bearer '+token;
    this.headers.append('Authorization', tokentemp);
    let options = new RequestOptions({ headers: this.headers, withCredentials: true });
    return this.http.get(this.serviceUrlRFC,options)
    .map((response) => {
      this.spinnerMng.showSpinner(false);
      return response.json()
      })
      .catch((e) => {
        this.spinnerMng.showSpinner(false);
        return Observable.throw(
          new Error(`${ e.status } ${ e.statusText }`)
        );
      });
  }
  getSaldos(token : string){
    this.configHeader();
    let tokentemp = 'Bearer '+token;
    this.headers.append('Authorization', tokentemp);
    let options = new RequestOptions({ headers: this.headers, withCredentials: true });
    return this.http.get(this.serviceUrlSaldos,options)
    //return this.http.get('api/cuentaCheques.json')
    .map((response) => {
      this.spinnerMng.showSpinner(false);
      return response.json()
      })
      .catch((e) => {
        this.spinnerMng.showSpinner(false);
        return Observable.throw(
          new Error(`${ e.status } ${ e.statusText }`)
        );
      });
  }

  configHeader(){
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Cookie1', 'JSESSIONID=0001mpNoV1PyUsLjHh_co0JpGUj:16na4i7kv; HTTPOnly; Path=/; Secure');
  }

  postLoginAnalyzeS2U() {
   this.body = '{"claveCliente":"00015486","collectData":{"HardwareID":"000000000000000","SDK_VERSION":"3.5.0","TIMESTAMP":"20160907221129"},"devicePrint":""}';

  this.headers = new Headers();
  this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  let options = new RequestOptions({ headers: this.headers, withCredentials: true });
  let urlSearchParams = new URLSearchParams();
  urlSearchParams.append('json', this.body);
  return this.http.post(this.serviceUrlAnalyse,urlSearchParams)
      .map(res => res.json())
  }

  postLoginSegment(){
    this.body = '{"collectData":{"HardwareID":"000000000000000","SDK_VERSION":"3.5.0","TIMESTAMP":"20160907221129"},"devicePrint":"","nip":"prueba12"}';
    let options = new RequestOptions({ headers: this.headers, withCredentials: true });

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('json', this.body);
    return this.http.post(this.serviceUrlSegment,urlSearchParams,options)
    .map(res => res.json())
  }


}
