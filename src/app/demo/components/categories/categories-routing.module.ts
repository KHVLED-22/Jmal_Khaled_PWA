import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListeCategorieComponent } from './liste-categorie/liste-categorie.component';
import { AjouterCategorieComponent } from './ajouter-categorie/ajouter-categorie.component';
import { FicheCategorieComponent } from './fiche-categorie/fiche-categorie.component';

// const routes: Routes = [
//     { path: '', component: ListeCategorieComponent }
//   ];

@NgModule({
//   declarations: [],
  imports: [
    // CommonModule,
    // RouterModule.forRoot(routes)
    RouterModule.forChild([
        { path: 'liste-categorie', component: ListeCategorieComponent , data: { breadcrumb: 'Liste Catégorie' }},
        { path: 'ajouter-categorie', component: AjouterCategorieComponent },
        { path: 'fiche-categorie', component: FicheCategorieComponent , data: { breadcrumb: 'Fiche Catégorie' }}])
  ],
  exports: [RouterModule]

})
export class CategoriesRoutingModule { }
