import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { Marque } from 'src/app/demo/api/marque';
import { MarqueService } from 'src/app/demo/service/marque.service';
import { AjouterMarqueComponent } from '../ajouter-marque/ajouter-marque.component';
import { ConfirmComponent } from '../../confirm/confirm.component';

@Component({
  selector: 'app-liste-marque',
  templateUrl: './liste-marque.component.html',
  styleUrl: './liste-marque.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class ListeMarqueComponent {
    @ViewChild(AjouterMarqueComponent) AjouterMarque!: AjouterMarqueComponent;
    @ViewChild(ConfirmComponent) confirmdialog!: ConfirmComponent;

    loading: boolean = false;
    totalRecords:number = 0;
    pageSize:number = 10;
    checked: boolean = false;
    saerchTerm:string = "";
    marques:Marque[] = [];
    marqueToDelete:any
    selectedMarques: Marque[] = [];


    constructor(private MarqueService: MarqueService, private messageService: MessageService) {}

    async ngOnInit() {
        //    await this.MarqueService.getMarques().then((data:Marque[]) =>
        //    { this.marques = data
        //     console.log('Marques:', this.marques);
        //     });
        }
// *********************************************************Load table***********************************************************************
    async loadCustomers(event?: TableLazyLoadEvent) {

        // console.log(event)
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

            await this.MarqueService.getMarques(this.saerchTerm,this.pageSize,currentPage,event?.sortField,event?.sortOrder).then((data:any) =>
               { this.marques = data.marques
                this.totalRecords=data.pagination.total
                console.log('Marques:', this.marques);
                });
            this.loading = false;


        }
// **************************************************************refresh******************************************************************

        receiveDataFromChild(data:any){
          console.log(data)
          if(data){
            this.loadCustomers()
          }

        }


        // **************************************************Add marque*****************************************************************************

        showDialog(){
        this.AjouterMarque.showDialog()
        }
        // **************************************************delete marque**************************************************************************
        deleteSelectedMarques() {
            this.confirmdialog.showDialog();
        }

        showConfirmDialog(Marque:Marque){
            this.confirmdialog.showDialog()
            this.marqueToDelete=Marque.id
        }
        receiveConfrimResponse(data:string){
        console.log("receiveConfrimResponse",data);
        if(data=="oui" ){
            if(this.marqueToDelete){
                this.MarqueService.DeleteMarque(this.marqueToDelete).then(res=>console.log(res));
                const index = this.marques.findIndex(cat => cat.id === this.marqueToDelete);

                if (index !== -1) {
                    this.marques.splice(index, 1);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Marque Supprimer', life: 3000 });
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Marque non trouvée', life: 3000 });
                }
                this.marqueToDelete=null
            }
            if (this.selectedMarques && this.selectedMarques.length !== 0) {
                this.selectedMarques.forEach(selectedCat => {
                    this.MarqueService.DeleteMarque(selectedCat.id).then(res=>console.log(res));
                    const index = this.marques.findIndex(cat => cat.id === selectedCat.id);
                    console.log('index', index, 'liste marque ', this.marques, 'selected marque', this.selectedMarques);
                    if (index !== -1) {
                        this.marques.splice(index, 1);
                    }
                });

                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Marque Supprimer', life: 3000 });
                this.selectedMarques = [];
            }

        }
        }

        // **************************************************post marque success*****************************************************************************

        receiveMarque(data:Marque){
        console.log("receivedMarque",data);

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Marque Ajouter', life: 3000 });

        }

        // **************************************************update*****************************************************************************


        switchOnChange(marque:Marque){
        console.log("switchOnChange",marque,marque.activer);
        let UpdatedMarque={
            id:marque.id,
            nom:marque.nom,
            designation:marque.designation,
            logo:marque.logo.id,
            activer:marque.activer

        }
             this.MarqueService.UpdateMarque(UpdatedMarque,marque.id).then(res=>console.log('updated Marque',res));
             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Marque Modifier', life: 3000 });

        }

        updateMarque(marque:any){
            this.AjouterMarque.showDialog(marque)
        }

        // *************************************************Recherche*******************************************************************************

        Rechercher(event :any){
        console.log((event.target as HTMLInputElement).value)
        let  newValue = (event.target as HTMLInputElement).value
        this.saerchTerm=newValue

        this.loadCustomers()

        // this.MarqueService.getSearchedMarques(newValue).then((data:any) =>
        // { this.marques = data.marques
        //  this.totalRecords=data.pagination.total
        //  console.log('Marques:', this.marques);
        //  });

        }
}
