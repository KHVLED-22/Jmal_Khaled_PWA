import { TreeSelectModule } from 'primeng/treeselect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributRoutingModule } from '../attribut/attribut-routing.module';
import { CrudRoutingModule } from '../pages/crud/crud-routing.module';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';
import { ConfirmModule } from '../confirm/confirm.module';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ListeArticleComponent } from './liste-article/liste-article.component';
import { AjouterArticleComponent } from './ajouter-article/ajouter-article.component';

import { TreeTableModule } from 'primeng/treetable';
import { AccordionModule } from 'primeng/accordion';
import { ModifierVariationComponent } from './modifier-variation/modifier-variation.component';
import { AjouterImagesComponent } from './ajouter-images/ajouter-images.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KanbanAppRoutingModule } from '../apps/kanban/kanban.app-routing.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ChipsModule } from 'primeng/chips';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { InplaceModule } from 'primeng/inplace';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { KanbanAppModule } from "../apps/kanban/kanban.app.module";
import { ListImageComponent } from './list-image/list-image.component';
import { CardImageComponent } from './card-image/card-image.component';
import { RouterModule } from '@angular/router';
@NgModule({
    declarations: [

    ],
    imports: [
        RouterModule.forChild([
            { path: 'liste-article', component: ListeArticleComponent , data: { breadcrumb: 'Liste Articles' }},
            { path: 'ajouter-article', component: AjouterArticleComponent , data: { breadcrumb: 'Fiche Article' } },
            { path: 'modifier-variation', component: ModifierVariationComponent},
            { path: 'ajouter-images', component: AjouterImagesComponent },
            { path: 'list-image', component: ListImageComponent },
            { path: 'card-image', component: CardImageComponent }


        ])
    ]
})
export class ArticleRoutingModule { }
