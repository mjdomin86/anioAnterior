import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { UserService, AlertService, ProviderService } from '../../../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PageHeaderModule } from './../../../shared'; 
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-providers',
    templateUrl: './providers.component.html',
    styleUrls: ['./providers.component.scss'],
    animations: [routerTransition()]
})
export class ProvidersComponent implements OnInit {
    
    profile: any = {};
    loading = false;
    private providerConfig = environment.provider_config;
    
    constructor(private userService: UserService, 
                private alertService: AlertService,
                private router : Router,
                public providerService: ProviderService

    ) {}

    ngOnInit() {
        this.getProfile();
    }

    providerPermission(provider){
        this.providerService.auth(provider,this.providerConfig);
        console.log(this.providerConfig);
    }

    getProfile() {
        this.userService.get().subscribe(
            res => {
                console.log(res);
                this.profile = res;
            }, 
            err => {
                console.log(err);
            });
    }

    update() {
        this.loading = true;
        this.userService.update(this.profile).subscribe(
            response => {
                console.log(response);
                this.alertService.success("Profile Updated");
                this.loading = false;
                this.alertService.profileChanged(this.profile);
            }, 
            err => {
                console.log(err);
                this.alertService.error(err.json().message);
                this.loading = false;
            });
    }
}
