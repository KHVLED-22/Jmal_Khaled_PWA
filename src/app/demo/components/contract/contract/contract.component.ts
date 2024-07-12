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

  }

  constructor( private messageService: MessageService , private strapi : StrapiService){ }

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
  }

  async deletedep(){
    const id = this.contract.id
    try{
      await this.strapi.deleteById('type-contrats', id!)
      this.getDep();
      this.confirmDeleteVisible = false ;
    }catch (e) {
    }
  }
}
