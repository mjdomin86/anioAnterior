import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AlertService, AuthService } from '../shared';
import {environment} from '../../environments/environment';
 
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})

export class LoginComponent {
    
    private authServerBaseUrl = `${environment.domain_back}`;
    private authCallbaclUrl = `${environment.domain_front}/`;
    
    model: any = {};
    loading = false;

    private config = {
        'loginRoute': 'login',
        'facebook': {
            'authEndpoint': this.authServerBaseUrl + '/api/public/auth/facebook',
            'clientId': '2057175457853614',
            'redirectURI' : this.authCallbaclUrl
        },
        'google': {
            'authEndpoint': this.authServerBaseUrl + '/api/public/auth/google',
            'clientId': '487554491038-dh88rn74pug8ce40mbef6c75iigsahjt.apps.googleusercontent.com',
            'redirectURI' : this.authCallbaclUrl
        }
    };

    constructor(private router: Router, public authService: AuthService, private alertService: AlertService) {
    }
    facebookLogin() {
       this.authService.auth('facebook', this.config);
    }
    googleLogin() {
       this.authService.auth('google', this.config);
    }

    login() {
        this.loading = true;
        this.authService.basicLogin(this.model.email, this.model.password)
            .subscribe(
                data => {
                    this.router.navigate(['/dashboard']);
                },
                error => {
                    this.alertService.error(error.json().message);
                    this.loading = false;
                });
    }

    loginCaptcha(rescaptchaResponse: string, formValid: boolean) {
        if (rescaptchaResponse != "" && formValid){
            this.login();
        }
    }
}
