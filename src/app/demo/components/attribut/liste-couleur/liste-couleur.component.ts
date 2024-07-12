import { Component, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { AjouterCouleurComponent } from '../ajouter-couleur/ajouter-couleur.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CouleurService } from 'src/app/demo/service/couleur.service';
import { AttributCouleur, ValCouleur } from 'src/app/demo/api/couleur';
import { ConfirmComponent } from '../../confirm/confirm.component';

@Component({
  selector: 'app-liste-couleur',
  templateUrl: './liste-couleur.component.html',
  styleUrl: './liste-couleur.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class ListeCouleurComponent {
    @ViewChild(ConfirmComponent) confirmdialog!: ConfirmComponent;

    @ViewChild(AjouterCouleurComponent) AjouterCouleur!: AjouterCouleurComponent;

    constructor(private couleurService: CouleurService, private messageService: MessageService) {}


    loading: boolean = false;
    totalRecords:number = 0;
    pageSize:number = 10;
    couleurs:AttributCouleur[] = [];
    tieredItems: MenuItem[] = [];
    showFilters: boolean = false;
    menuItems: MenuItem[] = [];
    colorToUpdate:any;
    CouleurToDelete:any
    selectedCouleurs: ValCouleur[] = [];
    searchTerm:string='';



    ngOnInit() {

        this.menuItems = [
            {
                label: 'Update',
                icon: 'pi pi-pencil',
                command: () =>this.AjouterCouleur.showDialog(this.colorToUpdate)


                // routerLink:'/attribut/ajouter-couleur'
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                command: () =>this.showConfirmDialog(this.colorToUpdate)
            },
            // {
            //     separator: true
            // },
            // {
            //     label: 'Home',
            //     icon: 'pi pi-fw pi-home'
            // }
        ];
}




    async loadCustomers(event: TableLazyLoadEvent) {

        console.log(event)
        let currentPage: number;
        if (event.first !== undefined && event.rows !== undefined && event.rows !== null && event.rows !== 0) {
            currentPage = event.first / event.rows + 1;
            this.pageSize = event.rows
            this.pageSize = event.rows

        } else {
            currentPage = 1;

        }
        console.log(currentPage,this.pageSize)

            this.loading = true;
        

            await this.couleurService.getCouleurs( this.searchTerm,this.pageSize,currentPage,event.sortField,event.sortOrder).then((data:any) =>
               { this.couleurs = data.attribut
                this.totalRecords=data.pagination.total
                console.log('couleurs:', this.couleurs);
                });
            this.loading = false;


        }


        showFilter(){
            this.showFilters=!this.showFilters
        }
     async   Rechercher(event :any){
            console.log((event.target as HTMLInputElement).value)
            let  newValue = (event.target as HTMLInputElement).value
            this.searchTerm=newValue

            await this.couleurService.getCouleurs(newValue,this.pageSize,1,event.sortField,event.sortOrder).then((data:any) =>
            { this.couleurs = data.attribut
             this.totalRecords=data.pagination.total
             console.log('couleurs:', this.couleurs);
             });

            }

        showDialog(){
            this.AjouterCouleur.showDialog()
        }
        menuOnShow(color:any)
        {
           console.log(color)
           this.colorToUpdate=color
        }


        deleteSelectedCouleurs() {
            this.confirmdialog.showDialog();
        }

        showConfirmDialog(color:ValCouleur){
            this.confirmdialog.showDialog()
            this.CouleurToDelete=color.id
        }
        receiveConfrimResponse(data:string){
            console.log("receiveConfrimResponse",data);
            if(data=="oui" ){
                if(this.CouleurToDelete){
                    this.couleurService.DeleteCouleur(this.CouleurToDelete).then(res=>console.log(res))
                    .catch(error => {
                        console.error('Error :', error);
                    });
                    const index = this.couleurs.findIndex(cat => cat.id === this.CouleurToDelete);

                    if (index !== -1) {
                        this.couleurs.splice(index, 1);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Valeur Couleur Supprimer', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Valeur Couleur non trouvée', life: 3000 });
                    }
                    this.CouleurToDelete=null
                }
                if (this.selectedCouleurs && this.selectedCouleurs.length !== 0) {
                    this.selectedCouleurs.forEach(selectedCat => {
                        this.couleurService.DeleteCouleur(selectedCat.id).then(res=>console.log(res))
                        .catch(error => {
                            console.error('Error :', error);
                        });
                        const index = this.couleurs.findIndex(cat => cat.id === selectedCat.id);
                        console.log('index', index, 'liste couleur ', this.couleurs, 'selected couleur', this.selectedCouleurs);
                        if (index !== -1) {
                            this.couleurs.splice(index, 1);
                        }
                    });

                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Valeur Couleur Supprimer', life: 3000 });
                    this.selectedCouleurs = [];
                }

            }
            }

}
