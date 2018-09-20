import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MenuMsg{
  private subject = new Subject<any>();

  sendMessage(message: number){
    // console.log("SENDING MESSAGE...");
    this.subject.next({response: message});
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
