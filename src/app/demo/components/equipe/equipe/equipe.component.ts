import { Component } from '@angular/core';
import {StrapiService} from '../../../service/strapi.service'
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { Departement } from '../../models/departement';
import { User } from '../../models/user';
import { Establishment } from '../../models/etablissement';
import { Equipe, UserData } from '../../models/equipe';

@Component({
  selector: 'app-equipe',

  templateUrl: './equipe.component.html',
  styleUrl: './equipe.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class EquipeComponent {
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
  departement? : Departement ;
  departements : Departement [] = [];
  filtredDep :any ;
  selectedusers : any ;
  selectedEtablissement : any ;
  Etabs : Establishment [] = [] ;
  users : UserData[] =[]
  usersEmp : UserData[] =[]
  filtredUsers : UserData [] = [] ;
  chefusers : User [] = [] ;
  equipes : Equipe [] = [] ;
  equipe : Equipe = {} ;
  selectedchef : any;
  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Nom', field: 'nom', width: 30, sortable: true },
    { header: 'Description', field: 'description', width: 30, sortable: true },
    { header: 'Chef d\'equipe', field: 'chef', width: 30, sortable: true },
    { header: 'departement', field: 'departement', width: 30, sortable: true },
  ];


 SelectedCols : any [] = this.Cols

 async onLazyLoad(event : any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.sort = event.sortField ?  event.sortField : 'id';
    this.option = event.sortOrder;
    await this.getDep();
  }


  async onFilterEmp(event: any) {
    const filterValue = event.filter;
    console.log(filterValue)
    const dataEmployee = await this.strapi.getFromStrapi('employes',undefined,undefined,undefined,undefined,filterValue,'nom','prenom',undefined,'populate=etablissement')
    this.usersEmp = UserData.mapUsers(dataEmployee , true);
  }

  async ngOnInit(){
    const dataEtab = await this.strapi.getFromStrapi('etablissements',1,25,'id',-1,undefined,undefined,undefined,undefined,'')
    this.Etabs = Establishment.mapEstablishments(dataEtab) 
    const datauser = await this.strapi.getFromStrapi('users',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
    this.users = UserData.mapUsers(datauser);
    const dataEmployee = await this.strapi.getFromStrapi('employes',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
    this.usersEmp = UserData.mapUsers(dataEmployee , true);
    console.log('emp are :' , this.usersEmp)
    const datadep = await this.strapi.getFromStrapi('departements',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
    this.departements = Departement.mapDepartements(datadep);
    this.filtredUsers = this.users 
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
    const data = await this.strapi.getFromStrapi('equipes',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,'&populate=*'+this.filterdata ,'date')
    this.totalRecords = this.strapi.total;
    this.equipes = Equipe.mapEquipes(data) 
    console.log(this.equipes)
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

  filterDep(event:any){
    let filtered: any[] = [];
    let query = event.query;

      for (let i = 0; i < (this.departements as any[])?.length; i++) {
          let country = (this.departements as any[])[i];
          if (country.nom.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }

      this.filtredDep = filtered;
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

    if (!this.equipe.nom || this.equipe.nom.trim() === '') {
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

    const ids: number[] = this.equipe.membres?.map(member => member.id) ?? [];

      const data = {
        "data" : {
          "nom" : this.equipe.nom ,
          "description" : this.equipe.description,
          "chef_equipe" : this.equipe?.chef_equipe?.id,
          "departement" : this.equipe.departement?.id,
          "employes" : ids,
        }
      }
      if(this.equipe.id){
        try {
          await this.strapi.updateById('equipes',this.equipe.id,data)
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
          await this.strapi.postStrapi('equipes',data)
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
    const id = this.equipe.id
    try{
      await this.strapi.deleteById('equipes', id!)
      this.getDep();
      this.confirmDeleteVisible = false ;
    }catch (e) {
    }
  }

}
