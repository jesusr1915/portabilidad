import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable} from 'rxjs/Rx';
import { Relation } from 'interfaces/copiesInterface'
import 'rxjs/Rx';

@Injectable()
export class CopiesService{
  private body = '';
  private headers = new Headers();
  data: any = {};

  constructor(public http:Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: this.headers, withCredentials: true });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('json', this.body);

  }

  postCopies() : Observable<Relation> {
  return this.http.get('api/copies.json')
      .map(this.extractData)
  }

  extractData( response : Response){
    let res = response.json();
    return res;
  }
}
