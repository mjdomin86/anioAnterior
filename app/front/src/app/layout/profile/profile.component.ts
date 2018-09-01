import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService, AlertService } from '../../shared'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    animations: [routerTransition()]
})
export class ProfileComponent implements OnInit {
    
    profile: any = {};
    loading = false;
    
    constructor(private userService: UserService, 
                private alertService: AlertService,
                private router : Router

    ) {}

    ngOnInit() {
        this.getProfile();
    }

    getProfile() {
        this.userService.get().subscribe(
            res => {
                //console.log(res);
                this.profile = res;
            }, 
            err => {
                console.error(err);
            });
    }

    update() {
        this.loading = true;
        this.userService.update(this.profile).subscribe(
            response => {
                //console.log(response);
                this.alertService.success("Profile Updated");
                this.loading = false;
                this.alertService.profileChanged(this.profile);
            }, 
            err => {
                console.error(err);
                this.alertService.error(err.json().message);
                this.loading = false;
            });
    }
}
