import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Rx";
import "rxjs/Rx";

declare function test(): any;

@Injectable()
export class WKWebViewService {
  private SSOTokenParams =
    '{ "name": "getSSOToken", "parameters": null, "callbackName": "ssotokenResponse"}';

  private superTokenParams =
    '{ "name": "superToken", "parameters": null, "callbackName": "supertokenResponse"}';

  public getSSOToken = new Observable((subscriber) => {
    (window as any).ssotokenResponse = (res: any) => {
      let tokenSSO = JSON.parse(res).params.code;
      subscriber.next(tokenSSO);
      subscriber.complete();
      delete (window as any).ssotokenResponse;
      return;
    };
    let connect = (window as any).webkit.messageHandlers.Connect;
    connect.postMessage(this.SSOTokenParams);
  });

  public getToken = () => {
    console.log("SUPER");

    (window as any).supertokenResponse = (res: any) => {
      console.log("Supertoken response", res);
      let params = JSON.parse(res).params;
      let status = JSON.parse(res).status;
      console.log("Params", params);
      console.log("status", status);

      //delete (window as any).supertokenResponse;
      //return;
    };

    let connect = (window as any).webkit.messageHandlers.TokenManager;
    connect.postMessage(this.superTokenParams);
  };
}
