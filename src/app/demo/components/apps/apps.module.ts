import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsRoutingModule } from './apps-routing.module';
import { KanbanAppModule } from './kanban/kanban.app.module';

@NgModule({
    imports: [CommonModule, AppsRoutingModule,KanbanAppModule],
    declarations: [],
    exports:[KanbanAppModule]
})
export class AppsModule {}
export { KanbanAppModule };

