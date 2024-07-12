import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ContractComponent} from './contract.component'

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'list-contract', component : ContractComponent }, 
  ])],
})
export class ContractRoutingModule { }
