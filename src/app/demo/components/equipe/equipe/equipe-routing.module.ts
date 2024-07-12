import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {EquipeComponent} from './equipe.component'


@NgModule({
  declarations: [],
  imports: [
  RouterModule.forChild([
    { path: 'list-equipe', component: EquipeComponent}, 
])],
})
export class EquipeRoutingModule { }
