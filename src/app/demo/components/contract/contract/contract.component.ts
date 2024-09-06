import { Component } from '@angular/core';
import {StrapiService} from '../../../service/strapi.service'
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { Departement, UserData } from '../../models/departement';
import { User } from '../../models/user';
import { Establishment } from '../../models/etablissement';
import { Equipe } from '../../models/equipe';
import { catchError } from 'rxjs';
import { contract } from '../../models/contract';
export interface OfflineRequest {
  key: string;
  method: string;
  table: string;
  id?: number;
  data?: any;
}
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class ContractComponent {
  showFilters = false;
  page: any;
  size: any;
  offlineRequests: OfflineRequest[] = []
  sort: any;
  option: any;
  totalRecords : any ;
  showOfflineOperationsTable = false;
  loading = false ;
  postdate  = new Date();
  offlineDeleteVisible = false; 
  date : string = this.postdate.toString()
  showdate : any ; 
  timezone = 'local';
  checked : boolean = false ;
  addpointage : any = {};
  filterdata = '';
  searchdate : any ;
  visible = false ;
  confirmDeleteVisible = false ;
  contract : contract = {};
  contracts : contract [] = [];
  selectedusers : any ;
  selectedEtablissement : any ;

  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Nom', field: 'nom', width: 30, sortable: true },
    { header: 'Description', field: 'description', width: 30, sortable: true },
    { header: 'Designation', field: 'designation', width: 30, sortable: true },
  ];

  SelectedCols : any [] = this.Cols
  equipesToselect: Equipe[] =[];

  async onLazyLoad(event : any) {
      this.page = Math.floor(event.first / event.rows) + 1;
      this.size = event.rows;
      this.sort = event.sortField ?  event.sortField : 'id';
      this.option = event.sortOrder;
      await this.getDep();
      console.log(event);
    }

  async ngOnInit(){
    this.strapiService.offlineOperations$.subscribe(show => {
      this.showOfflineOperationsTable = show;
    });
    this.offlineRequests = this.strapiService.getQueuedRequests();
    console.log('Offline Requests:', this.offlineRequests);
  this.showOfflineOperationsTable = this.offlineRequests.length > 0;
  }

  constructor( private messageService: MessageService , private strapi : StrapiService,private strapiService: StrapiService){ }

  async getDep(){
    this.loading = true
    const data = await this.strapi.getFromStrapi('type-contrats',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,'&populate=*'+this.filterdata ,'date')
    this.totalRecords = this.strapi.total;
    this.contracts = contract.mapContract(data) 
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

  async savedep(){
    let validationError = false;

    if (!this.contract.nom || this.contract.nom.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Sélectionner nom',
      });
      validationError = true;
    }
    if (validationError) {
      return;
    }

      const data = {
        "data" : {
          ...this.contract
        }
      }
      if(this.contract.id){
        try {
          await this.strapi.updateById('type-contrats',this.contract.id,data)
          this.getDep()
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur de modification" ,
          }); 
          this.getDep();
        }
      }else{
        try {
          await this.strapi.postStrapi('type-contrats',data)
          this.getDep()
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur d'insertion" ,
          });    
        }
      }
      this.visible = false ;
      this.contract = {};
      // if (!navigator.onLine) {
      // this.strapiService.getQueuedRequests();
      // }
  }

  async deletedep(){
    const id = this.contract.id
    if (!navigator.onLine) {
      // Emit an event to show the dialog when offline
      this.offlineDeleteVisible=true;
      console.log('No internet connection. Delete operation not allowed.');
      return; // Prevent further execution
    }
    try{
      await this.strapi.deleteById('type-contrats', id!)
      this.getDep();
      this.confirmDeleteVisible = false ;
    }catch (e) {
    }
  }
  closeDialog() {
    this.offlineDeleteVisible = false;
  }
  

  // hedhi tekhdem 
  // async deleteRequest(request: OfflineRequest): Promise<void> {
  //   try {
  //     await this.strapiService.deleteRequestFromDB(request.key); // Call the public method in StrapiService
  //     this.offlineRequests = this.offlineRequests.filter(req => req.key !== request.key); // Remove from in-memory array
  //     console.log(`Request with key ${request.key} deleted from memory`);
  //     this.strapiService.getQueuedRequests()
  //   } catch (error) {
  //     console.error('Failed to delete the request:', error);
  //   }
  // }
  async deleteRequest(request: OfflineRequest): Promise<void> {
    try {
      console.log(`Attempting to delete request with key ${request.key}`);
      await this.strapiService.deleteRequestFromDB(request.key); // Call the public method in StrapiService
      console.log(`Successfully deleted request with key ${request.key} from DB`);
  
      // Update in-memory array
      this.offlineRequests = this.offlineRequests.filter(req => req.key !== request.key);
      console.log(`Updated offlineRequests after deletion:`, this.offlineRequests);
  
      // Fetch updated requests from service to ensure consistency
      
      //this.offlineRequests = this.strapiService.getQueuedRequests();
      this.strapiService.getQueuedRequests();
    } catch (error) {
      console.error('Failed to delete the request:', error);
    }
  }
  
}
