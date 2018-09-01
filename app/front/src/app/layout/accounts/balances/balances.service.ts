import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs/Observable';
import {environment} from '../../../../environments/environment';

@Injectable()
export class BalancesService { 

    backend = `${environment.domain_back}/api/private`;
    
    constructor(private _http: InterceptorService) {}

    getBalances(): Observable<any> {
        return this._http.get(`${this.backend}/user/payments`)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    get() : Observable<any>{
        return this._http.get(`${this.backend}/payments/`)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

   
}