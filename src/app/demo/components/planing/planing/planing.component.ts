import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import {StrapiService} from '../../../service/strapi.service'
import { GroupeRegimeHoraire, JourRegimeHoraire, Planning } from '../../models/planing';
import { Equipe, UserData } from '../../models/equipe';
import { DatePipe } from '@angular/common';
export interface OfflineRequest {
  key: string;
  method: string;
  table: string;
  id?: number;
  data?: any;
}
@Component({
  selector: 'app-planing',
  templateUrl: './planing.component.html',
  styleUrl: './planing.component.scss',
  providers: [MessageService, ConfirmationService , DatePipe]
})
export class PlaningComponent {
  users : UserData[] =[]
  filtredUsers : UserData[] =[]
  showFilters = false;
  page: any;
  size: any;
  sort: any;
  option: any;
  totalRecords : any ;
  offlineDeleteVisible = false; 
  loading = false ;
  postdate  = new Date();
  date : string = this.postdate.toString()
  showdate : any ; 
  timezone = 'local';
  checked : boolean = false ;
  addpointage : any = {};
  selectedmachine : any [] =  [] ;
  showOfflineOperationsTable = false;
  usermachineid : any ;
  itemdelete : any = {}
  filterdata = '';
  searchdate : any ;
  planing : Planning = {} ;
  oldHoraire : JourRegimeHoraire [] = [] ;
  offlineRequests: OfflineRequest[] = []
  planings : Planning [] = [];
  Groupes : GroupeRegimeHoraire [] = []
  JourHoraire : JourRegimeHoraire [] = []
  equipes : Equipe [] = [];
  Selequipes : Equipe [] = [];
  visible = false ;
  confirmDeleteVisible = false ;
  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Nom', field: 'nom', width: 15, sortable: true },
    { header: 'Description', field: 'description', width: 15, sortable: false },
    { header: 'Planning horaire', field: 'planning_horaire', width: 15, sortable: false },
    { header: 'Debut validite', field: 'debut_validite', width: 15, sortable: false },
    { header: 'Fin validite', field: 'fin_validite', width: 15, sortable: false },
    { header: 'Nombre heures', field: 'nombre_heures', width: 15, sortable: false },
];
SelectedCols : any [] = this.Cols

pointageOptions = [
  { label: '2', value: 2 },
  { label: '4', value: 4 }
];

checkchanges():boolean {
  return this.oldHoraire === this.JourHoraire
}
ColsJ = [
  { header: 'Jour', field: 'nom', width: 10, sortable: false },
  { header: 'Travail', field: 'travail', width: 5, sortable: false },
  { header: 'Heure Entrée 1', field: 'heureEntree1', width: 10, sortable: false },
  { header: 'Heure Sortie 1', field: 'heureSortie1', width: 10, sortable: false },
  { header: 'Heure Entrée 2', field: 'heureEntree2', width: 10, sortable: false },
  { header: 'Heure Sortie 2', field: 'heureSortie2', width: 10, sortable: false },
  { header: 'Heure Départ Pause', field: 'heureDepartPause', width: 10, sortable: false },
  { header: 'Heure Fin Pause', field: 'heureFinPause', width: 10, sortable: false },
  { header: 'Nombre d\'Heures Prévues', field: 'nbre_heures_prevues', width: 10, sortable: false },
  { header: 'Durée Pause', field: 'duree_pause', width: 10, sortable: false },
  { header: 'Nombre de Pointages', field: 'nbrePointages', width: 10, sortable: false },
  // { header: 'Sortie Demandée', field: 'sortieDemandee', width: 10, sortable: false },
];
modif: boolean = false ;
  
  async ngOnInit() {
    const dataGRP = await this.strapi.getFromStrapi('groupe-regime-horaires', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'populate=etablissement');
    this.Groupes = GroupeRegimeHoraire.mapGroups(dataGRP);
    const datauser = await this.strapi.getFromStrapi('users',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
    this.users = UserData.mapUsers(datauser);
    const data = await this.strapi.getFromStrapi('equipes',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,'&populate=*'+this.filterdata ,'date')
    this.equipes = Equipe.mapEquipes(data) 
    this.filtredUsers = this.users;
    this.strapiService.offlineOperations$.subscribe(show => {
      this.showOfflineOperationsTable = show;
    });
    this.offlineRequests = this.strapiService.getQueuedRequests();
    console.log('Offline Requests:', this.offlineRequests);
  this.showOfflineOperationsTable = this.offlineRequests.length > 0;
  }

  filterUsers(event: any) {
    if (event.value.length > 0) {
      const selectedMembers = event.value.map((equipe: Equipe) => equipe.membres).flat();
      const selectedIds = selectedMembers.map((member: UserData) => member.id);
      this.filtredUsers = this.users.filter((user: UserData) => selectedIds.includes(user.id));
    } else {
      this.filtredUsers = this.users;
    }
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

  onTimeChange(plan: JourRegimeHoraire, field: string) {
    if (field === 'heureEntree1' || field === 'heureSortie1') {
      if (plan.heureEntree1! >= plan.heureSortie1!) {
        plan.heureSortie1 = this.addMinutes(plan.heureEntree1!, 0);
      }
      if (plan.heureSortie1! >= plan.heureEntree2!) {
        plan.heureEntree2 = this.addMinutes(plan.heureSortie1!, 0);
      }
      if (plan.heureEntree2! >= plan.heureSortie2!) {
        plan.heureSortie2 = this.addMinutes(plan.heureEntree2!, 0);
      }
    }
    if (field === 'heureEntree2' || field === 'heureSortie2') {
      if (plan.heureEntree2! <= plan.heureSortie1!) {
        plan.heureEntree2 = this.addMinutes(plan.heureSortie1!, 0);
      }
      if (plan.heureEntree2! >= plan.heureSortie2!) {
        plan.heureSortie2 = this.addMinutes(plan.heureEntree2!, 0);
      }
    }
    if (field === 'heureDepartPause' || field === 'heureFinPause') {
      if (plan.heureFinPause! <= plan.heureDepartPause!) {
        plan.heureFinPause = this.addMinutes(plan.heureDepartPause!, 0);
      }
    }
    this.calculateNbreHeuresPrevues(plan);
  }

  async sendplaning(){
    this.loading = true 
    const data = this.JourHoraire.map(m=> m.toPlainObject())
    try{
      await this.strapi.postStrapi('updateJoursRH',data)
      this.modif = false ;
    }catch (e) {
      throw e
    }
    console.log(data)
    this.loading = false
  }

  getTotalNbreHeuresPrevues(): { total: number, exceeded: boolean } {
    let sum = 0;
    if (this.JourHoraire && this.JourHoraire.length > 0) {
      sum = this.JourHoraire.reduce((acc, curr) => acc + (curr.nbre_heures_prevues || 0), 0);
    }
    const exceeded = sum > (this.planing.nombre_heures || 0);
    return { total: sum, exceeded: exceeded };
  }

  CalculdiffInMinutes (start: Date, end: Date): number {
    const diffMilliseconds = Math.abs(end.getTime() - start.getTime());
    return diffMilliseconds / (1000 * 60);
  };

  calculateNbreHeuresPrevues(plan: JourRegimeHoraire) {
    const diffInMinutes = (start: Date, end: Date): number => {
        const diffMilliseconds = Math.abs(end.getTime() - start.getTime());
        return diffMilliseconds / (1000 * 60);
    };

    let totalMinutes = diffInMinutes(new Date(plan.heureEntree1!), new Date(plan.heureSortie1!));
    if (plan.nbrePointages === 4) {
        totalMinutes += diffInMinutes(new Date(plan.heureEntree2!), new Date(plan.heureSortie2!));
    }
    plan.nbre_heures_prevues = totalMinutes / 60;
  }

  addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  constructor(public datePipe: DatePipe , private messageService: MessageService , private strapi : StrapiService,private strapiService: StrapiService){ }
  
  async getPlaning(){
      this.loading = true
      const data = await this.strapi.getFromStrapi('regime-horaires',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,'populate=*'+this.filterdata ,'date')
      this.totalRecords = this.strapi.total;
      this.planings = Planning.mapPlannings(data) 
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

  if (!this.planing.nom || this.planing.nom.trim() === '') {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Sélectionner nom',
    });
    validationError = true;
  }

  if (!this.planing.planning_horaire || this.planing.planning_horaire.trim() === '') {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Sélectionner planning horaire',
    });
    validationError = true;
  }

  if (!this.planing.debut_validite) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Sélectionner début validité',
    });
    validationError = true;
  }

  if (!this.planing.fin_validite) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Sélectionner fin validité',
    });
    validationError = true;
  }

  if (!this.planing.nombre_heures) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Sélectionner nombre d\'heures',
    });
    validationError = true;
  }

  if (!this.planing.groupe_regime_horaire || this.planing.groupe_regime_horaire.length === 0) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Sélectionner groupe régime horaire',
    });
    validationError = true;
  }

  if (validationError) {
    return;
  }

    const offset  = this.planing.debut_validite?.getTimezoneOffset();
    this.planing.debut_validite?.setDate(this.planing.debut_validite?.getDate());
    this.planing.debut_validite?.setTime(this.planing.debut_validite?.getTime() - offset! * 60 * 1000);
    this.planing.fin_validite?.setDate(this.planing.fin_validite?.getDate());
    this.planing.fin_validite?.setTime(this.planing.fin_validite?.getTime() - offset! * 60 * 1000);

    const ids = this.planing.groupe_regime_horaire?.map(m => m.id);
    const idsUser = this.planing.users?.map(m => m.id);
      const data = {
        "data" : {
          nom : this.planing.nom ,
          description : this.planing.description ,
          groupe_regime_horaires : ids ,
          planning_horaire : this.planing.planning_horaire,
          nb_heures :  this.planing.nombre_heures,
          users : idsUser,
          debut_validite : this.planing.debut_validite,
          fin_validite : this.planing.fin_validite ,
        }
      }
      if(this.planing.id){
        try {
          await this.strapi.updateById('regime-horaires',this.planing.id,data)
          this.getPlaning()
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur de modification" ,
          }); 
        }
      }else{
        try {
          await this.strapi.postStrapi('regime-horaires',data)
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
      this.planing = {};
  }

  async deletePlaning(){
    const id = this.planing.id
    if (!navigator.onLine) {
      // Emit an event to show the dialog when offline
      this.offlineDeleteVisible=true;
      console.log('No internet connection. Delete operation not allowed.');
      return; // Prevent further execution
    }
    try{
      await this.strapi.deleteById('regime-horaires', id!)
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
