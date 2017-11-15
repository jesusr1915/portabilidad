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


export class messageAlert {
  title : string;
  body : string;
  constructor(
    title:string,
    body:string
  ){
    this.title = title;
    this.body = body;
  }
}
