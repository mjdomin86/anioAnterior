import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDocsRoutingModule } from './api-docs-routing.module';
import { ApiDocsComponent } from './api-docs.component';
import { PageHeaderModule, SafePipe } from './../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        ApiDocsRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
    ],
    declarations: [ApiDocsComponent, SafePipe]
    
})
export class ApiDocsModule { }