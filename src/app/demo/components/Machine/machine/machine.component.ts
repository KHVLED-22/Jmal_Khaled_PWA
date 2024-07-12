import { Component } from '@angular/core';
import { Machine } from '../../models/machine';
import {StrapiService} from '../../../service/strapi.service'
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrl: './machine.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class MachineComponent {
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
  machines : Machine [] = [];
  machine : Machine = {};
  selectedmachine : any [] =  [] ;
  usermachineid : any ;
  itemdelete : any = {}
  filterdata = '';
  searchdate : any ;
  visible = false ;
  confirmDeleteVisible = false ;
  Cols: { header: string, field: string, width: number, sortable: boolean }[] = [
    { header: 'Nom', field: 'name', width: 15, sortable: true },
    { header: 'Port', field: 'port', width: 15, sortable: true },
    { header: 'Adresse IP', field: 'adresseIP', width: 20, sortable: true },
    { header: 'Marque', field: 'marque', width: 15, sortable: true },
    { header: 'Modèle', field: 'modele', width: 15, sortable: true },
    { header: 'Description', field: 'description', width: 25, sortable: true },
    { header: 'Statut', field: 'statut', width: 10, sortable: true },
  ];
  statutOptions: any[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];
  SelectedCols : any [] = this.Cols
  
  async onLazyLoad(event : any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.sort = event.sortField ?  event.sortField : 'id';
    this.option = event.sortOrder;
    await this.getmachine();
    console.log(event);
  }

  ngOnInit(): void {
  }

  async exportMachines(): Promise<void> {
    this.loading = true;
    document.body.classList.add('loading');
  
    await new Promise<void>((resolve, reject) => {
      let sortedData = [];
      let wb = XLSX.utils.book_new();
      if (this.machines) {
        for (let machine of this.machines) {
          let data: { [key: string]: string } = {
            'Nom': machine.name!,
            'Port': machine.port!,
            'Adresse IP': machine.adresseIP!,
            'Marque': machine.marque!,
            'Modèle': machine.modele!,
            'Description': machine.description!,
            'Statut': machine.statut!,
          };
    
          sortedData.push(data);
        }
    
        let ws = XLSX.utils.json_to_sheet(sortedData);
        XLSX.utils.book_append_sheet(wb, ws, "Machines");
        XLSX.writeFile(wb, "machinesData.xlsx");
      }
  
      resolve();
    });
  
    this.loading = false;
    document.body.classList.remove('loading');
  }
  

  async getmachine(){
    this.loading = true
    const data = await this.strapi.getFromStrapi('machines',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,''+this.filterdata ,'date')
    this.totalRecords = this.strapi.total;
    this.machines = Machine.mapMachines(data) 
    this.loading = false ;
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

  async saveMachine(){
    let validationError = false;

    if (!this.machine.name || this.machine.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Sélectionner nom',
      });
      validationError = true;
    }

    if (!this.machine.port || this.machine.port.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Sélectionner port',
      });
      validationError = true;
    }

    if (!this.machine.adresseIP || this.machine.adresseIP.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Sélectionner adresse IP',
      });
      validationError = true;
    }

    if (!this.machine.marque || this.machine.marque.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Sélectionner marque',
      });
      validationError = true;
    }

    if (validationError) {
      return;
    }
      const data = {
        "data" : {
          ...this.machine
        }
      }
      if(this.machine.id){
        try {
          await this.strapi.updateById('machines',this.machine.id,data)
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur de modification" ,
          }); 
        }
      }else{
        try {
          await this.strapi.postStrapi('machines',data)
          this.getmachine()
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de validation'  ,
            detail:  "ereur d'insertion" ,
          });    
        }
      }
      this.visible = false ;
      this.machine = {};
  }

  async deleteMachine(){
    const id = this.machine.id
    try{
      await this.strapi.deleteById('machines', id!)
      this.getmachine();
      this.confirmDeleteVisible = false ;
    }catch (e) {
    }
  }

  
}
