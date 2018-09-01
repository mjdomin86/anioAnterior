import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackService } from './feedback.service';
import { PageHeaderModule } from './../../shared';
import { BarRatingModule } from "ngx-bar-rating";

@NgModule({
    imports: [
        CommonModule,
        FeedbackRoutingModule,
        PageHeaderModule,
        TranslateModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        BarRatingModule
    ],
    declarations: [FeedbackComponent],
    providers: [
        FeedbackService
    ]
})
export class FeedbackModule { }