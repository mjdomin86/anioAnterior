import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { environment } from '../../../environments/environment';
import { InterceptorService } from 'ng2-interceptors';
import {  Router,Route, NavigationStart, 
          Event as NavigationEvent, 
          NavigationCancel,
          RoutesRecognized,
          CanActivate,CanActivateChild,CanLoad,
          ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ProviderService  {

  
  private code:string;
  private backend = `${environment.domain_back}`;
  private frontend = `${environment.domain_front}`;
  
  
  
  constructor(private _http: InterceptorService, private router:Router, private location: Location) {
    let config = localStorage.getItem("providerConfigGateway");
    let provider = localStorage.getItem("providerGateway");
    
    let params = new URLSearchParams(this.location.path(false).split('?')[1]);
    this.code = params.get('code');  

    
    
    
    if(location.path().indexOf('/provider') !== -1 && this.code){
      console.log(this.code);
       this.accesToken(this.code,provider, config);
      

      
    }
  }
  

  accesToken(code:any,provider:any, config:any):Promise<any>{
    var body = {"code" : code,"provider" : provider,
                "redirectURI": this.frontend + JSON.parse(config).redirectURI}

    return this._http.post(this.backend + JSON.parse(config).accessTokenUri,body,{})
    .toPromise()
     .then((r: Response) => { 
      })
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
  
  
  public auth(provider:string, authConfig: any):void{
    
    localStorage.setItem("providerConfigGateway",JSON.stringify(authConfig));
    localStorage.setItem("providerGateway",provider);

    console.log("provider:" + provider)
    window.location.href = authConfig[provider]['href'];

  }

  

}