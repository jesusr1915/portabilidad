import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { SettingsService } from '../services/settings.service';
import { ActivatedRoute  } from '@angular/router';

@Injectable()
export class AppLoadService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
          setTimeout(() => {
            // doing something
            resolve();
          }, 3000);
        });
  }

  getSettings(): Promise<any> {
    localStorage.clear();
    return this.httpClient.get('/config.json')
      .toPromise()
      .then(res => {
        console.log("ERROR");
        localStorage.setItem("env", res['ENV_VAR']);
        localStorage.setItem("dom", res['DOMAIN']);
      })
      .catch(err =>{
        localStorage.setItem("env", SettingsService.ENV_VAR);
        localStorage.setItem("dom", SettingsService.DOMAIN);
      });
  }

}
