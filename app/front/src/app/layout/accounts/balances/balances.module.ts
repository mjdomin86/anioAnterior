import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BalancesRoutingModule } from './balances-routing.module';
import { BalancesComponent } from './balances.component';
import { BalancesService } from './balances.service';
import { PageHeaderModule } from '../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        BalancesRoutingModule,
        PageHeaderModule,
        TranslateModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [BalancesComponent],
    providers: [
        BalancesService
    ]
})
export class BalancesModule { }

