import { Component } from '@angular/core';
import {StrapiService} from '../../../service/strapi.service'
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { Departement, UserData } from '../../models/departement';
import { User } from '../../models/user';
import { Establishment } from '../../models/etablissement';
import { Equipe } from '../../models/equipe';
import { catchError } from 'rxjs';
import { Societe } from '../../models/societe';
import { Machine } from '../../models/machine';
import { poste } from '../../models/poste';

@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrl: './departement.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class DepartementComponent {
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
  timezone = 'local';
  checked : boolean = false ;
  addpointage : any = {};
  selectedmachine : any [] =  [] ;
  usermachineid : any ;
  itemdelete : any = {}
  filterdata = '';
  searchdate : any ;
  visible = false ;
  confirmDeleteVisible = false ;
  departement : Departement = {};
  selectedusers : any ;
  selectedchef : any;
  selectedEtablissement : any ;
  filtredUsers : User [] = [] ;
  users : User[] =[]
  chefusers : User [] = [] ;
  Etabs : Establishment [] = [] ;
  societes : Societe [] = [] ;
  machines : Machine [] = [] ;
  departements : Departement [] = [] ;
  equipes : Equipe [] = [] ;
  postes : poste [] = [] ;

  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Nom', field: 'nom', width: 30, sortable: true },
    { header: 'Description', field: 'description', width: 30, sortable: true },
    { header: 'Chef de departement', field: 'chef', width: 30, sortable: true },
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
    const datauser = await this.strapi.getFromStrapi('users', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'populate=etablissement');
    this.users = UserData.mapUsers(datauser);
  }

  isOptionDisabled(equipe: Equipe): boolean {
    if (this.departement.equipes!.some((selectedEquipe: Equipe) => selectedEquipe.id === equipe.id)) {
      return true;
    }
    if (equipe.departement && equipe.departement.id !== this.departement.id) {
      return true;
    }
    return false;
  }

  constructor( private messageService: MessageService , private strapi : StrapiService){ }

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


  async getDep(){
    this.loading = true
    const data = await this.strapi.getFromStrapi('departements',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,'&populate=*'+this.filterdata ,'date')
    this.totalRecords = this.strapi.total;
    this.departements = Departement.mapDepartements(data) 
    this.loading = false ;
  }

  filterCountry(event:any){
    let filtered: any[] = [];
    let query = event.query;
      for (let i = 0; i < (this.users as any[])?.length; i++) {
          let country = (this.users as any[])[i];
          if (country.username.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }
      this.chefusers = filtered;
  }

  filterequipe(event:any){
    let filtered: any[] = [];
    let query = event.query;
      for (let i = 0; i < (this.equipes as any[])?.length; i++) {
          let country = (this.equipes as any[])[i];
          if (country.nom.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }
      this.equipes = filtered;
  }


  filterusers(event: any) {
    console.log(this.selectedEtablissement);
    if(event.value.length > 0){
      const selectedIds = event.value.map((item: any) => item.id);
      this.filtredUsers = this.users.filter((user: any) => 
          user.etablissement.id && selectedIds.includes(user.etablissement.id)
      );
    }else{
      this.filtredUsers = this.users ;
    }
  }

  async savedep(){
    let validationError = false;

    if (!this.departement.nom || this.departement.nom.trim() === '') {
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

    const ids: number[] = this.departement.equipes?.map(equipe => equipe.id!) ?? [];


      const data = {
        "data" : {
          "nom" : this.departement.nom ,
          "description" : this.departement.description,
          "chef_departement" : this.departement.chef_departement?.id,
          "equipes" : ids ,
        }
      }
      if(this.departement.id){
        try {
          await this.strapi.updateById('departements',this.departement.id,data)
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
          await this.strapi.postStrapi('departements',data)
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
      this.departement = {};
  }

  async deletedep(){
    const id = this.departement.id
    try{
      await this.strapi.deleteById('departements', id!)
      this.getDep();
      this.confirmDeleteVisible = false ;
    }catch (e) {
    }
  }





}
