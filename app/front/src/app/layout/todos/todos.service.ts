import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

// declare var process;

@Injectable()
export class TodosService { 

    backend = `${environment.domain_back}/api/private`;
    
    constructor(private _http: InterceptorService) {}

    getMyTodos(): Observable<any> {
        return this._http.get(`${this.backend}/user/todos`)
        .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    getOne(id): Observable<any> {
        return this._http.get(`${this.backend}/todos/${id}`)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    get() : Observable<any>{
        // se usa este metodo??????
        return this._http.get(`${this.backend}/todos/`)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    create(todo) : Observable<any>{
        return this._http.post(`${this.backend}/todos/`, todo)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    update(todo) : Observable<any>{
        return this._http.put(`${this.backend}/todos`, todo)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
 
    delete(id) : Observable<any>{
        return this._http.delete(`${this.backend}/todos/${id}`)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
 
   
}