import { Injectable } from '@angular/core';
declare var dataLayer: any;
@Injectable()
export class AnalyticsService {

  constructor() {

  }

  enter(pageName: string): void {
    if ((typeof dataLayer) !== 'undefined') {
      dataLayer.push({
        'event': 'Pageview',
        'nombrePagina': pageName
      });
    }
  }

  enviarDimension(dimension: any, valor: any): void {
    if ((typeof dataLayer) !== 'undefined') {
      dataLayer.push({ 'event': 'sendDimension', [String(dimension)]: String(valor) });
    }
  }

  enviarMetrica(metrica: any, valor: number): void {
    if ((typeof dataLayer) !== 'undefined') {
      dataLayer.push({ 'event': 'sendMetric', [String(metrica)]: String(valor) });
    }
  }
}
