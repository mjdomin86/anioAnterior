import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../shared';
import { FaceLoginComponent } from './facelogin.component';

const routes: Routes = [
    { path: '', component: FaceLoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthService
  ]
})
export class FaceLoginRoutingModule {}
