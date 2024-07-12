import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { AjouterArticleComponent } from './ajouter-article/ajouter-article.component';
import { ListeArticleComponent } from './liste-article/liste-article.component';
import { ModifierVariationComponent } from './modifier-variation/modifier-variation.component';
import { AjouterImagesComponent } from './ajouter-images/ajouter-images.component';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { InplaceModule } from 'primeng/inplace';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { ListImageComponent } from './list-image/list-image.component';
import { CardImageComponent } from './card-image/card-image.component';
import { AttributRoutingModule } from '../attribut/attribut-routing.module';
import { CrudRoutingModule } from '../pages/crud/crud-routing.module';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';
import { ConfirmModule } from '../confirm/confirm.module';
import { PaginatorModule } from 'primeng/paginator';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenubarModule } from 'primeng/menubar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { AccordionModule } from 'primeng/accordion';
import { ImageService } from '../../service/image.service';
import { ListboxModule } from 'primeng/listbox';



@NgModule({
    imports: [
        CommonModule,
        ArticleRoutingModule,
        FormsModule,
        DragDropModule,
        ButtonModule,
        RippleModule,
        ProgressBarModule,
        AvatarModule,
        AvatarGroupModule,
        InputTextModule,
        ChipsModule,
        CalendarModule,
        DropdownModule,
        InputTextareaModule,
        SidebarModule,
        MenuModule,
        InplaceModule,
        AutoCompleteModule,
        TooltipModule,
        TieredMenuModule,
        OverlayPanelModule,
        CheckboxModule,

        CrudRoutingModule,
        TableModule,
        FileUploadModule,

        ToastModule,
        ToolbarModule,
        RatingModule,

        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        InputSwitchModule,
        EditorModule,
        ConfirmModule,
        PaginatorModule,
        ColorPickerModule,
        TabViewModule,
        MultiSelectModule,
        MenubarModule,
        ToggleButtonModule,
        TreeSelectModule,
        TreeTableModule,
        AccordionModule,
        CdkDropList,
        CdkDrag,
        ListboxModule






     ],
  declarations: [
    ListeArticleComponent,
    AjouterArticleComponent,
    ModifierVariationComponent,
    AjouterImagesComponent,
    ListImageComponent,
    CardImageComponent
  ],
  providers: [ImageService]


})
export class ArticleModule { }
