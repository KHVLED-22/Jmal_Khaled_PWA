import { Component, ViewChild } from '@angular/core';
import { Establishment } from '../../models/etablissement';
import { Machine } from '../../models/machine';
import { Equipe, UserData } from '../../models/equipe';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { StrapiService } from 'src/app/demo/service/strapi.service';
import { Employee, userMachine } from '../../models/Employe';
import { Table } from 'primeng/table';
import { Societe } from '../../models/societe';
import { Departement } from '../../models/departement';
import { poste } from '../../models/poste';
import { contract } from '../../models/contract';
import { Planning } from '../../models/planing';
import { DocumentData , PhotoData  } from '../../models/document';
export interface OfflineRequest {
  key: string;
  method: string;
  table: string;
  id?: number;
  data?: any;
}

@Component({
  selector: 'app-listemploye',
  templateUrl: './listemploye.component.html',
  styleUrl: './listemploye.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ListemployeComponent {
@ViewChild('dataTable') dataTable!: Table;
showFilters = false;
page: any;
size: any;
sort: any;
option: any;
totalRecords : any ;
loading = false ;
selectedEtablissement : any ;
showOfflineOperationsTable = false;
selectedusers : any ;
postdate  = new Date();
date : string = this.postdate.toString()
offlineDeleteVisible = false; 
Etabs : Establishment [] = [] ;
users : UserData[] =[]
offlineRequests: OfflineRequest[] = [];
showdate : any ; 
timezone = 'local';
checked : boolean = false ;
addpointage : any = {};
machines : Machine [] = [];
selectedmachine : any [] =  [] ;
selectedequipes : any [] = [] ;
usermachineid : any ;
itemdelete : any = {}
filterdata = '';
searchdate : any ;
visible = false ;
confirmDeleteVisible = false ;
filtredUsers : UserData [] = [] ;
items: MenuItem[] = [];
activeIndex: number = 0;
employee: Employee = new Employee(null, {});
employees : Employee [] = [];
chefusers : UserData [] = [] ;
societes : Societe [] = [] ;
departements : Departement [] = [] ;
equipes : Equipe [] = [] ;
postes : poste [] = [] ;
contrats : contract[] = []; 
planings : Planning [] = [] ;
filteredcontrats : contract[] = []; 
filteredplanings : Planning [] = [] ;
filteredSocietes: Societe[] = [];
filteredDepartements: Departement[] = [];
filteredEquipes: Equipe[] = [];
filteredEtabs: Establishment[] = [];
filteredPostes: poste[] = [];
filteredUsers: UserData[] = [];
filteredmachines: Machine[] = [];
documentData : DocumentData = {} ;
filteredEquipesdep : Equipe[] = [];


Cols = [
  { header: 'ID', field: 'id', width: 5, sortable: true },
  { header: 'Nom', field: 'nom', width: 20, sortable: true },
  { header: 'Prenom', field: 'prenom', width: 20, sortable: true },
  { header: 'Poste', field: 'poste.titre', width:20, sortable: true },
  { header: 'Département', field: 'departement.nom', width: 15, sortable: true },
  { header: 'Date d\'embauche', field: 'date_embauche', width: 25, sortable: true },
  // { header: 'Titre', field: 'titre', width: 15, sortable: true },
];


filterLogic: string = 'AND'; 

filterEquipesfordep() {
  if (this.selectedDep.length === 0) {
    this.filteredEquipesdep = [...this.equipes];
  } else {
    const selectedDepIds = this.selectedDep.map((dep : Departement) => dep.id);
    this.filteredEquipesdep = this.equipes.filter(equipe => selectedDepIds.includes(equipe.departement?.id));
  }
}


filter() {
  this.dataTable.first = 0;
  this.page = 0
  let filters = '';
  let orIndex = 0;
  const addFilters = (items: any[], key: string) => {
    items.forEach((item: any) => {
      if (this.filterLogic === 'AND') {
        filters += `filters[${key}][id][$in]=${item.id}&`;
      } else if (this.filterLogic === 'OR') {
        filters += `filters[$or][${orIndex}][${key}][id][$in]=${item.id}&`;
        orIndex++;
      }
    });
  };
  if (this.selectedEtablissement) {
    addFilters(this.selectedEtablissement, 'user][etablissement');
  }
  if (this.selectedDep) {
    addFilters(this.selectedDep, 'departement');
  }
  if (this.selectedequipes) {
    addFilters(this.selectedequipes, 'equipe');
  }
  this.filterdata = filters;
  this.getPointages();
}



SelectedCols : any [] = this.Cols

sexes: string[] = ['homme', 'femme'];

etatCivils: string[] = [
  'Célibataire' ,
  'Marié(e)' ,
   'Divorcé(e)' ,
  'Veuf/Veuve' 
];
email : string = "" ;

// get email() {
//   return this.employee.user?.email || '';
// }

// set email(value: string) {
//   if (this.employee.user) {
//     this.employee.user.email = value;
//   }
// }

async onUploadfi(event:any) {
  const idImage=event.originalEvent.body[0].id

  console.log(idImage) 
}
uploadedFiles : any [] = []




onNext() {
  let validationError = false;
  const steps = [
    {
      conditions: [
        { field: 'nom', message: 'Sélectionner nom', check: !this.employee.nom || this.employee.nom.trim() === '' },
        { field: 'prenom', message: 'Sélectionner prénom', check: !this.employee.prenom || this.employee.prenom.trim() === '' },
        { field: 'tel', message: 'Sélectionner téléphone', check: !this.employee.tel || this.employee.tel <= 0 },
        { field: 'date_naissance', message: 'Sélectionner date de naissance', check: !this.employee.date_naissance },
        { field: 'sexe', message: 'Sélectionner sexe', check: !this.employee.sexe },
        { field: 'etat_civil', message: 'Sélectionner état civil', check: !this.employee.etat_civil }
      ]
    },
    {
      conditions: [
        { field: 'societe', message: 'Sélectionner société', check: !this.employee.societe },
        { field: 'departement', message: 'Sélectionner département', check: !this.employee.departement },
        { field: 'equipe', message: 'Sélectionner équipe', check: !this.employee.equipe },
        { field: 'etablissement', message: 'Sélectionner établissement', check: !this.employee.etablissement },
        { field: 'poste', message: 'Sélectionner poste', check: !this.employee.poste },
        { field: 'tel_professionnel', message: 'Saisir numéro professionnel', check: !this.employee.tel_professionnel || this.employee.tel_professionnel <= 0 }
      ]
    }
  ];

  steps[this.activeIndex].conditions.forEach(condition => {
    if (condition.check) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: condition.message
      });
      validationError = true;
    }
  });

  if (!validationError) {
    this.activeIndex++;
  }
}

onPrevious() {
  this.activeIndex--;
}

  initializeNewEmployee() {
    this.employee = new Employee(null, {});
    this.visible = true;
    this.activeIndex = 0;
  }

async onSubmit() {
  this.loading = true 
  if(this.employee.id === undefined){
    const offset = (new Date()).getTimezoneOffset() * 60000;
    const adjustedDateEmbauche = this.employee.date_embauche ? new Date(this.employee.date_embauche.getTime() - offset).toISOString().split('T')[0] : undefined;
    const adjustedDateNaissance = this.employee.date_naissance ? new Date(this.employee.date_naissance.getTime() - offset).toISOString().split('T')[0] : undefined;
    const postData: any = {
      tel: this.employee.tel,
      date_embauche: adjustedDateEmbauche,
      nom: this.employee.nom,
      prenom: this.employee.prenom,
      sexe: this.employee.sexe,
      etat_civil: this.employee.etat_civil,
      nombre_enfant: this.employee.nombre_enfant,
      matricule_cnss: this.employee.matricule_cnss,
      societe: this.employee.societe?.id,
      equipe: this.employee.equipe?.id,
      regime_horaire: this.employee.regime_horaire?.id,
      poste: this.employee.poste?.id,
      departement: this.employee.departement?.id,
      sup_hierarchique: this.employee.sup_hierarchique?.id,
      user: this.employee.user,
      type_contrat: this.employee.type_contrat?.id,
      etablissement: this.employee.etablissement?.id,
      date_naissance: adjustedDateNaissance,
      tel_professionnel: this.employee.tel_professionnel ,
      email : this.email,
      username : this.employee.prenom+ ' ' +  this.employee.nom
  };
    console.log(postData);
    try {
      this.visible= false ;
      await this.strapi.postStrapi('createEmploye',postData)
      this.getPointages()
    } catch (error) {
    }
  }else {
    try {
      this.visible= false ;
      await this.strapi.postStrapi('updateEmploye',this.employee.toPost!())
      this.getPointages()
    } catch (error) {
    }
  }
  this.loading =false
}


filterSocietes(event: any) {
  const query = event.query.toLowerCase();
  this.filteredSocietes = this.societes.filter(s => s.nom?.toLowerCase().includes(query));
}

filterDepartements(event: any) {
  const query = event.query.toLowerCase();
  this.filteredDepartements = this.departements.filter(d => d.nom?.toLowerCase().includes(query));
}

filterEquipes(event: any) {
  const query = event.query.toLowerCase();
  this.filteredEquipes = this.filteredEquipes.filter(e => e.nom?.toLowerCase().includes(query));
}

filterEtabs(event: any) {
  const query = event.query.toLowerCase();
  this.filteredEtabs = this.Etabs.filter(etab => etab.name?.toLowerCase().includes(query));
}

filterPostes(event: any) {
  const query = event.query.toLowerCase();
  this.filteredPostes = this.filteredPostes.filter(p => p.titre?.toLowerCase().includes(query));
}

filterUsers(event: any) {
  const query = event.query.toLowerCase();
  this.filteredUsers = this.users.filter(u => u.username?.toLowerCase().includes(query));
}
filterPlan(event: any) {
  const query = event.query.toLowerCase();
  this.filteredplanings = this.planings.filter(u => u.nom?.toLowerCase().includes(query));
}
filterContract(event: any) {
  const query = event.query.toLowerCase();
  this.filteredcontrats = this.contrats.filter(u => u.nom?.toLowerCase().includes(query));
}
filterMachine(event: any) {
  const query = event.query.toLowerCase();
  this.filteredmachines = this.machines.filter(u => u.name?.toLowerCase().includes(query));
}


documentDialog = false ;

async saveDoc(){

  console.log(this.documentData)

}

DepDis(): boolean {
  return this.employee.departement != undefined
}

onDepartementSelect(event: any) {
  const selectedDepartement: Departement = event.value;
  console.log(selectedDepartement)
  this.filterEquipesByDepartement(selectedDepartement);
  this.filterPostesByDepartement(selectedDepartement);
  this.employee.equipe = undefined ; 
  this.employee.poste = undefined ;
}

filterEquipesByDepartement(departement: Departement) {
  this.filteredEquipes = this.equipes.filter(equipe => equipe.departement?.id === departement.id);
  console.log(this.filteredEquipes)
}

filterPostesByDepartement(departement: Departement) {
  console.log(this.filteredPostes)

  this.filteredPostes = this.postes.filter(poste => 
    poste.departements && poste.departements.some(dep => dep.id === departement.id)
  );
}

editEmployee() {
  this.visible = true;
  this.activeIndex = 0;
}
Machine() {
  this.Addmachine = true;
  this.getusermachine(this.employee);
}


async ngOnInit() {
  this.menuItems = [
    {
      label: 'Modifier',
      icon: 'pi pi-pencil',
      command: () => { this.editEmployee(); }
    },
    {
      label: 'Ouvrir le document',
      icon: 'pi pi-file',
      command: () => { this.openDocument(this.employee); }
    },
    {
      label: 'Ajouter une machine',
      icon: 'pi pi-ticket',
      command: () => { this.Machine(); }
    },
    
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => { this.deletePointage(); }
    }
  ];
  this.items = [
    { label: 'Informations personnelles' },
    { label: 'Informations professionnelles' },
    { label: 'Paramètre RH' },
    // { label: 'Document' }
  ];
  const dataEtab = await this.strapi.getFromStrapi('etablissements',1,25,'id',-1,undefined,undefined,undefined,undefined,'')
  this.Etabs = Establishment.mapEstablishments(dataEtab) 
  const datauser = await this.strapi.getFromStrapi('users',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
  this.users = UserData.mapUsers(datauser);
  this.filtredUsers = this.users 
  const datamachine = await this.strapi.getFromStrapi('machines',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
  this.machines = Machine.mapMachines(datamachine);
  const datadep = await this.strapi.getFromStrapi('departements',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
  this.departements = Departement.mapDepartements(datadep);
  this.filteredDepartements = this.departements 
  const datadepuipe = await this.strapi.getFromStrapi('equipes',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=departement')
  this.equipes = Equipe.mapEquipes(datadepuipe);
  // this.filteredEquipes = this.equipes 
  const datasoci = await this.strapi.getFromStrapi('societes',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
  this.societes = Societe.mapSocietes(datasoci);
  this.filteredSocietes = this.societes
  const datadposte = await this.strapi.getFromStrapi('postes',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=*')
  this.postes = poste.mapPoste(datadposte);
  // this.filteredPostes = this.postes
  const dataplaning = await this.strapi.getFromStrapi('regime-horaires',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
  this.planings = Planning.mapPlannings(dataplaning);
  this.filteredplanings = this.planings
  const datadcontrat = await this.strapi.getFromStrapi('type-contrats',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=etablissement')
  this.contrats = contract.mapContract(datadcontrat);
  this.filteredcontrats = this.contrats

  this.strapiService.offlineOperations$.subscribe(show => {
    this.showOfflineOperationsTable = show;
  });
  this.showOfflineOperationsTable = this.offlineRequests.length > 0;
  this.offlineRequests = this.strapiService.getQueuedRequests();

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

showfilter(){
  this.showFilters = !this.showFilters
}

reset(){
  this.selectedEtablissement = [] ;
  this.filtredUsers = [];
  this.searchdate = undefined ;
  this.page = 1 ;
  this.filterdata = '';
  this.dataTable.first = 0;
  this.getPointages();
}


constructor( private messageService: MessageService , private strapi : StrapiService,private strapiService: StrapiService){ }

async onLazyLoad(event : any) {
  console.log('event is :',event )
  this.page = Math.floor(event.first / event.rows) + 1;
  this.size = event.rows;
  this.sort = event.sortField ?  event.sortField : 'id';
  this.option = event.sortOrder;
  await this.getPointages();
}

async openDocument(empl : Employee){
 this.employee = empl  ;
 this.loading = true ; 
 try {
   let data = await this.strapi.getFromStrapi(`documents/${this.employee.document}`,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=*')
   this.documentData = new DocumentData(data);
   this.documentDialog = true ;
   this.loading = false ;
 } catch (error) {
  console.log(error)
  this.documentDialog = false ;
  this.loading = false ;
}
console.log('doc : ',this.documentData)
}

async onUpload(field: string,event: any) {
  // this.uploadNew=true
  const idImage=event.originalEvent.body[0].id
  console.log(idImage)
  console.log(event)
  const dataIm = { "data" : {
    [field] : idImage 
  }}
  await this.strapi.updateById('documents',this.documentData.id! ,dataIm)
  let data = await this.strapi.getFromStrapi(`documents/${this.employee.document}`,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=*')
  this.documentData = new DocumentData(data);
  this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Image chargé' });
    }
UserId : string = '';

removeFile(field: string, index: number) {
  if (field === 'photo' && this.documentData.attributes!.photo) {
    this.documentData.attributes!.photo.data!.splice(index, 1);
  } else if (field === 'cinRecto' && this.documentData.attributes!.cin_recto) {
    this.documentData.attributes!.cin_recto.data!.splice(index, 1);
  } else if (field === 'cinVerso' && this.documentData.attributes!.cin_verso) {
    this.documentData.attributes!.cin_verso.data!.splice(index, 1);
  } else if (field === 'rib' && this.documentData.attributes!.rib) {
    this.documentData.attributes!.rib.data!.splice(index, 1);
  }
}

Addmachine : boolean = false ;

async addmachine( ){
  try {
    const data = {
      "data" : {
        userId : parseInt(this.usermachine.userID!) ,
        machine : this.usermachine.machine?.id
      }
    }
    await this.strapi.updateById('user-machines',this.usermachine.id! , data)
    this.Addmachine = false ;
  } catch (error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de modification'  ,
    });
  }
}

usermachine : userMachine = {}
selectedDep : any ;
async getusermachine(empl : Employee){
  this.employee = empl  ;
  this.loading = true ; 
  try {
    let data : any = await this.strapi.getFromStrapi(`user-machines/${this.employee.user_machines}`,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,'populate=*')
    this.usermachine = new userMachine(data.id , data.attributes);
    this.Addmachine = true ;
    this.loading = false ;
  } catch (error) {
   console.log(error)
     this.messageService.add({
          severity: 'error',
          summary: 'Erreur'  ,
        });
   this.Addmachine = false ;
   this.loading = false ;

 }
}

onFileSelect(event: any, field: string) {
  // const files = event.files;
  // this.uploadedFiles = [...this.uploadedFiles, ...files];

  // switch (field) {
  //   case 'photo':
  //     this.documentData.attributes = this.documentData.attributes || {};
  //     this.documentData.attributes.photo = this.documentData.attributes.photo || { data: [] };
  //     this.documentData.attributes.photo.data = this.documentData.attributes.photo.data.concat(
  //       files.map((file: any) => new PhotoData({ attributes: { name: file.name, url: file.objectURL } }))
  //     );
  //     break;
  //   case 'cinRecto':
  //     this.documentData.attributes = this.documentData.attributes || {};
  //     this.documentData.attributes.cin_recto = this.documentData.attributes.cin_recto || { data: [] };
  //     this.documentData.attributes.cin_recto.data = this.documentData.attributes.cin_recto.data.concat(
  //       files.map((file: any) => new PhotoData({ attributes: { name: file.name, url: file.objectURL } }))
  //     );
  //     break;
  //   case 'cinVerso':
  //     this.documentData.attributes = this.documentData.attributes || {};
  //     this.documentData.attributes.cin_verso = this.documentData.attributes.cin_verso || { data: [] };
  //     this.documentData.attributes.cin_verso.data = this.documentData.attributes.cin_verso.data.concat(
  //       files.map((file: any) => new PhotoData({ attributes: { name: file.name, url: file.objectURL } }))
  //     );
  //     break;
  //   case 'rib':
  //     this.documentData.attributes = this.documentData.attributes || {};
  //     this.documentData.attributes.rib = this.documentData.attributes.rib || { data: [] };
  //     this.documentData.attributes.rib.data = this.documentData.attributes.rib.data.concat(
  //       files.map((file: any) => new PhotoData({ attributes: { name: file.name, url: file.objectURL } }))
  //     );
  //     break;
  //   default:
  //     break;
  // }
}

onFileRemove(field: string) {
  switch (field) {
    case 'photo':
      this.documentData.attributes!.photo = { data: [] };
      break;
    case 'cinRecto':
      this.documentData.attributes!.cin_recto = { data: [] };
      break;
    case 'cinVerso':
      this.documentData.attributes!.cin_verso = { data: [] };
      break;
    case 'rib':
      this.documentData.attributes!.rib = { data: [] };
      break;
    default:
      break;
  }
}
defaultImageUrl: string = 'assets/demo/images/user-1024.webp';  menuItems: MenuItem[] = [];
menuOnShow(emp : Employee)
{
  this.employee = emp;
}

async getPointages(){
  this.loading = true
  const dataPoint = await this.strapi.getFromStrapi('employes',this.page,this.size,this.sort,this.option,undefined,undefined,undefined,this.searchdate,'&populate[demande_conge]=*&populate[societe]=*&populate[etablissement_gerer]=&populate[equipe]=*&populate[equipe_a_gerer]=&populate[departement_a_gerer]=&populate[regime_horaire]=*&populate[poste]=*&populate[departement]=*&populate[sup_hierarchique]=*&populate[regime_conge]=&populate[type_contrat]=*&populate[document][populate]=photo&populate[user][populate]=*&'+this.filterdata ,'date')
  this.totalRecords = this.strapi.total;
  this.employees = Employee.mapEmployees(dataPoint);
  if (Array.isArray(this.searchdate)) {
    if (this.searchdate[0] instanceof Date) {
        this.searchdate[0].setDate(this.searchdate[0].getDate()-1);
    }
    if (this.searchdate[1] instanceof Date) {
        this.searchdate[1].setDate(this.searchdate[1].getDate()-1);
    }
  }
  this.loading = false ;
  console.log(this.employees[0]);
}

async deletePointage(){
  if (!navigator.onLine) {
    // Emit an event to show the dialog when offline
    this.offlineDeleteVisible=true;
    console.log('No internet connection. Delete operation not allowed.');
    return; // Prevent further execution
  }
  const data = {"data" : {
    isDeleted : true 
  }}
  await this.strapi.deleteById('employes',this.employee.id!)
  this.getPointages();
  this.confirmDeleteVisible = false;
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
