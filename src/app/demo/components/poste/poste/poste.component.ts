import { Component } from '@angular/core';
import {StrapiService} from '../../../service/strapi.service'
import { ConfirmationService, MessageService } from 'primeng/api';
import { poste } from '../../models/poste';
import { Establishment } from '../../models/etablissement';
import { Departement } from '../../models/departement';
export interface OfflineRequest {
  key: string;
  method: string;
  table: string;
  id?: number;
  data?: any;
}
@Component({
  selector: 'app-poste',
  templateUrl: './poste.component.html',
  styleUrl: './poste.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class PosteComponent {
  showFilters = false;
  page: any;
  size: any;
  sort: any;
  option: any;
  totalRecords : any ;
  offlineDeleteVisible = false; 
  showOfflineOperationsTable = false;
  offlineRequests: OfflineRequest[] = []
  loading = false ;
  postdate  = new Date();
  date : string = this.postdate.toString()
  showdate : any ; 
  timezone = 'local';
  checked : boolean = false ;
  addpointage : any = {};
  filterdata = '';
  searchdate : any ;
  visible = false ;
  confirmDeleteVisible = false ;
  poste : poste = {};
  postes : poste [] = [];
  selectedusers : any ;
  selectedEtablissement : any ;
  departements : Departement [] = [] ;

  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Ttire', field: 'titre', width: 45, sortable: true },
    { header: 'Description', field: 'description', width: 45, sortable: true },
  ];

  SelectedCols : any [] = this.Cols


  async onLazyLoad(event : any) {
      this.page = Math.floor(event.first / event.rows) + 1;
      this.size = event.rows;
      this.sort = event.sortField ?  event.sortField : 'id';
      this.option = event.sortOrder;
      await this.getDep();
      console.log(event);
    }

  async ngOnInit(){
    const dataEtab = await this.strapi.getFromStrapi('departements',1,25,'id',-1,undefined,undefined,undefined,undefined,'')
    this.departements = Departement.mapDepartements(dataEtab) ;
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
    const data = await this.strapi.getFromStrapi('postes',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,'&populate=*'+this.filterdata ,'date')
    this.totalRecords = this.strapi.total;
    this.postes = poste.mapPoste(data) 
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

    if (!this.poste.titre || this.poste.titre.trim() === '') {
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

    const ids = this.poste.departements?.map(m=> m.id)

      const data = {
        "data" : {
          titre : this.poste.titre ,
          description : this.poste.description ,
          departements : ids

        }
      }
      if(this.poste.id){
        try {
          await this.strapi.updateById('postes',this.poste.id,data)
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
          await this.strapi.postStrapi('postes',data)
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
      this.poste = {};
  }

  async deletedep(){
    const id = this.poste.id
    if (!navigator.onLine) {
      // Emit an event to show the dialog when offline
      this.offlineDeleteVisible=true;
      console.log('No internet connection. Delete operation not allowed.');
      return; // Prevent further execution
    }
    try{
      await this.strapi.deleteById('postes', id!)
      this.getDep();
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
