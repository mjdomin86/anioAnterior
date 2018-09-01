import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProvidersRoutingModule } from './providers-routing.module';
import { ProvidersComponent } from './providers.component';
import { UserService } from './../../../shared';
import { PageHeaderModule } from './../../../shared'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ProvidersRoutingModule,
        TranslateModule,
        PageHeaderModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [ProvidersComponent],
    providers: [
        UserService
    ]
})
export class ProvidersModule { }