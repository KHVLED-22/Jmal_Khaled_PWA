import { Categorie } from 'src/app/demo/api/categorie';
import { CategorieService } from './../../../service/categorie.service';
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { AjouterArticleComponent } from '../ajouter-article/ajouter-article.component';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/demo/service/article.service';
import { article } from 'src/app/demo/api/article';
import { MarqueService } from 'src/app/demo/service/marque.service';

@Component({
  selector: 'app-liste-article',
  templateUrl: './liste-article.component.html',
  styleUrl: './liste-article.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class ListeArticleComponent {
    // @ViewChild(AjouterArticleComponent) AjouterArticle!: AjouterArticleComponent;
    

    menuItems: MenuItem[] = [];

    loading: boolean = false;
    totalRecords:number = 0;
    pageSize:number = 10;

    selectedArticles:any[]=[]

    showFilters: boolean = false;
    Articles:article[] = [];
    searchTerm:string='';
    selectedNomArticle:any[]=[]
    selectedRefArticle:any[]=[]
    selectedEtatArticle:any[]=[]
    selectedCategorieArticle:any[]=[]
    selectedMarquesArticle:any[]=[]
    Categories:Categorie[] = [];
    Marques:any[] = [];
    Etat:string[]=['Activé','Non Activé']
    EtatArticle:any[]= [];
    prixInitial:any
    prixVente:any
    remise:any
    quantite:any
    filter:any
    ArticleFilter:article[] = [];
    ArticleToUpdate:any
    constructor(private router: Router, private messageService: MessageService,private articleService:ArticleService,private categorieService:CategorieService,private marqueService:MarqueService) {}

    async ngOnInit() {

        this.menuItems = [
            {
                label: 'Modifier',
                icon: 'pi pi-pencil',
                command: () =>this.navigateToComponentWithParams()


                // routerLink:'/attribut/ajouter-couleur'
            },
            {
                label: 'Supprimer',
                icon: 'pi pi-fw pi-trash',
                // command: () =>this.showConfirmDialog(this.colorToUpdate)
            },

        ];
      await  this.categorieService.getCategorie().then((categorie) =>this.Categories=categorie.categories)
      await this.marqueService.getMarques().then((marque) =>this.Marques=marque.marques)
        console.log('marque',this.Marques)
        console.log('categ',this.Categories)


        this.articleService.getArticles().then((articles) => {
            this.ArticleFilter=articles.articles;

        })


}



async loadCustomers(event?: TableLazyLoadEvent) {

    console.log(event)
    let currentPage: number;
    if (event?.first !== undefined && event?.rows !== undefined && event?.rows !== null && event?.rows !== 0) {
        currentPage = event?.first / event?.rows + 1;
        this.pageSize = event?.rows
        this.pageSize = event?.rows

    } else {
        currentPage = 1;

    }
    console.log(currentPage,this.pageSize)

        this.loading = true;


        this.articleService.getArticles(this.searchTerm,this.pageSize,currentPage,event?.sortField,event?.sortOrder,this.filter).then((articles) => {
            this.Articles=articles.articles;
            this.totalRecords=articles.pagination.total
            console.log(this.Articles);
            this.loading = false;

        })



    }

showFilter(){
    this.showFilters=!this.showFilters
}
showFiche(){
    this.router.navigate(['/article/ajouter-article']);
}
menuOnShow(Article:any)
{
   console.log(Article)
   this.ArticleToUpdate=Article
//    this.colorToUpdate=color
}


navigateToComponentWithParams() {
    const queryParams = {
        // Define your data here
        // For example:
        id: this.ArticleToUpdate.id
        // Add more properties as needed
    };

    // Navigate to the component with query parameters
    this.router.navigate(['/article/ajouter-article'], { queryParams });
}



async   Rechercher(event :any){
    console.log((event.target as HTMLInputElement).value)
    let  newValue = (event.target as HTMLInputElement).value
    this.searchTerm=newValue
    this.loadCustomers()

    // await this.couleurService.getCouleurs(newValue,this.pageSize,1,event.sortField,event.sortOrder).then((data:any) =>
    // { this.couleurs = data.attribut
    //  this.totalRecords=data.pagination.total
    //  console.log('couleurs:', this.couleurs);
    //  });

    }

    switchOnChange(article:article){

    }

    changeSelection(field:string, event:any){
        console.log(field,event)
        // if(field=='nom_article'){
        //     this.selectedNomArticle=event
        // }
        // if(field=='reference'){
        //     this.selectedRefArticle=event
        // }
        if(field=='activer'){
            this.EtatArticle = event.value.map((value:any) => value === 'Non Activé' ? false : true);
            console.log(this.EtatArticle)

        }
        // if(field=='categorie'){
        //     this.selectedCategorieArticle=event
        // }
        // if(field=='marque'){
        //     this.selectedMarquesArticle=event
        // }
        // console.log(this.selectedNomArticle,this.selectedRefArticle,this.selectedEtatArticle,this.selectedCategorieArticle,this.selectedMarquesArticle)
        // this.loadCustomers()
    }
    Filtrer(){

            if(this.selectedNomArticle.length>0 || this.selectedRefArticle.length>0  || this.selectedEtatArticle.length>0
                || this.selectedCategorieArticle.length>0  || this.selectedMarquesArticle.length>0
                || this.quantite || this.remise || this.prixInitial || this.prixVente ){
                    console.log(this.selectedNomArticle,this.selectedRefArticle,this.selectedEtatArticle
                        ,this.selectedMarquesArticle,this.selectedCategorieArticle  , this.quantite, this.remise, this.prixInitial, this.prixVente)


                 this.filter={
                    nom_article:this.selectedNomArticle,
                    reference:this.selectedRefArticle,
                    activer:this.EtatArticle,
                    categories:this.selectedCategorieArticle,
                    marque:this.selectedMarquesArticle,
                    qte_Total:this.quantite,
                    // remise:this.remise,
                    prix_achat:this.prixInitial,
                    prix_vente:this.prixVente
                }
            this.loadCustomers()

            }

}

}

