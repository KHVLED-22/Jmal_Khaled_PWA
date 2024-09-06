import { Component } from '@angular/core';
import { Establishment } from '../../models/etablissement';
import { Machine } from '../../models/machine';
import { User } from '../../models/user';
import { pointage } from '../../pointages/pointage';
import {StrapiService} from '../../../service/strapi.service'
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
export interface OfflineRequest {
  key: string;
  method: string;
  table: string;
  id?: number;
  data?: any;
}
@Component({
  selector: 'app-etablissement',
  templateUrl: './etablissement.component.html',
  styleUrl: './etablissement.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class EtablissementComponent {
  showFilters = false;
  Pointages : pointage [] = [] ;
  page: any;
  size: any;
  sort: any;
  option: any;
  totalRecords : any ;
  loading = false ;
  selectedEtablissement : any ;
  showOfflineOperationsTable = false;
  offlineDeleteVisible = false; 
  selectedusers : any ;
  postdate  = new Date();
  date : string = this.postdate.toString()
  Etabs : Establishment [] = [] ;
  offlineRequests: OfflineRequest[] = [];
  users : User[] =[]
  showdate : any ; 
  timezone = 'local';
  checked : boolean = false ;
  addpointage : any = {};
  machines : Machine [] = [];
  selectedmachine : any [] =  [] ;
  usermachineid : any ;
  itemdelete : any = {}
  filterdata = '';
  searchdate : any ;
  visible = false ;
  confirmDeleteVisible = false ;
  filtredUsers : User [] = [] ;
  establishment : Establishment = {};

  
  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Nom', field: 'name', width: 15, sortable: true },
    { header: 'Région', field: 'region', width: 15, sortable: true },
    { header: 'Numéro de téléphone', field: 'numTel', width: 15, sortable: true },
    { header: 'Adresse', field: 'adresse', width: 25, sortable: true },
    { header: 'Email', field: 'mail', width: 20, sortable: true },
    { header: 'Description', field: 'description', width: 30, sortable: true },
  ];
  
  SelectedCols : any [] = this.Cols
  
  constructor( private messageService: MessageService , private strapi : StrapiService,private strapiService: StrapiService){ }

async ngOnInit() {
  this.strapiService.offlineOperations$.subscribe(show => {
    this.showOfflineOperationsTable = show;
  });
  this.showOfflineOperationsTable = this.offlineRequests.length > 0;
  this.offlineRequests = this.strapiService.getQueuedRequests();

}

async deleteEtab(){
  const id = this.establishment.id
  if (!navigator.onLine) {
    // Emit an event to show the dialog when offline
    this.offlineDeleteVisible=true;
    console.log('No internet connection. Delete operation not allowed.');
    return; // Prevent further execution
  }
  try{
    await this.strapi.deleteById('etablissements', id!)
    this.getEtab();
    this.confirmDeleteVisible = false ;
  }catch (e) {
  }
}

async exportEtablissements(): Promise<void> {
  this.loading = true;
  document.body.classList.add('loading');

  await new Promise<void>((resolve, reject) => {
    let sortedData = [];
    let wb = XLSX.utils.book_new();
    if (this.Etabs) {
      for (let establishment of this.Etabs) {
        let data: { [key: string]: string } = {
          'Nom': establishment.name!,
          'Région': establishment.region!,
          'Numéro de téléphone': establishment.numTel!,
          'Adresse': establishment.adresse!,
          'Email': establishment.mail!,
          'Description': establishment.description!,
        };
        sortedData.push(data);
      }

      let ws = XLSX.utils.json_to_sheet(sortedData);
      XLSX.utils.book_append_sheet(wb, ws, "Etablissements");
      XLSX.writeFile(wb, "etablissementsData.xlsx");
    }

    resolve();
  });

  this.loading = false;
  document.body.classList.remove('loading');
}



async saveEstablishment(){
  if(this.establishment.name != undefined && this.establishment.name != ''){
    const data = {
      "data" : {
        ...this.establishment
      }
    }
    if(this.establishment.id){
      try {
        await this.strapi.updateById('etablissements',this.establishment.id,data)
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de validation'  ,
          detail:  "ereur de modification" ,
        }); 
      }
    }else{
      try {
        await this.strapi.postStrapi('etablissements',data)
        this.getEtab()
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de validation'  ,
          detail:  "ereur d'insertion" ,
        });    
      }
    }
    this.visible = false ;
    this.establishment = {};
} else{
  this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation'  ,
        detail:  "Selectionner un nom" ,
      });
} 
}

async onLazyLoad(event : any) {
  this.page = Math.floor(event.first / event.rows) + 1;
  this.size = event.rows;
  this.sort = event.sortField ?  event.sortField : 'id';
  this.option = event.sortOrder;
  await this.getEtab();
  console.log(event);
}



async getEtab(){
  this.loading = true
  const data = await this.strapi.getFromStrapi('etablissements',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,'&populate=pointages&populate=user&'+this.filterdata ,'date')
  this.totalRecords = this.strapi.total;
  this.Etabs = Establishment.mapEstablishments(data) 
  this.loading = false ;
}

formatDate(dateString: string, type: string): string {
  const date = new Date(dateString);
  if (type === 'date' && dateString) {
    return date.toLocaleDateString('en-US');
  } else if (type === 'datetime' && dateString) {
    return date.toLocaleString('en-US');
  } else {
    return '';
  }
}

async deleteRequest(request: OfflineRequest): Promise<void> {
  try {
    await this.strapiService.deleteRequestFromDB(request.key); // Call the public method in StrapiService
    this.offlineRequests = this.offlineRequests.filter(req => req.key !== request.key); // Remove from in-memory array
    console.log(`Request with key ${request.key} deleted from memory`);
  } catch (error) {
    console.error('Failed to delete the request:', error);
  }
}
closeDialog() {
  this.offlineDeleteVisible = false;
}
}
