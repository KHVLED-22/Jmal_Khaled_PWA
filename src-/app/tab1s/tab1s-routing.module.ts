import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Tab1sComponent } from './tab1s.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: Tab1sComponent }])],
    exports: [RouterModule]
})
export class Tab1sRoutingModule {}
