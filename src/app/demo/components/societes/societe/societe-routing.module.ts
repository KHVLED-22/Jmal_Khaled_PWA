import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {SocieteComponent} from './societe.component'


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'list-societe', component: SocieteComponent}, 
  ])],
})
export class SocieteRoutingModule { }
