import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListeAttributComponent } from './liste-attribut/liste-attribut.component';
import { AjouterAttributComponent } from './ajouter-attribut/ajouter-attribut.component';
import { ListeCouleurComponent } from './liste-couleur/liste-couleur.component';
import { AjouterCouleurComponent } from './ajouter-couleur/ajouter-couleur.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
        { path: 'liste-attribut', component: ListeAttributComponent , data: { breadcrumb: 'Liste Attributs' }},
        { path: 'ajouter-attribut', component: AjouterAttributComponent },
        { path: 'liste-couleur', component: ListeCouleurComponent , data: { breadcrumb: 'Liste Couleurs' }},
        { path: 'ajouter-couleur', component: AjouterCouleurComponent }

    ])
  ]
})
export class AttributRoutingModule { }
