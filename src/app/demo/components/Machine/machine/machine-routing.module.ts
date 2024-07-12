import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MachineComponent} from './machine.component'



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'list-machine', component: MachineComponent}, 
  ])],
})
export class MachineRoutingModule { }
