import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

@Injectable()
export class FeedbackService { 

    backend = `${environment.domain_back}`;
    
    constructor(private _http: InterceptorService) {}

    add(form: FormData) : Observable<any>{
        return this._http.post(`${this.backend}/api/private/face/feedback`,form)
        .map((response: Response) => response.json())
        .catch((error:any) => Observable.throw(error || 'Server error'));
    }
 
   
}