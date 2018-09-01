import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Router } from '@angular/router';
import { AlertService, UserService, FaceService } from '../shared/services/index';
import { EmailValidator } from '@angular/forms';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {

    model: any = {};
    loading = false;
    faceImagePath = null;
    faceImageSrc = null;
    
    @ViewChild("fileInput") fileInput;
 
    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private faceService: FaceService) {

    }
   

    register() {
        this.loading = true;
        var that = this;
        
        /*let fileBrowser = this.fileInput.nativeElement;
        if (fileBrowser.files && fileBrowser.files[0]) {
            

            that.faceService.rotateImage(fileBrowser.files[0], function(error, rotate) {
                if(error){
                    that.alertService.error(error.message);
                    that.loading = false;
                    return;
                }
                that.faceService.resizeImage(rotate, 500, function(error, result) {
                    if(error){
                        that.alertService.error(error.message);
                        that.loading = false;
                        return;
                    }
                    const formData = new FormData();
                    formData.append("file", result);
                    formData.append("email", that.model.email);
                    that.faceService.add(formData).subscribe(
                        res => {
                            that.createUser(res);
                        },
                        error => {
                            that.alertService.error(error.json().message);
                            that.loading = false;
                        });
                });
            });
            
        }else{
            this.createUser(null);
        }*/

        if(this.faceImageSrc){
            const formData = new FormData();
            formData.append("file", this.faceImageSrc);
            formData.append("email", that.model.email);
            that.faceService.add(formData).subscribe(
                res => {
                    that.createUser(res);
                },
                error => {
                    that.alertService.error(error.json().message);
                    that.loading = false;
                });
        }else{
            this.createUser(null);
        }
    }

    createUser(res){
        if(res){
            this.model.faceId = res.faceId;
        }
        this.userService.create(this.model).subscribe(
            data => {
                this.alertService.success('You were successfully registered, please enter your login credentials.', true);
                this.router.navigate(['/login']);
            },
            error => {
                this.alertService.error(error.json().message);
                this.loading = false;
            });
    }

    ngOnInit() { }

    readImage() {
        var that = this;
        let fileBrowser = this.fileInput.nativeElement;
        if (fileBrowser.files && fileBrowser.files[0]) {
            that.faceService.rotateImage(fileBrowser.files[0], function(error, rotate) {
                if(error){
                    that.alertService.error(error.message);
                    that.loading = false;
                    return;
                }
                that.faceService.resizeImage(rotate, 500, function(error, result) {
                    if(error){
                        that.alertService.error(error.message);
                        that.loading = false;
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function(fileReader){
                        var reader = fileReader.target;
                        that.faceImagePath = reader;
                    }
                    reader.readAsDataURL(result);
                    that.faceImageSrc = result;
                });
            });
        }
    }


    

    
}
