import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListPointagesComponent} from './listPointages/list-pointages/list-pointages.component'

import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'list-pointages', component: ListPointagesComponent }, 
  ])],
  exports: [RouterModule]
  
})
export class PointagesRoutingModule { }
