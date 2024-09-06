import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListPointagesComponent} from './listPointages/list-pointages/list-pointages.component'
import {PointagesRoutingModule} from './pointages-routing.module'
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
import { ConfirmComponent } from '../confirm/confirm.component';
import { ConfirmModule } from '../confirm/confirm.module';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [
    CalendarModule,
    ColorPickerModule,
    CheckboxModule,
    TabViewModule,
    MultiSelectModule,
    MenuModule,
    MenubarModule,
    ToggleButtonModule,
    CommonModule,
    PointagesRoutingModule,
    // CategoriesRoutingModule,
    CommonModule,
    CrudRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    InputSwitchModule,
    EditorModule,
    ConfirmModule,
    PaginatorModule,
      ],
      declarations: [
        ListPointagesComponent
      ],
})
export class PointagesModule { }