import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeComponent} from './employe/employe.component'
import { ListemployeComponent} from './listemploye/listemploye.component'

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'employe', component: EmployeComponent}, 
      { path: 'list-employe', component: ListemployeComponent}, 
  ])],
})
export class EmployeRoutingModule { }
