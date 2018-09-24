import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InfoCardMan{
  private subject = new Subject<any>();

  sendMessage(message: any){
    this.subject.next({value:message});
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}


export class MessageInfoCard {
  nombreCliente : string;
  fechaNacimiento : string;
  rfcCliente: string;
  constructor(){
    this.nombreCliente = "";
    this.fechaNacimiento = "";
    this.rfcCliente = "";
  }
}
