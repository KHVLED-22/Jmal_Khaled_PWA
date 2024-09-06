import { Component } from '@angular/core';
import { GroupeRegimeHoraire, Planning } from '../../models/planing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StrapiService } from 'src/app/demo/service/strapi.service';
export interface OfflineRequest {
  key: string;
  method: string;
  table: string;
  id?: number;
  data?: any;
}
@Component({
  selector: 'app-groupe-planing',
  templateUrl: './groupe-planing.component.html',
  styleUrl: './groupe-planing.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class GroupePlaningComponent {
  showFilters = false;
  page: any;
  size: any;
  sort: any;
  option: any;
  totalRecords : any ;
  loading = false ;
  postdate  = new Date();
  offlineDeleteVisible = false; 
  date : string = this.postdate.toString()
  showdate : any ; 
  timezone = 'local';
  showOfflineOperationsTable = false;
  checked : boolean = false ;
  addpointage : any = {};
  selectedmachine : any [] =  [] ;
  offlineRequests: OfflineRequest[] = []
  usermachineid : any ;
  itemdelete : any = {}
  filterdata = '';
  searchdate : any ;
  planing : Planning = {} ;
  planings : Planning [] = [];
  Groupes : GroupeRegimeHoraire [] = []
  Groupe : GroupeRegimeHoraire = {}
  visible = false ;
  confirmDeleteVisible = false ;
  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Nom', field: 'nom', width: 40, sortable: true },
    { header: 'Description', field: 'description', width: 45, sortable: true },
];
SelectedCols : any [] = this.Cols
modif: boolean = false ;
  
  async ngOnInit() {
    const data = await this.strapi.getFromStrapi('regime-horaires',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,''+this.filterdata ,'date')
    this.planings = Planning.mapPlannings(data) ;
    this.strapiService.offlineOperations$.subscribe(show => {
      this.showOfflineOperationsTable = show;
    });
    this.offlineRequests = this.strapiService.getQueuedRequests();
    console.log('Offline Requests:', this.offlineRequests);
  this.showOfflineOperationsTable = this.offlineRequests.length > 0;
  }

  filterCountry(event:any){
    let filtered: any[] = [];
    let query = event.query;
      for (let i = 0; i < (this.Groupes as any[])?.length; i++) {
          let country = (this.Groupes as any[])[i];
          if (country.nom.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }
      this.Groupes = filtered;
  }

  
  constructor( private messageService: MessageService , private strapi : StrapiService,private strapiService: StrapiService){ }
  
  async getPlaning(){
      this.loading = true
      const datauser = await this.strapi.getFromStrapi('groupe-regime-horaires', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'populate=*');
      this.Groupes = GroupeRegimeHoraire.mapGroups(datauser);
      this.totalRecords = this.strapi.total;
      console.log(this.planings)
      this.loading = false ;
    }
  
    async onLazyLoad(event : any) {
      this.page = Math.floor(event.first / event.rows) + 1;
      this.size = event.rows;
      this.sort = event.sortField ?  event.sortField : 'id';
      this.option = event.sortOrder;
      await this.getPlaning();
      console.log(event);
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

  async savePlaning(){
    let validationError = false;
    if (!this.Groupe.nom || this.Groupe.nom.trim() === '') {
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
    const ids = this.Groupe.planings?.map(m => m.id) 
      const data = {
        "data" : {
          nom : this.Groupe.nom ,
          description : this.Groupe.description ,
          regime_horaires : ids 
        }
      }
      if(this.Groupe.id){
        try {
          await this.strapi.updateById('groupe-regime-horaires',this.Groupe.id,data)
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur de modification" ,
          }); 
        }
      }else{
        try {
          await this.strapi.postStrapi('groupe-regime-horaires',data)
          this.getPlaning()
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur d'insertion" ,
          });    
        }
      }
      this.visible = false ;
      this.Groupe = {};
  }

  async deletePlaning(){
    const id = this.Groupe.id
    if (!navigator.onLine) {
      // Emit an event to show the dialog when offline
      this.offlineDeleteVisible=true;
      console.log('No internet connection. Delete operation not allowed.');
      return; // Prevent further execution
    }
    try{
      await this.strapi.deleteById('groupe-regime-horaires', id!)
      this.getPlaning();
      this.confirmDeleteVisible = false ;
    }catch (e) {
    }
  }
  closeDialog() {
    this.offlineDeleteVisible = false;
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
}
