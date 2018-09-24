import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertMan{
  private subject = new Subject<any>();

  sendMessage(message: any){
    this.subject.next({title:message});
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}


export class MessageAlert {
  title: string;
  body: string;
  button: string;
  icon: string;
  code: number;

  constructor(
    title: string,
    body: string,
    button: string,
    icon: string,
    code: number,
  ){
    if(title !== "") {
      this.title = title;
    } else {
      this.title = "";
    } 
    if(body !== "") {
      this.body = body;
    } else {
      this.body = "Por el momento el servicio no esta disponible"
    } 
      this.button = "Aceptar"
      this.icon = "assets/imgs/ico-info.svg"
      this.code = code;
  }
}
