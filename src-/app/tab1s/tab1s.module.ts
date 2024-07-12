import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab1sComponent } from './tab1s.component';
import { Tab1sRoutingModule } from './tab1s-routing.module'; //


@NgModule({
  declarations: [
    Tab1sComponent
  ],
  imports: [
    CommonModule,
    Tab1sRoutingModule //
  ],
  exports: [
    Tab1sComponent
  ]
})
export class Tab1sModule { }