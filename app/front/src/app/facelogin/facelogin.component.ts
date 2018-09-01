import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AlertService, AuthService, FaceService } from '../shared';
import { environment } from '../../environments/environment';
import { EmailValidator } from '@angular/forms';
 
@Component({
    selector: 'app-facelogin',
    templateUrl: './facelogin.component.html',
    styleUrls: ['./facelogin.component.scss'],
    animations: [routerTransition()]
})

export class FaceLoginComponent {
    
    loading = false;
    @ViewChild("fileInput") fileInput;
    
    model: any = {

    };

    constructor(private router: Router, 
        public authService: AuthService, 
        private alertService: AlertService,
        private faceService: FaceService) {
    }

    login() {
        var that = this;
        this.loading = true;
        
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
                    const formData = new FormData();
                    formData.append("file", result);
                    that.faceService.getAzureFaceId(formData).subscribe(
                        res => {
                            that.authService.faceLogin(that.model.password, res.faceId)
                            .subscribe(
                                data => {
                                    that.router.navigate(['/dashboard']);
                                },
                                error => {
                                    that.alertService.error(error.json().message);
                                    that.loading = false;
                                });
                        },
                        error => {
                            that.alertService.error(error.json().message);
                            that.loading = false;
                        });
                });
            });
            
        }
    }
}
