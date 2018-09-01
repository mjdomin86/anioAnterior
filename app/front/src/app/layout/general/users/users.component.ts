import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { UserService, AlertService } from '../../../shared';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: [routerTransition()]
})
export class UsersComponent implements OnInit {
    
    users = [];
    user: any = {};
    userLogged = null;

    
    
    constructor(private userService: UserService, 
                private alertService: AlertService
    ) {}

    ngOnInit() {
        var that = this;
        this.userService.get().subscribe(
            profile => {
                that.userLogged = profile;
                that.getUsers();
            }, 
            err => {
                console.error(err);
            });
    }

    getUsers() {
        this.userService.getAll().subscribe(
            users => {
                this.users = users;
            }, 
            err => {
                console.error(err);
            });
    }

    delete(id) {
        this.userService.delete(id).subscribe(
            response => {
                //console.log(response);
                this.alertService.success("User Deleted");
                this.getUsers();
            }, 
            err => {
                console.error(err);
                this.alertService.error(err.json().message);
            });
    }

    onRoleSelectItem(checked, index, role){
        console.log(JSON.stringify(this.users[index].roles));
        console.log(this.users[index].roles.length);
        if(checked && this.users[index].roles.indexOf(role) === -1 ){
            this.users[index].roles.push(role);
        }else{
            if(this.users[index].roles.length === 1){
                this.alertService.error('the user must have at least one role');
                return;
            }
            this.users[index].roles.splice(this.users[index].roles.indexOf(role), 1);
        }
        console.log(JSON.stringify(this.users[index].roles));
        this.update(this.users[index]);
    }
    
    update(user) {
        this.userService.updateRol(user).subscribe(
            response => {
                //console.log(response);
                this.alertService.success("User updated");
                this.user = {};
                this.getUsers();
            }, 
            err => {
                console.error(err);
                this.alertService.error(err.json().message);
            });
    }

}
