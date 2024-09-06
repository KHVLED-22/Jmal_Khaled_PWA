import { Component } from '@angular/core';
import { Societe } from '../../models/societe';
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
  selector: 'app-societe',
  templateUrl: './societe.component.html',
  styleUrl: './societe.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class SocieteComponent {
  showFilters = false;
  page: any;
  size: any;
  sort: any;
  option: any;
  totalRecords : any ;
  loading = false ;
  postdate  = new Date();
  date : string = this.postdate.toString()
  showdate : any ; 
  showOfflineOperationsTable = false;
  timezone = 'local';
  checked : boolean = false ;
  addpointage : any = {};
  selectedmachine : any [] =  [] ;
  offlineRequests: OfflineRequest[] = [];
  usermachineid : any ;
  offlineDeleteVisible = false; 
  itemdelete : any = {}
  filterdata = '';
  searchdate : any ;
  visible = false ;
  confirmDeleteVisible = false ;
  societe : Societe = {};
  societes  : Societe [] = [];
  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Nom', field: 'nom', width: 15, sortable: true },
    { header: 'Matricule Fiscale', field: 'matriculeFiscale', width: 20, sortable: true },
    { header: 'Adresse', field: 'adresse', width: 25, sortable: true },
    { header: 'Téléphone', field: 'tel', width: 15, sortable: true },
    { header: 'Fax', field: 'fax', width: 15, sortable: true },
    // { header: 'Email', field: 'email', width: 20, sortable: true },
 ];
 SelectedCols : any [] = this.Cols

  async onLazyLoad(event : any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.sort = event.sortField ?  event.sortField : 'id';
    this.option = event.sortOrder;
    await this.getsociete();
    console.log(event);
  }

  ngOnInit(): void {
    this.strapiService.offlineOperations$.subscribe(show => {
      this.showOfflineOperationsTable = show;
    });
    this.showOfflineOperationsTable = this.offlineRequests.length > 0;
    this.offlineRequests = this.strapiService.getQueuedRequests();

  }
  

  async exportSocietes(): Promise<void> {
    this.loading = true;
    document.body.classList.add('loading');
  
    await new Promise<void>((resolve, reject) => {
      let sortedData = [];
      let wb = XLSX.utils.book_new();
      if (this.societes) {
        for (let societe of this.societes) {
          let data: { [key: string]: string } = {
            'Nom': societe.nom!,
            'Matricule Fiscale': societe.matriculeFiscale!,
            'Adresse': societe.adresse || '',
            'Téléphone': societe.tel || '',
            'Fax': societe.fax || '',
            // 'Email': societe.email || '',
          };
  
          sortedData.push(data);
        }
  
        let ws = XLSX.utils.json_to_sheet(sortedData);
        XLSX.utils.book_append_sheet(wb, ws, "Societes");
        XLSX.writeFile(wb, "societesData.xlsx");
      }
  
      resolve();
    });
  
    this.loading = false;
    document.body.classList.remove('loading');
  }

  async getsociete(){
    this.loading = true
    const data = await this.strapi.getFromStrapi('societes',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,''+this.filterdata ,'date')
    this.totalRecords = this.strapi.total;
    this.societes = Societe.mapSocietes(data) 
    this.loading = false ;
  }

  constructor( private messageService: MessageService , private strapi : StrapiService,private strapiService: StrapiService){ }

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

  async savesociete(){
    let validationError = false;

    if (!this.societe.nom || this.societe.nom.trim() === '') {
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
          ...this.societe
        }
      }
      if(this.societe.id){
        try {
          await this.strapi.updateById('societes',this.societe.id,data)
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur de modification" ,
          }); 
          this.getsociete();
        }
      }else{
        try {
          await this.strapi.postStrapi('societes',data)
          this.getsociete()
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur d'insertion" ,
          });    
        }
      }
      this.visible = false ;
      this.societe = {};
  }

  async deletesociete(){
    const id = this.societe.id
    if (!navigator.onLine) {
      // Emit an event to show the dialog when offline
      this.offlineDeleteVisible=true;
      console.log('No internet connection. Delete operation not allowed.');
      return; // Prevent further execution
    }
    try{
      await this.strapi.deleteById('societes', id!)
      this.getsociete();
      this.confirmDeleteVisible = false ;
    }catch (e) {
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
