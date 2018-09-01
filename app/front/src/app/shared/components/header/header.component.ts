import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, UserService, AlertService } from '../../services';
import { User } from '../../models';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    user: User = new User();

    pushRightClass: string = 'push-right';

    constructor( private translate: TranslateService, public router: Router,
                 private authService: AuthService, private userService: UserService,
                 private alertService: AlertService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.getUserProfile();
    }

    getUserProfile() {
        this.alertService.obsProfile.subscribe(profile => {
            this.user['displayName'] = profile['displayName'];
        });
        this.userService.get().subscribe(
            profile => {
                //console.log(profile);
                this.user['_id'] = profile._id;
                this.user['displayName'] = profile.displayName;
                this.user['picture'] = profile.picture ? profile.picture : '/assets/images/flat-avatar.png';
                //console.log(this.user);
                this.alertService.profileLoaded(profile);
            }, 
            err => {
                console.error(err);
            });
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        this.authService.logout();
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
