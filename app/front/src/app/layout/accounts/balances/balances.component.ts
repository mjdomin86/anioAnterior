import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BalancesService } from './balances.service';

@Component({
    selector: 'app-todos',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.scss'],
    animations: [routerTransition()]
})

export class BalancesComponent implements OnInit {
    
    balances = [];
    balance: any = {};

    constructor(private balancesService: BalancesService, 
                private alertService: AlertService, 
                private modalService: NgbModal
    ) {}

    ngOnInit() {
    }

    getUserBalances() {
        this.balancesService.get().subscribe(
            balances => {
                this.balances = balances;
            }, 
            err => {
                console.error(err);
            });
    }

   
}
