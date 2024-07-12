import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            // { path: '', loadChildren: () => import('./demo/components/dashboards/dashboards.module').then((m) => m.DashboardsModule) },
            // { path: '', data: { breadcrumb: 'Pointages' }, loadChildren: () => import('./demo/components/pointages/pointages.module').then((m) => m.PointagesModule) },
            { path: '', redirectTo: '/pointages/list-pointages', pathMatch: 'full' },
            { path: 'uikit', data: { breadcrumb: 'UI Kit' }, loadChildren: () => import('./demo/components/uikit/uikit.module').then((m) => m.UIkitModule) },
            { path: 'utilities', data: { breadcrumb: 'Utilities' }, loadChildren: () => import('./demo/components/utilities/utilities.module').then((m) => m.UtilitiesModule) },
            { path: 'pages', data: { breadcrumb: 'Pages' }, loadChildren: () => import('./demo/components/pages/pages.module').then((m) => m.PagesModule) },
            { path: 'profile', data: { breadcrumb: 'User Management' }, loadChildren: () => import('./demo/components/profile/profile.module').then((m) => m.ProfileModule) },
            { path: 'documentation', data: { breadcrumb: 'Documentation' }, loadChildren: () => import('./demo/components/documentation/documentation.module').then((m) => m.DocumentationModule) },
            { path: 'blocks', data: { breadcrumb: 'Prime Blocks' }, loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then((m) => m.PrimeBlocksModule) },
            { path: 'ecommerce', data: { breadcrumb: 'E-Commerce' }, loadChildren: () => import('./demo/components/ecommerce/ecommerce.module').then((m) => m.EcommerceModule) },
            { path: 'apps', data: { breadcrumb: 'Apps' }, loadChildren: () => import('./demo/components/apps/apps.module').then((m) => m.AppsModule) },
            { path: 'categories', data: { breadcrumb: 'Categories' }, loadChildren: () => import('./demo/components/categories/categories.module').then((m) => m.CategoriesModule) },
            { path: 'confirm', loadChildren: () => import('./demo/components/confirm/confirm.module').then((m) => m.ConfirmModule) },
            { path: 'marques', data: { breadcrumb: 'Marques' }, loadChildren: () => import('./demo/components/marques/marques.module').then((m) => m.MarquesModule) },
            { path: 'attribut', data: { breadcrumb: 'Attributs' }, loadChildren: () => import('./demo/components/attribut/attribut.module').then((m) => m.AttributModule) },
            { path: 'article', data: { breadcrumb: 'Articles' }, loadChildren: () => import('./demo/components/article/article.module').then((m) => m.ArticleModule) },
            { path: 'pointages', data: { breadcrumb: 'Pointages' }, loadChildren: () => import('./demo/components/pointages/pointages.module').then((m) => m.PointagesModule) },
            { path: 'etablissement', data: { breadcrumb: 'Etablissement' }, loadChildren: () => import('./demo/components/Etablissement/etablissement/etablissement.module').then((m) => m.EtablissementModule) },
            { path: 'machine', data: { breadcrumb: 'Machine' }, loadChildren: () => import('./demo/components/Machine/machine/machine.module').then((m) => m.MachineModule) },
            { path: 'societe', data: { breadcrumb: 'Societe' }, loadChildren: () => import('./demo/components/societes/societe/societe.module').then((m) => m.SocieteModule) },
            { path: 'departement', data: { breadcrumb: 'Departement' }, loadChildren: () => import('./demo/components/Departement/departement/departement.module').then((m) => m.DepartementModule) },
            { path: 'equipe', data: { breadcrumb: 'Equipe' }, loadChildren: () => import('./demo/components/equipe/equipe/equipe.module').then((m) => m.EquipeModule) },
            { path: 'planing', data: { breadcrumb: 'Planning' }, loadChildren: () => import('./demo/components/planing/planing.module').then((m) => m.PlaningModule) },
            { path: 'GRPplaning', data: { breadcrumb: 'Groupe planing' }, loadChildren: () => import('./demo/components/planing/planing.module').then((m) => m.PlaningModule) },
            { path: 'contract', data: { breadcrumb: 'Contrat' }, loadChildren: () => import('./demo/components/contract/contract/contract.module').then((m) => m.ContractModule) },  
            { path: 'poste', data: { breadcrumb: 'Poste' }, loadChildren: () => import('./demo/components/poste/poste/poste.module').then((m) => m.PosteModule) },   
            { path: 'employe', data: { breadcrumb: 'Employe' }, loadChildren: () => import('./demo/components/Employe/employe.module').then((m) => m.EmployeModule) },   
            { path: 'listemploye', data: { breadcrumb: 'List Employe' }, loadChildren: () => import('./demo/components/Employe/employe.module').then((m) => m.EmployeModule) },  
       
        ]
    },
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./demo/components/auth/auth.module').then((m) => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then((m) => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then((m) => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

