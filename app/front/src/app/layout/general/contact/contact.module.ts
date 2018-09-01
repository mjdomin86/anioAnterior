import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component'; 
import { ContactService } from './contact.service';
import { PageHeaderModule } from './../../../shared'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ContactRoutingModule,
        PageHeaderModule,
        TranslateModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [ContactComponent],
    providers: [
        ContactService
    ]
})
export class ContactModule { }