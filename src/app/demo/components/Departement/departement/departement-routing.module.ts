import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DepartementComponent} from './departement.component'


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'list-departement', component: DepartementComponent}, 
  ])],
})
export class DepartementRoutingModule { }
