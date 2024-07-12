import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {PlaningComponent} from './planing/planing.component'
import {GroupePlaningComponent} from './GRPplaning/groupe-planing.component'

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'list-planing', component : PlaningComponent }, 
      { path: 'groupe-planing', component : GroupePlaningComponent }, 
  ])],
})
export class PlaningRoutingModule { }
