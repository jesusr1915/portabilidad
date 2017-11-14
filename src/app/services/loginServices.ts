import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService{
  private serviceUrlAnalyse = 'https://qai.supermovil.mx:2443/SuperMovil/loginAnalyzeS2U.go';
  private serviceUrlSegment = 'https://qai.supermovil.mx:2443/SuperMovil/loginSegmentacion.go';
  private serviceUrlSaldos = 'https://qai.supermovil.mx:2443/SuperMovil/saldosCuentasCheques.do'
  private body = '';
  private headers = new Headers();
  data: any = {};

  constructor(public http:Http) {
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

  getSaldos(){
    //return this.http.get(this.serviceUrlSaldos)
    return this.http.get('api/cuentaCheques.json')
    .map(res => res.json())
  }
}
