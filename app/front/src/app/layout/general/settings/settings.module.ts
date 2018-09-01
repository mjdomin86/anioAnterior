import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component'; 
import { SettingsService } from './settings.service';
import { PageHeaderModule } from './../../../shared'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        PageHeaderModule,
        TranslateModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [SettingsComponent],
    providers: [
        SettingsService
    ]
})
export class SettingsModule { }