import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'app-api-docs',
    template: '<iframe [src]="path | safe" style="width:100%;height:2000px;border:0"></iframe>',
    animations: [routerTransition()]
})
export class ApiDocsComponent {
    
    path = `${environment.domain_back}/api-docs`;
    
}
