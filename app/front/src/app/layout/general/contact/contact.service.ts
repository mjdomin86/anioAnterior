import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs/Observable';
import {environment} from '../../../../environments/environment';

@Injectable()
export class ContactService { 

    backend = `${environment.domain_back}/api/private`;
    
    constructor(private _http: InterceptorService) {}
    
}