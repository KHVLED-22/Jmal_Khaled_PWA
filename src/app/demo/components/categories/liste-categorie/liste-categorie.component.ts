import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AjouterCategorieComponent } from '../ajouter-categorie/ajouter-categorie.component';
import { CategorieService } from 'src/app/demo/service/categorie.service';
import { Categorie } from 'src/app/demo/api/categorie';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-liste-categorie',
  templateUrl: './liste-categorie.component.html',
  styleUrl: './liste-categorie.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class ListeCategorieComponent {
    @ViewChild(AjouterCategorieComponent) AjouterCategorie!: AjouterCategorieComponent;
    // @ViewChild(FicheCategorieComponent) FicheCategorie!: FicheCategorieComponent;
    @ViewChild(ConfirmComponent) confirmdialog!: ConfirmComponent;

    categories :Categorie[] = [];
    oldCategorie:Categorie[] = [];
    categToDelete:any;
    loading: boolean = false;
    totalRecords:number = 0;
    pageSize:number = 10;
    selectedCategories: Categorie[] = [];
    searchTerm:string = "";
    constructor(private CategorieService: CategorieService, private messageService: MessageService) {}

    // async ngOnInit() {
    //    await this.CategorieService.getCategorie().then((data:Categorie[]) =>
    //    { this.categories = data
    //     this.oldCategorie = [...this.categories];
    //     console.log('Categories:', this.categories);
    //     });
    // }


    // *************************************load table ***************************************

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
        this.loading = true;

        this.CategorieService.getCategorie(this.searchTerm,this.pageSize,currentPage,event?.sortField,event?.sortOrder).then((data:any) =>
       { this.categories = data.categories
        this.totalRecords=data.pagination.total
        console.log('Categories:', this.categories);
        this.loading = false;
        });
    }

    // *************************************open Dialog***************************************

    openNew(){
        this.AjouterCategorie.categorietDialog=true;
    }
    // *************************************Close Dialog***************************************


    deleteSelectedCategories() {
        this.confirmdialog.showDialog();
    }


    receiveCategorie(data:Categorie){
    console.log("receivedCategorie",data);
    // this.categories.push(data);
     this.CategorieService.getCategorie().then((data:any) =>
    { this.categories = data.categories
     this.oldCategorie = [...this.categories];
    //  console.log('Categories:', this.categories);
     });
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Catégorie Ajouter', life: 3000 });

    }
    showConfirmDialog(categorie:Categorie){
        this.confirmdialog.showDialog()
        this.categToDelete=categorie.id
    }

    receiveConfrimResponse(data: string) {
        console.log("receiveConfrimResponse", data);
        console.log("selected Categories", this.selectedCategories);

        if (data === "oui") {
            if (this.categToDelete) {
                this.CategorieService.DeleteCategorie(this.categToDelete).then(res => console.log(res));
                const indexToDelete = this.categories.findIndex(cat => cat.id === this.categToDelete);

                if (indexToDelete !== -1) {
                    this.categories.splice(indexToDelete, 1);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Catégorie Supprimer', life: 3000 });
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Catégorie non trouvée', life: 3000 });
                }
                this.categToDelete=null
            }

            if (this.selectedCategories && this.selectedCategories.length !== 0) {
                this.selectedCategories.forEach(selectedCat => {
                    this.CategorieService.DeleteCategorie(selectedCat.id).then(res => console.log(res));
                    const index = this.categories.findIndex(cat => cat.id === selectedCat.id);
                    console.log('index', index, 'liste categ ', this.categories, 'selected categ', this.selectedCategories);
                    if (index !== -1) {
                        this.categories.splice(index, 1);
                    }
                });

                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Catégorie Supprimer', life: 3000 });
                this.selectedCategories = [];
            }
        }
    }

   async sendCategory(categorie:Categorie){
        console.log(categorie)
     await   this.CategorieService.sendcategorie(categorie)
    }

    // *************************************update categ ***************************************


    switchOnChange(categorie:Categorie){
        // console.log(this.oldCategorie)
    console.log("switchOnChange",categorie.activer);
    // const categoryWithSameDesignation = this.oldCategorie.find(categ => categ.designation === categorie.designation);
    // if (categoryWithSameDesignation) {
        let categ={
            id:categorie.id,
            nom:categorie.nom,
            designation:categorie.designation,
            // description: categorie.description,
            // niveau:categorie.niveau,
            // categ_par:categorie.niveauParent,
            visible:categorie.activer,
            visible_menu:categorie.activerMenu,
            // balise_titre:categorie.baliseTitre,
            // meta_desc:categorie.metaDescription,
            // meta_motsCle:categorie.metaMotsCles,
            // url_simp:categorie.urlSimplifiee,
            // nbArticles: categorie?.nbArticles,
            // path:categorie?.path,
            // image
        }

    //   console.log('Category with the same designation:', categoryWithSameDesignation);
         this.CategorieService.updateCategorie(categ,categ.id).then(res=>console.log('updated categ',res));
         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Catégorie Modifier', life: 3000 });
         console.log(this.categories)

    // } else {
    //   console.log('No category with the same designation found');
    // }
    }

    // ****************************************************************************


    Rechercher(event :any){
        // console.log((event.target as HTMLInputElement).value)
        let  newValue = (event.target as HTMLInputElement).value
        this.searchTerm=newValue

        // this.CategorieService.getSearchedCateg(newValue).then((data:any) =>
        // { this.categories = data.categories
        //     this.totalRecords=data.pagination.total
        //     console.log('categories:', this.categories);
        //     });
        this.loadCustomers()

        }
}
