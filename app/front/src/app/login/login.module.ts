import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import {environment} from '../../environments/environment';


@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        RecaptchaModule.forRoot(), // Keep in mind the "forRoot"-magic nuances!
        RecaptchaFormsModule
    ],
    declarations: [LoginComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    providers: [
        {
          provide: RECAPTCHA_SETTINGS,
          useValue: { siteKey: `${environment.recaptcha}` } as RecaptchaSettings,
        },
      ],    
})
export class LoginModule {
}
