import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/index';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { Router, NavigationStart } from '@angular/router';
 
@Injectable()
export class UserService {

    private backend = `${environment.domain_back}`;
    
    constructor(private _http: InterceptorService) { 
        
    }
 
    get() : Observable<any> {
        // ...using get request
        return this._http.get(`${this.backend}/api/private/profile`)
            // ...and calling .json() on the response to return data
            .map((res:Response) => 
                res.json()
            )
            //...errors if any
            .catch((error:any) => Observable.throw(error || 'Server error'))
            ;
    }

    create(user: User) : Observable<any>{
        return this._http.post(`${this.backend}/api/public/auth/signup`,user)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
 
    update(user: User) : Observable<any>{
        return this._http.put(`${this.backend}/api/private/profile`,user)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    getAll() : Observable<any>{
        return this._http.get(`${this.backend}/api/private/users`)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    delete(id) : Observable<any>{
        return this._http.delete(`${this.backend}/api/private/users/${id}`)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
    updateRol(user: User) : Observable<any>{
        return this._http.put(`${this.backend}/api/private/users`, user)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

}