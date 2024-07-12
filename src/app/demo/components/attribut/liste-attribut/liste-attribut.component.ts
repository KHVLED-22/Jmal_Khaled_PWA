import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { Attribut } from 'src/app/demo/api/attribut';
import { AttributService } from 'src/app/demo/service/attribut.service';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { AjouterAttributComponent } from '../ajouter-attribut/ajouter-attribut.component';

@Component({
  selector: 'app-liste-attribut',
  templateUrl: './liste-attribut.component.html',
  styleUrl: './liste-attribut.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class ListeAttributComponent {
    @ViewChild(ConfirmComponent) confirmdialog!: ConfirmComponent;
    @ViewChild(AjouterAttributComponent) AjouterAttribut!: AjouterAttributComponent;

    loading: boolean = false;
    totalRecords:number = 0;
    pageSize:number = 10;
    attributs:Attribut[] = [];
    selectedAttribut: Attribut[] = [];
    AttributToDelete:any
    AttributToUpdate:Attribut={
        nom:'',
        attribut_values:[],
        visible:false
    }

    searchTerm:string = ''
    receivedData:any

    constructor(private AttrbitService: AttributService, private messageService: MessageService) {}





    // **********************************initialize*********************************************

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

            await this.AttrbitService.getAttributs(this.searchTerm,this.pageSize,currentPage,event?.sortField,event?.sortOrder).then((data:any) =>
               { this.attributs = data.attribut
                this.totalRecords=data.pagination.total
                console.log('attributs:', this.attributs);
                })
                .catch(error => {
                    console.error('Error :', error);
                });            this.loading = false;

        // if(this.receivedData){
        //     await   this.AttrbitService.getAttributs().then(res=>
        //     {console.log('reponse attribut ',res)})
        //     .catch(error => {
        //         console.error('Error fetching attribut:', error);
        //     });

        // }


        }

      async   receiveDataFromChild(data: string) {
            this.receivedData = data;
        if(this.receivedData){
           this.loadCustomers()

            // await   this.AttrbitService.getAttributs().then((res:any)=>
            //     {this.attributs = res.attribut
            //         this.totalRecords=res.pagination.total
            //         console.log('attributs:', this.attributs);})
            //     .catch(error => {
            //         console.error('Error fetching attribut:', error);
            //     });
        }


            console.log('Data received from child:', this.receivedData);
          }
// **********************************ADD*********************************************

        showDialog(){
            this.AjouterAttribut.showDialog()
            }

// *********************************Update**********************************************
updateAttribut(attribut:Attribut){
console.log('attribut to update',attribut);

this.AjouterAttribut.showDialog(attribut)

}




// **********************************Delete*********************************************

        deleteSelectedAttribut() {
            this.confirmdialog.showDialog();
        }
        showConfirmDialog(Attribut:Attribut){
            this.confirmdialog.showDialog()
            this.AttributToDelete=Attribut.id
        }
        receiveConfrimResponse(data:string){
            console.log("receiveConfrimResponse",data);
            if(data=="oui" ){
                if(this.AttributToDelete){
                    this.AttrbitService.DeleteAttribut(this.AttributToDelete).then(res=>console.log(res))
                    .catch(error => {
                        console.error('Error :', error);
                    });
                    const index = this.attributs.findIndex(cat => cat.id === this.AttributToDelete);

                    if (index !== -1) {
                        this.attributs.splice(index, 1);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Attribut Supprimer', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Attribut non trouvée', life: 3000 });
                    }
                    this.AttributToDelete=null
                }
                if (this.selectedAttribut && this.selectedAttribut.length !== 0) {
                    this.selectedAttribut.forEach(selectedCat => {
                        this.AttrbitService.DeleteAttribut(selectedCat.id).then(res=>console.log(res))
                        .catch(error => {
                            console.error('Error :', error);
                        });
                        const index = this.attributs.findIndex(cat => cat.id === selectedCat.id);
                        console.log('index', index, 'liste marque ', this.attributs, 'selected marque', this.selectedAttribut);
                        if (index !== -1) {
                            this.attributs.splice(index, 1);
                        }
                    });

                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Attribut Supprimer', life: 3000 });
                    this.selectedAttribut = [];
                }

            }
            }

// ********************************Rerchercher***********************************************
Rechercher(event :any){
    console.log((event.target as HTMLInputElement).value)
    let  newValue = (event.target as HTMLInputElement).value
    this.searchTerm=(event.target as HTMLInputElement).value
    this.loadCustomers()

    // this.AttrbitService.getSearchedAttribut(newValue).then((data:any) =>
    // { this.attributs = data.attribut
    //     this.totalRecords=data.pagination.total
    //     console.log('attribut:', this.attributs);
    //     })
    //     .catch(error => {
    //         console.error('Error :', error);
    //     });

    }

// ********************************switch update***********************************************

    switchOnChange(attribut:Attribut){
        console.log("switchOnChange",attribut,attribut.visible);
        let Updatedattribut={
            id:attribut.id,
            nom:attribut.nom,
            attribut_values:attribut.attribut_values,
            visible:attribut.visible,


        }
                this.AttrbitService.UpdateAttribut(Updatedattribut,attribut.id).then(res=>console.log('updated attribut',res))
                .catch(error => {
                    console.error('Error :', error);
                });
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Attribut Modifier', life: 3000 });

        }
}
