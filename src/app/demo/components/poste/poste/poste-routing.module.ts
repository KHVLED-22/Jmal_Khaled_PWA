import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {PosteComponent} from './poste.component'


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'list-poste', component : PosteComponent }, 
  ])],
})
export class PosteRoutingModule { }
