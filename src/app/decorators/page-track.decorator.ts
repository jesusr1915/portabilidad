import { Injector } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
export  function  PageTrack(pageName: string): ClassDecorator {
    return  function(constructor: any) {
        const  injector  =  Injector.create([{provide: AnalyticsService, deps: [ ]}]);
        const  analytics:  AnalyticsService  =  injector.get(AnalyticsService);
        const  ngOnInit  =  constructor.prototype.ngOnInit;
        constructor.prototype.ngOnInit  =  function ( ...args ) {
            analytics.enter(pageName);
            // tslint:disable-next-line:no-unused-expression
            ngOnInit  &&  ngOnInit.apply( this, args );
        };
    };
}
