import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FaceLoginRoutingModule } from './facelogin-routing.module';
import { FaceLoginComponent } from './facelogin.component';

@NgModule({
    imports: [
        CommonModule,
        FaceLoginRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [FaceLoginComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FaceLoginModule {
}
