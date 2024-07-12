import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListeMarqueComponent } from './liste-marque/liste-marque.component';
import { AjouterMarqueComponent } from './ajouter-marque/ajouter-marque.component';



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
        { path: 'liste-marque', component: ListeMarqueComponent , data: { breadcrumb: 'Liste Marques' }},
        { path: 'ajouter-marque', component: AjouterMarqueComponent },
        // { path: 'fiche-categorie', component: FicheCategorieComponent , data: { breadcrumb: 'Fiche Catégorie' }}
    ])
  ],
})
export class MarqueRoutingModule { }
