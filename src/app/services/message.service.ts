import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { AlertMessage } from '../../interfaces/alert-message';

@Injectable()
export class MessageService {

  private subject = new Subject<any>();

  sendMessage(message: AlertMessage){
    const msgAlert = this._setMessage(message);
    this.subject.next(msgAlert);
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  private _setMessage(msg: AlertMessage): AlertMessage {
    msg.title = msg.title ? msg.title : "Atención";
    msg.body = msg.body ? msg.body : "Por el momento el servicio no está disponible, por favor intente de nuevo más tarde.";
    msg.buttonAccept = msg.buttonAccept ? msg.buttonAccept : "Aceptar";
    msg.buttonCancel = msg.buttonCancel ? msg.buttonCancel : null;
    msg.item = msg.item ? msg.item : null;
    return msg;
  }

}
