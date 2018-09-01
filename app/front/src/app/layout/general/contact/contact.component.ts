import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ContactService } from './contact.service';
import { AlertService } from '../../../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-todos',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    animations: [routerTransition()]
})

export class ContactComponent implements OnInit {
    
    payments = [];
    payment: any = {};

    constructor(private contactService: ContactService, 
                private alertService: AlertService, 
                private modalService: NgbModal
    ) {}

    ngOnInit() {
    }
    
}
