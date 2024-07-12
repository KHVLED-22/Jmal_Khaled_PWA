import { Component, ElementRef, ViewChild ,OnInit, HostListener , Renderer2  } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { pointage } from '../../pointage';
import { StrapiService } from '../../../../service/strapi.service'
import { User } from '../../../models/user';
import { Establishment } from '../../../models/etablissement';
import { Machine } from '../../../models/machine';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { Employee } from '../../../models/Employe';
// import { cp } from 'fs';



@Component({
  selector: 'app-list-pointages',
  templateUrl: './list-pointages.component.html',
  styleUrl: './list-pointages.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ListPointagesComponent implements OnInit  {
  @ViewChild('dataTable') dataTable!: Table;
  @ViewChild('fileInput') fileInput!: ElementRef;
  showFilters = false;
  Pointages: pointage[] = [];
  ExportPointages: pointage[] = [];
  page: any;
  size: any;
  sort: any;
  option: any;
  totalRecords: any;
  loading = false;
  selectedEtablissement: any;
  selectedusers: any;
  postdate = new Date();
  selectedmachines: Machine[] = [];
  date: string = this.postdate.toString()
  Etabs: Establishment[] = [];
  users: User[] = []
  showdate: any;
  timezone = 'local';
  checked: boolean = false;
  addpointage: any = {};
  machines: Machine[] = [];
  selectedmachine: any[] = [];
  usermachineid: any;
  itemdelete: any = {}
  filterdata = '';
  searchdate: any;
  visible = false;
  confirmDeleteVisible = false;
  filtredUsers: User[] = [];
  loadingData = false;
  syncroDate: any;
  Cols: { header: string, shortHeader: string, field: string, width: number, sortable: boolean }[] = [
    { header: "Nom d'utilisateur", shortHeader: "Nom", field: 'user.username', width: 15, sortable: true },
    { header: 'Établissement', shortHeader: "Étab", field: 'user.etablissement.name', width: 5, sortable: true },
    { header: 'Date', shortHeader: "Date", field: 'date', width: 0, sortable: true },
    { header: 'Jour', shortHeader: "Jour", field: 'jour', width: 0, sortable: true },
    { header: 'Première séance', shortHeader: "1ère s.", field: '1seance', width: 25, sortable: false },
    { header: 'Deuxième séance', shortHeader: "2ème s.", field: '2seance', width: 25, sortable: false },
    { header: 'État', shortHeader: "État", field: 'etat', width: 10, sortable: true },
    { header: 'Régime horaire', shortHeader: "Régime", field: 'planning_horaire', width: 10, sortable: true },
    { header: 'Temps manquant', shortHeader: "T. manq.", field: 'skipTime', width: 10, sortable: false },
    { header: 'Temps de retard', shortHeader: "T. retard", field: 'nb_heures_manq', width: 10, sortable: false },
    { header: 'Temps prévu', shortHeader: "T. prévu", field: 'totalPlanHoursWorked', width: 10, sortable: false },
    { header: 'Temps supplémentaire', shortHeader: "T. supp.", field: 'nb_heures_supp', width: 10, sortable: false },
    { header: 'Temps supplémentaire Activé/Désactivé', shortHeader: "A/D T.s", field: 'temps_sup', width: 10, sortable: false },
    { header: 'Temps total', shortHeader: "T. total", field: 'nb_heures', width: 10, sortable: false }
  ];

  constructor(private messageService: MessageService, private strapi: StrapiService, private renderer: Renderer2) {
    this.loadingData = this.strapi.isApiCallInProgress();
}

  filter() {
    this.dataTable.first = 0; //Réinitialise l'index du premier élément affiché dans la table à zéro, ce qui signifie que la table recommence à afficher les résultats à partir de la première page.
    this.page = 0
    console.log(this.selectedEtablissement)
    var filters = ``;         //variable
    if (this.selectedEtablissement) {
      this.selectedEtablissement.forEach((SE: any) => {
        filters += `filters[user][etablissement][id][$in]=${SE.id}&`;
      });
    }
    if (this.selectedusers) {
      this.selectedusers.forEach((SE: any) => {
        filters += `filters[user][id][$in]=${SE.id}&`;
      });
    }
    this.filterdata = filters;
    this.getPointages();
    console.log(filters);

    setTimeout(() => {
      this.showdate = this.searchdate;
    }, 1000);
  }

  filterMachine(event: any) {
    console.log(event.value.map((v: any) => v.id))
  }

  async Importer() {
    if (this.selectedmachines.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Selectionner une machine',
      });
      return;
    }

    const data = { // objet data qui contient un tableau d'identifiants (id) des machines sélectionnées
      machines: this.selectedmachines.map((v: any) => v.id),
    };

    try {
      this.loadingData = true;
      this.strapi.setApiCallInProgress(true);
      await this.strapi.postStrapi('createPointage', data);
    } catch (error) {
      throw error;
    } finally {
      this.loadingData = false;
      this.strapi.setApiCallInProgress(false);
    }
  }

  async onTempsSupChange(id: number, event: any) {
    console.log(event) //Affiche l'objet event dans la console pour aider au débogage et à la vérification des données reçues.
    this.loading = true
    const data = {
      data: {
        temps_sup: event.checked
      }
    }
    try {
      await this.strapi.updateById('user-pointages', id, data)
      this.getPointages();
    } catch (error) {
      throw error;
    }
    this.loading = false
  }

  formatDate(dateString: string, type: string): string { //La fonction retourne une chaîne formatée selon le type spécifié.
    const date = new Date(dateString);
    if (type === 'date' && dateString) {
      return date.toLocaleDateString('en-GB');
    } else if (type === 'datetime' && dateString) {
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } else {
      return '';
    }
  }

  async senddata(): Promise<void> {
    if (this.searchdate && this.searchdate.length === 2) { //This condition checks if searchdate is defined and if it contains exactly two dates (start and end).
      const [start, end] = this.searchdate; //It extracts the start and end dates from the searchdate array.
      const diffInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24); //getTime() returns the number of milliseconds since January 1, 1970.

      if (diffInDays > 31) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de validation',
          detail: 'La plage de dates ne peut pas dépasser 31 jours.',
        });
        return
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Selectionner la date de l\'export.',
      });
      return // arrête l'exécution.
    }
    //filtrage
    var filters = ``;
    if (this.selectedEtablissement) {
      this.selectedEtablissement.forEach((SE: any) => {
        filters += `filters[user][etablissement][id][$in]=${SE.id}&`;
      });
    }
    if (this.selectedusers) {
      this.selectedusers.forEach((SE: any) => {
        filters += `filters[user][id][$in]=${SE.id}&`;
      });
    }
    this.filterdata = filters;
    this.loading = true;
    let exportLines // pour stocker les lignes exportées.
    let allEntries = { data: [] };
    let totalRecords = 0; // 0 pour stocker le nombre total d'enregistrements.
    document.body.classList.add('loading');
    let page = 1
    let pageSize = 100 // pour récupérer 100 enregistrements par page.
    let count = 0
    try {
      do {
        const response: any = await this.strapi.getFromStrapi(
          'user-pointages',
          page,
          pageSize,
          this.sort,
          this.option,
          undefined,
          undefined,
          undefined,
          this.searchdate,
          '&populate=pointages&populate=user&populate=user.etablissement&' + this.filterdata,
          'date'
        );
        if (Array.isArray(this.searchdate)) {
          if (this.searchdate[0] instanceof Date) {
            this.searchdate[0].setDate(this.searchdate[0].getDate() - 1);
          }
          if (this.searchdate[1] instanceof Date) {
            this.searchdate[1].setDate(this.searchdate[1].getDate() - 1);
          }
        }
        console.log('data return :', response)
        console.log('data return legnth :', response.length)
        allEntries.data = allEntries.data.concat(response);//Concatène les données récupérées à allEntries.data.
        totalRecords = this.totalRecords;
        count += 100;
        page += 1;
      } while (count < this.strapi.total); //La boucle continue jusqu'à ce que count atteigne le nombre total d'enregistrements (this.strapi.total).
      exportLines = allEntries;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    console.log('Export : ', exportLines)
    this.ExportPointages = pointage.mapPointage(exportLines?.data!); // Conversion des Données en Format d'Export !!!!!!!!!!!!!!!!!!!!!
    await new Promise<void>((resolve, reject) => { //Crée une nouvelle promesse pour gérer l'exportation.
      let sortedData = [];
      let wb = XLSX.utils.book_new(); // Crée un nouveau classeur Excel avec XLSX.utils.book_new().
      if (this.ExportPointages) { // contient donné
        for (let pointage of this.ExportPointages) {// pour chaque pointage dans ExportPointages
          let user = pointage.user.username; // Récupère le nom d'utilisateur
          let firstSession = []; // Tableau pour stocker les horaires de la première séance
          let secondSession = [];
          let nombreH = this.showHeure(pointage.nb_heures.toString()); // Convertit et formate le nombre d'heures
          let etat = pointage.etat; // Récupère l'état du pointage
          let date = this.formatDate(pointage.date, 'date')
          let etab = pointage.user.etablissement?.name
          
          // Trie les pointages par timestamp, exclut ceux marqués comme supprimés
          let sortedPointages = pointage.pointages
            .filter(item => !item.isDeleted)
            .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());

          // Parcourt les pointages triés pour les séparer en deux sessions
          for (let i = 0; i < sortedPointages.length; i++) {
            let pointageItem = sortedPointages[i];
            let time = new Date(pointageItem.timestamp!).toLocaleTimeString('fr-FR');

          // Stocke les deux premiers horaires dans firstSession, les autres dans secondSession
            if (i < 2) {
              firstSession.push(time);
            } else {
              secondSession.push(time);
            }
          }
    // Construit un objet contenant toutes les données pour ce pointage

          let data: { [key: string]: string } = {
            'Nom d\'utilisateur': user,
            'Etablissement': etab!,
            'Nombre d\'heures': nombreH,
            'Date': date,
            'État': etat,
          };
    // Ajoute les horaires de la première séance à l'objet data

          firstSession.forEach((time, index) => {
            data[`1er seance ${index + 1}`] = time;
          });
    // Ajoute les horaires de la deuxième séance à l'objet data

          secondSession.forEach((time, index) => {
            data[`2eme seance ${index + 1}`] = time;
          });
    // Ajoute l'objet data au tableau des données triées (sortedData)

          sortedData.push(data);
        }
  // Convertit le tableau de données triées en feuille de calcul Excel (worksheet)

        let ws = XLSX.utils.json_to_sheet(sortedData);
        
  // Ajoute la feuille de calcul au classeur Excel (workbook)

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          // Écrit le classeur Excel dans un fichier nommé "sortedData.xlsx"

        XLSX.writeFile(wb, "sortedData.xlsx");
      }

      resolve();
    });

    this.loading = false;
    document.body.classList.remove('loading');
  }

  filterusers(event: any) { //Filters users based on whether their establishment ID matches any of the selected establishment IDs.
    console.log(this.selectedEtablissement);//mta3 el filters
    if (event.value.length > 0) {
      const selectedIds = event.value.map((item: any) => item.id); //mapping over the event.value array and extracting the id property from each item.
      this.filtredUsers = this.users.filter((user: any) =>
        user.etablissement.id && selectedIds.includes(user.etablissement.id)
      );//Filter Users by Selected Establishments
    } else {
      this.filtredUsers = this.users;//Reset Filtered Users if No Establishments are Selected
    }
  }

  async importCSV(event: any) {
    const file: File = event.target.files[0]; //This assumes that the user has selected a file
    let data = {};
    if (file) {
      const reader: FileReader = new FileReader(); //Creates a new FileReader object to read the contents of the selected file.
      reader.onload = async (e: any) => { //This function will be called when the file has been read successfully.
        const bstr: string = e.target.result; //Retrieves the result of the file reading operation (a binary string) and assigns it to the bstr variable.
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' }); //const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0]; //Retrieves the name of the first worksheet in the workbook and assigns it to the wsname variable.
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];//Retrieves the worksheet object corresponding to the wsname and assigns it to the ws variable.
        data = XLSX.utils.sheet_to_json(ws, { header: 1 }); //convert the worksheet data to JSON format. The header: 1 option indicates that the first row should be treated as headers.
        console.log(data);
        await this.strapi.postStrapi('importPointages', data) //Sends a POST request to the importPointages endpoint of the strapi service with the JSON data as the payload.
      };
      reader.readAsBinaryString(file);//Initiates reading the selected file as a binary string.
    }
  }

  getTimeFromTimestamp(timestamp: string): string { //is to ensure that the minutes part of the time is always displayed with two digits. This is important for consistent formatting of the time string, especially when the minutes are less than 10.
    const date = new Date(timestamp);//The timestamp should be in a format recognized by the Date constructor, such as ISO 8601 (e.g., "2023-07-09T12:34:56Z").
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes; //Checks if the minutes value is less than 10. If minutes is less than 10, it pads the minutes with a leading zero by concatenating '0' and the minutes value. If minutes is 10 or greater, it leaves the minutes value unchanged.
    
    return hours + ':' + paddedMinutes;
  }

  SelectedCols: any[] = this.Cols

  showHeure(nb: string): string {
    let hourPart = Math.floor(parseFloat(nb));//Convert String to Number and Calculate Hours
    let minutePart = Math.round((parseFloat(nb) - hourPart) * 60);

    if (minutePart === 60) {
      hourPart += 1;
      minutePart = 0;
    }

    return nb !== '0' ? `${hourPart}:${minutePart > 9 ? '' : '0'}${minutePart}` : '0:00';//If nb is not '0', it formats the time as a string:
    //If nb is '0', it returns the string '0:00'.
  }
  
  async ngOnInit() { //    ngOnInit is a lifecycle hook in Angular that gets called once after the component has been initialized. It is part of the Angular component lifecycle and is commonly used for the following purposes:
   
    const dataEtab = await this.strapi.getFromStrapi('etablissements', 1, 25, 'id', -1, undefined, undefined, undefined, undefined, '')//Fetch Data for Establishments:
    this.Etabs = Establishment.mapEstablishments(dataEtab)//Maps the fetched establishments data (dataEtab) to a local property Etabs using a mapEstablishments method of the Establishment class.
    const datauser = await this.strapi.getFromStrapi('users', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'populate=etablissement')//Fetch Data for Users:
    this.users = User.mapUsers(datauser);//Maps the fetched users data (datauser) to a local property users using a mapUsers method of the User class.
    this.filtredUsers = this.users
    const machinedata = await this.strapi.getFromStrapi('machines', 1, 25, undefined, undefined, undefined, undefined, undefined, undefined);//Fetch Data for Machines:
    this.machines = Machine.mapMachines(machinedata)
    await this.strapi.getFromStrapi('parametre').then((v: any) => {
      this.syncroDate = v.attributes.lastSyncDateTime
    })//Uses the strapi service to fetch data from the 'parametre' endpoint. Extracts the lastSyncDateTime attribute from the response and assigns it to the syncroDate property.
    
    console.log('Sycnro data is : ', this.syncroDate)
  }


 
  showfilter() {
    this.showFilters = !this.showFilters
  }

  fixpointage(pointage: pointage, bool: boolean) {//bech ki tzid pointage jdid w houa lezmo yji fel west , mayjich lokhani 
    const items = pointage.pointages
      .filter(item => !item.isDeleted)  //Filters the pointages array to exclude items where isDeleted is true.
      .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()); //Sorts the filtered array in ascending order based on the timestamp property.
    if (bool) { //The function returns the first two items of the sorted and filtered pointages.
      return items.slice(0, 2);
    } else { //The function returns all items starting from the third item of the sorted and filtered pointages
      return items.slice(2);
    }
  }
  
  async onLazyLoad(event: any) { //function is responsible for handling the lazy loading of data, typically in a paginated table or infinite scroll component. When the user scrolls 
    // or navigates through the table, this function fetches the necessary data based on the current state of pagination, sorting, and other parameters
    console.log('event is :', event)
    this.page = Math.floor(event.first / event.rows) + 1;//Calculating the Page Number:
    this.size = event.rows;//Setting the Page Size
    this.sort = event.sortField ? event.sortField : 'date';//If a sort field is provided, it sets this.sort to that field; otherwise, it defaults to sorting by date.
    this.option = event.sortOrder;
    await this.getPointages();
    console.log('les pointages sont :', this.Pointages);
    console.log(event);
  }//The onLazyLoad function is connected to the PrimeNG table to fetch data based on the current pagination and sorting state.

  async getPointages() {
    this.loading = true; // Set the loading indicator to true to show a loading state in the UI.
    
    // Fetch data from Strapi
    const dataPoint = await this.strapi.getFromStrapi(
        'user-pointages', // The endpoint to fetch data from.
        this.page, // The current page number for pagination.
        this.size, // The number of records per page.
        this.sort, // The field to sort the data by.
        this.option, // The sort order (ascending or descending).
        undefined, // Other parameters (not used here).
        undefined, // Other parameters (not used here).
        undefined, // Other parameters (not used here).
        this.searchdate, // The search date or date range.
        '&populate=pointages&populate=user&populate=user.etablissement&' + this.filterdata, // Additional query parameters for populating related data.
        'date' // Default sort field.
    );

    // Set the total number of records based on the response from Strapi.
    this.totalRecords = this.strapi.total;
    
    // Map the fetched data to the Pointages array.
    this.Pointages = pointage.mapPointage(dataPoint);
    
    // Adjust the search dates if they are instances of Date.
    if (Array.isArray(this.searchdate)) {
        if (this.searchdate[0] instanceof Date) {
            this.searchdate[0].setDate(this.searchdate[0].getDate() - 1);
        }
        if (this.searchdate[1] instanceof Date) {
            this.searchdate[1].setDate(this.searchdate[1].getDate() - 1);
        }
    }

    this.loading = false; // Set the loading indicator to false to hide the loading state in the UI.
}


  async deletePointage() {
    const data = { //This line creates a data object containing the isDeleted property set to true. This object will be used to update the pointage record.
      "data": {
        isDeleted: true //delete hia juste tbedel el etat isDeleted = true (mekch bech tfsakhha berrasmi)
      }
    }
    await this.strapi.updateById('pointages', this.itemdelete.id, data) //This line sends an asynchronous request to the Strapi service to update the pointage record identified by this.itemdelete.id, setting its isDeleted property to true.
    this.getPointages();
    this.confirmDeleteVisible = false;
  }

  async addmachine() {
    console.log(this.addpointage.user.id);
    const machinedata = await this.strapi.getFromStrapi('machines', 1, 25, undefined, undefined, undefined, undefined, undefined, undefined, '&filters[user_machines][user][id][$eq]=' + this.addpointage.user.id + '&populate=user-machine');
    this.machines = Machine.mapMachines(machinedata)
    this.selectedmachine[0] = this.machines[0] //Sets the first machine from the fetched data as the selected machine.

    //Fetches user-machine relationship data for the selected user and machine using a Strapi service call with appropriate filters.
    const usermachinedata = await this.strapi.getFromStrapi('user-machines', 1, 25, undefined, undefined, undefined, undefined, undefined, undefined, '&filters[user][id][$eq]=' + this.addpointage.user.id + '&filters[machine][id][$eq]=' + this.selectedmachine[0].id);
    console.log('usermachine', usermachinedata);
    this.usermachineid = usermachinedata[0].attributes.userId;//Extracts the user-machine ID from the fetched data and stores it in the usermachineid property.
    console.log('id :', this.usermachineid);
  }

  reset() {
    this.selectedEtablissement = [];
    this.filtredUsers = this.users
    this.selectedusers = [];
    this.searchdate = undefined;
    this.showdate = undefined;
    this.page = 1;
    this.filterdata = '';
    this.dataTable.first = 0;
    this.getPointages();
  }

  checkimpair(point: pointage): boolean {//boolean est le type de retour 
    // to determine whether a given pointage object meets certain conditions based on its pointages 
    const pointlist = point.pointages.filter(v => v.isDeleted === false);// filtering the pointages array of the pointage object (point) to exclude items where isDeleted is true.
    const calcul = pointlist.length % 2;// Calculate the remainder of the length of filtered pointages divided by 2
    if (this.checked && calcul != 0) {
      return true;
    } else if (this.checked == false) {
      return false;
    } else if (pointlist.length == 0) {
      return true
    }
    else {
      return false;
    }
  }
  async addPointage() {// handle the addition of a new pointage (likely related to time or activity tracking) based on certain conditions and user selections.
    console.log('date pointage est :', this.addpointage.date);
    const datapoint = new Date(this.addpointage.date) //Converts the provided date to a JavaScript Date object.
    if (this.postdate && this.selectedmachine.length == 1) {
      let date: any; //Adjusts the date and time based on the server's or client's timezone settings to ensure consistency. 
      if (this.timezone == 'serveur') {
        date = new Date(this.postdate)
        console.log('apres conver en type date', date)
        let offset: number;
        await this.strapi.getFromStrapi('getTimezone').then( //Makes an asynchronous call to getFromStrapi method with 'getTimezone' endpoint to fetch timezone information from the server.
          (v: any) => { //Arrow function that processes the server's response (v) containing timezone data.
            console.log('data here  is :', v)
            offset = - v.offsetServeur
          }
        );
        console.log('offset ', offset!)
        date.setDate(datapoint.getDate());//Sets the date part of date to match datapoint.getDate(), ensuring the date remains consistent after adjusting for timezone.
        date.setTime(date.getTime() - offset! * 60 * 1000);//Adjusts the date object's time by subtracting the server timezone offset (in minutes) from its current time. This synchronization ensures the date reflects the server's timezone.
        console.log(date)
      } else {
        date = new Date(this.postdate)//nitializes date with the value of this postdate, converting it into a Date object for local timezone manipulation.
        const offset = date.getTimezoneOffset();//Calculates the timezone offset (in minutes) for the local timezone relative to UTC. This offset is based on the client's browser settings.
        date.setFullYear(datapoint.getFullYear());//Sets the full year of date to match datapoint.getFullYear(), ensuring the year remains consistent after timezone adjustment.
        date.setMonth(datapoint.getMonth());//Sets the month of date to match datapoint.getMonth(), ensuring the month remains consistent after timezone adjustment.
        date.setDate(datapoint.getDate());//Sets the date part of date to match datapoint.getDa(),te ensuring the date remains consistent after timezone adjustment.
        console.log('month is', datapoint.getDate()) //Logs to the console the day of the month (datapoint.getDate()), aiding in debugging and verifying the correct date setting.
        date.setTime(date.getTime() - offset * 60 * 1000);//Adjusts the date object's time by subtracting the local timezone offset (in minutes) from its current time. This synchronization ensures the date reflects the local timezone
        console.log(date);
      }//Ends the else block for timezone handling, completing the logic for both server and local timezone adjustments.
      date.setHours(date.getHours() - 2); //Subtracts 2 hours from the hours component of date. This adjustment might be specific to the application's requirements, possibly related to timezone conversion or other business logic.
      date = date.toISOString();//Converts the date object to an ISO string format (YYYY-MM-DDTHH:mm:ss.sssZ). This format is widely used for transmitting dates over networks or saving them in databases.
      console.log('dateto send :', date);//Logs to the console the ISO string representation of date, which is the final date value prepared for sending to the server.
      const data = { //Preparing Data Object for API Call:

        "data": {
          "uid": this.usermachineid.toString(),// Converted to string representation of this.usermachineid.
          "user_id": this.addpointage.id.toString(),
          "machine": this.selectedmachine[0].id,//Id of the selected machine (this.selectedmachine[0].id).
          "status": true,
          "timestamp": date,// ISO string representation of the adjusted date.
          "isDeleted": false,
          "virtuelle": true
        }

      }
      await this.strapi.postStrapi('pointages', data) //Asynchronously sends a POST request to the server using postStrapi method to create a new pointage with the provided data object.
      this.getPointages() // refresh the pointages list after adding a new pointage. This ensures data consistency and reflects the newly added pointage.
      this.visible = false; // hiding the form or dialog after successfully adding the pointage.

    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: "Une seule machine a selectionner",
      });
    }
  }
}

