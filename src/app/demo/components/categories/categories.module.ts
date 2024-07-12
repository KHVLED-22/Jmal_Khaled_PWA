import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { ListeCategorieComponent } from './liste-categorie/liste-categorie.component';
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
import { AjouterCategorieComponent } from './ajouter-categorie/ajouter-categorie.component';
import { FicheCategorieComponent } from './fiche-categorie/fiche-categorie.component';
import { EditorModule } from 'primeng/editor';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ConfirmModule } from '../confirm/confirm.module';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
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
    PaginatorModule

      ],
      declarations: [
        ListeCategorieComponent,
        AjouterCategorieComponent,
        FicheCategorieComponent,
      ],
})
export class CategoriesModule { }
