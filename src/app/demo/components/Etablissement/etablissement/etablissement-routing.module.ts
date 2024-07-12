import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {EtablissementComponent} from './etablissement.component'



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'list-etab', component: EtablissementComponent }, 
  ])],
})
export class EtablissementRoutingModule { }
