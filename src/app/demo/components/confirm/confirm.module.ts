import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmRoutingModule } from './confirm-routing.module';
import { ConfirmComponent } from './confirm.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    ConfirmRoutingModule,
    DialogModule,
    ButtonModule,


  ],
  exports: [
    ConfirmComponent
  ]
})
export class ConfirmModule { }
