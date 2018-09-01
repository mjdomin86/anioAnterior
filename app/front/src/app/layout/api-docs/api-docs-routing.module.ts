import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiDocsComponent } from './api-docs.component';

const routes: Routes = [
    { path: '', component: ApiDocsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiDocsRoutingModule { }