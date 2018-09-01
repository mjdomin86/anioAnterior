import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService, AlertService, FaceService } from '../../shared'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FeedbackService } from './feedback.service';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
    animations: [routerTransition()]
})
export class FeedbackComponent implements OnInit {
    
    feedback: any = {};
    loading = false;
    faceImagePath = null;
    faceImageSrc = null;
    rate = 0;
    @ViewChild("fileInput") fileInput;
    
    constructor(private modalService: NgbModal,
                private alertService: AlertService,
                private router : Router,
                private faceService: FaceService,
                private feedbackService: FeedbackService

    ) {}

    ngOnInit() {
        
    }

    

    update(content) {
        this.loading = true;
        if(this.faceImageSrc){
            const formData = new FormData();
            formData.append("file", this.faceImageSrc);
            formData.append("comment", this.feedback.comment);
            this.feedbackService.add(formData).subscribe(
                res => {
                    this.rate = res.message;
                    this.loading = false;
                    this.feedback = {};
                    this.faceImagePath = null;
                    this.faceImageSrc = null;
                    this.modalService.open(content);
                },
                error => {
                    this.alertService.error(error.json().message);
                    this.loading = false;
                });
        }else{
            this.alertService.error('Face required');
            this.loading = false;
        }
    }

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
