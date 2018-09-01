import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { PageHeaderModule } from './../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
        PageHeaderModule,
        TranslateModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [UsersComponent]
})
export class UsersModule { }