import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent, SidebarComponent, FooterComponent} from '../shared';
import {ShareModule} from 'ng2share/share.module';

@NgModule({
    imports: [
        CommonModule,
        NgbDropdownModule.forRoot(),
        LayoutRoutingModule,
        TranslateModule,
        ShareModule
    ],
    declarations: [
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
    ]
})
export class LayoutModule { }
