import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/index';

@Component({
   moduleId: module.id,
   selector: 'alert',
   styleUrls: ['./alert.component.scss'],
   templateUrl: 'alert.component.html'
})

export class AlertComponent {
   message: any;
 
   constructor(private alertService: AlertService) { }
   ngOnInit() {
       this.alertService.getMessage().subscribe(
           message => {
               this.message = message;
               let that = this;
               setTimeout(function(){
                   that.message = null;
               }, 9000);
            });
   }
}