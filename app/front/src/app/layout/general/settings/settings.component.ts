import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { SettingsService } from './settings.service';
import { AlertService } from '../../../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-todos',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    animations: [routerTransition()]
})

export class SettingsComponent implements OnInit {
    
    payments = [];
    payment: any = {};

    constructor(private settingsService: SettingsService, 
                private alertService: AlertService, 
                private modalService: NgbModal
    ) {}

    ngOnInit() {
    }
    
}
