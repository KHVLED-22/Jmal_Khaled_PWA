import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { openDB, DBSchema } from 'idb';
import { OfflineService } from './offline.service';
import { Router } from '@angular/router'; // Import Router
import { BehaviorSubject } from 'rxjs';

interface MyDB extends DBSchema {
  data: {
    key: string; // The key used to identify objects in the store
    value: {      // Ensure this matches what you're storing
      key: string; // This should reflect your key path
      value: any[];
    };
  };
  requests: {
    key: string;
    value: OfflineRequest;
  };
}
interface OfflineRequest {
  key: string;
  method: string;
  table: string;
  id?: number;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private apiUrl = 'https://rh.cegidretail.shop/api/';
  total = 0;
  statuscode: any;
  nbCashedtable = 0;
  offlineDeleteVisible = false; 
  private offlineOperationsSubject = new BehaviorSubject<boolean>(false);
  private queuedRequests: OfflineRequest[] = []; 
  offlineOperations$ = this.offlineOperationsSubject.asObservable();
  private tablesToCache = [//29
    'machines', 'user-machines', 'etablissements', 'users', 'user-pointages',
    'autorisations', 'employes', 'equipes', 'departements','cron-jobs',
    'type-conges', 'demande-conges', 'societes', 'regime-horaires','jours',
    'postes', 'regime-conges', 'type-contrats', 'documents', 'time-sheet-employes', 
    'pauses', 'plannification-conges', 'plannings', 'time-sheets', 'contrats'
    ,'groupe-regime-horaires',  'jour-time-sheets','parametre', 'pointages'
    //,'param-rh'
  ];

public dbPromise = openDB<MyDB>('offline-database', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('data')) {
      db.createObjectStore('data', { keyPath: 'key' });
      console.log('Data store created.');
    }
    if (!db.objectStoreNames.contains('requests')) {
      db.createObjectStore('requests', { keyPath: 'key' });
      console.log('Requests store created.');
    }
  },
});

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private offlineService: OfflineService,
    private router: Router // Inject Router
  ) {
    this.offlineService.isOnline$.subscribe(isOnline => {
      if (isOnline) {
        this.processOfflineRequests();
      }
    });
  }

  async getFromStrapi(
    table: string,
    page?: number,
    size?: number,
    field?: string,
    option?: any,
    filter?: string,
    searshdata1?: string,
    searshdata2?: string,
    date?: any,
    add?: any,
    datefield?: any
  ): Promise<any[]> {
    // const cacheKey = `${table}`;
    this.apiUrl = 'https://rh.cegidretail.shop/api/';
    //const cacheKey = `${table}-${page}-${size}-${field}-${option}-${filter}-${searshdata1}-${searshdata2}-${date}-${add}-${datefield}`;
    const cacheKey = `${table}-${page}-${size}`;
    if (!navigator.onLine) {
      console.log('Offline mode: Retrieving data from IndexedDB with key:', cacheKey);
      const cachedData = await this.getDataFromIndexedDB(cacheKey);
      if (cachedData.length > 0) {
          console.log('Cached data found:', cachedData);
          return this.applyClientSideFilter(cachedData, filter, searshdata1, searshdata2);
      } else {
          console.error('No cached data available for key:', cacheKey);
          throw new Error('No cached data available for offline use.');
      }
  }

    console.log('Data retrieved from Server : https://rh.cegidretail.shop/');
    this.statuscode = 0; // Initialize status code
    let apiUrl = `${this.apiUrl}${table}?`;

    let searchUrl = `filters[$or][0][${searshdata1}][$containsi]=${filter}&`;
    searchUrl = searshdata2 ? `${searchUrl}&filters[$or][1][${searshdata2}][$containsi]=${filter}` : searchUrl;

    const sortOrder = option === 1 ? 'DESC' : 'ASC';
    let sort = field && option ? `&sort=${field}:${sortOrder}&` : '';

    const pagin = page ? `&pagination[page]=${page}&pagination[pageSize]=${size}` : '';

    let GetApi = '';
    if (filter && filter !== '') {
      GetApi = `${apiUrl}${pagin}${sort}&${searchUrl}`;
    } else {
      GetApi = `${apiUrl}${pagin}${sort}`;
    }

    add ? (GetApi = `${GetApi}${add}`) : '';
    date ? (GetApi = `${GetApi}${this.StrapiFilterDate(date, 0, datefield)}`) : '';



    try {
      const apiResponse: any = await this.http.get(GetApi).toPromise();
      const data = apiResponse.data ? apiResponse.data : apiResponse;
      console.log('api response:', apiResponse, 'table:', table, 'data length (api)', data.length);
      if (apiResponse.data || apiResponse[0]?.id || apiResponse) {
        this.total = apiResponse.meta?.pagination?.total;
        const data = apiResponse.data ? apiResponse.data : apiResponse;
        await this.cacheDataInIndexedDB(cacheKey, data);
        return data;
      } else {
        throw new Error('Error in API response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  private applyClientSideFilter(data: any[], filter?: string, field1?: string, field2?: string): any[] {
    if (!filter) {
      return data;
    }
    return data.filter(item => {
      const fieldValue1 = field1 ? item[field1]?.toLowerCase() : '';
      const fieldValue2 = field2 ? item[field2]?.toLowerCase() : '';
      return fieldValue1.includes(filter.toLowerCase()) || fieldValue2.includes(filter.toLowerCase());
    });
  }

  async cacheDataInIndexedDB(key: string, data: any[]): Promise<void> {
    const db = await this.dbPromise;
    await db.put('data', { key, value: data });
  }

  
  async getDataFromIndexedDB(key: string): Promise<any[]> {
    console.log('getDataFromIndexedDB fn fi9li');
    const db = await this.dbPromise;
    const result = await db.get('data', key);
    return result ? result.value : [];
}


async cacheAllTables(): Promise<void> {
  // await this.clearDatabase();  // Clear the database before caching
  for (const table of this.tablesToCache) {
    try {
      // Fetch data from Strapi and cache it
      const data = await this.getFromStrapi(table);

      // Log the length of the cached data
      console.log(`Table ${table} cached successfully with ${data.length} entries.`);
      
      this.nbCashedtable += 1;
      console.log('Number of Tables cached successfully:', this.nbCashedtable);
    } catch (error) {
      console.error(`Failed to cache table ${table}:`, error);
    }
  }
}


//  async clearDatabase(): Promise<void> {
//   try {
//     const db = await this.dbPromise;
//     const tx = db.transaction(['data'], 'readwrite');
//     tx.objectStore('data').clear();
//     await tx.done;
//     console.log('Local Database (data) cleared successfully.');
//   } catch (error) {
//     console.error('Failed to clear database (data):', error);
//   }
// }





async postStrapi(table: string, data: any): Promise<any> {
  const url = `${this.apiUrl}${table}`;
  try {
      return await this.http.post<any>(url, data).toPromise();
  } catch (error) {
      if (!navigator.onLine) {
          await this.queueRequest('POST', table, undefined, data);
          console.log('No internet connection. Request queued.');
          this.offlineOperationsSubject.next(true);  // Notify about the offline operation
      } else {
          throw error;
      }
  }
}
// Ensure requests are added to both IndexedDB and in-memory storage
 async queueRequest(method: string, table: string, id?: number, data?: any): Promise<void> {
  try {
    const db = await this.dbPromise;
    //const key = `${method}-${table}-${id || ''}`;
    const key = `${method}-${table}-${id || ''}-${Date.now()}`;
    const request: OfflineRequest = { key, method, table, id, data };
    await db.put('requests', request);
    console.log('Request saved to IndexedDB:', request);
    this.queuedRequests.push(request);
    console.log('Request added to in-memory storage:', request);
  } catch (error) {
    console.error('Failed to queue the request:', error);
  }
}


// Method to get queued requests
getQueuedRequests(): OfflineRequest[] {
  console.log('queuedRequests !!!!!!!!!!!!!!!!!!!!!!!!',this.queuedRequests);
  return this.queuedRequests;
  
}


  //-------------------------------- Delete Strapi --------------------------------//
  async deleteById(table: string, id: number): Promise<any> {
    try {
      this.apiUrl = `${this.apiUrl}${table}/`
      const url = `${this.apiUrl}${id}`;
      return this.http.delete(url).toPromise();
    } catch (error) {
      if (!navigator.onLine) {
        this.offlineDeleteVisible=true;
        console.log('No internet connection.Strapi service fn');
      } else {
        throw error;
      }
    }
    console.log('pointage deleted successfuly');
    console.log('Strapi service delete fn');
  }

  //-------------------------------- Update Strapi --------------------------------//
  async updateById(table: string, id: number, updatedData: any): Promise<any> {
    this.apiUrl = 'https://rh.cegidretail.shop/api/';
    this.apiUrl = `${this.apiUrl}${table}/`;
    const url = `${this.apiUrl}${id}`;
    try {
      if (!navigator.onLine) {
        // Update local data
        await this.queueRequest('PUT', table, id, updatedData);
        console.log('No internet connection. Request queued and local data updated.');
        this.offlineOperationsSubject.next(true);  // Notify the observable
      } else {
        const response = await this.http.put<any>(url, updatedData).toPromise();
        return response;
      }
    } catch (error) {
      throw error;
    }
  }

  private async processOfflineRequests(): Promise<void> {
    console.log('Processing offline requests...');
    const db = await this.dbPromise;
    const allRequests: OfflineRequest[] = await db.getAll('requests');
  
    for (const request of allRequests) {
      try {
        const { method, table, id, data } = request;
        let url = `${this.apiUrl}${table}`;
        if (id) {
          url = `${url}/${id}`;
        }
  
        console.log(`Processing request: ${method} ${url}`, data);
  
        if (method === 'POST') {
          await this.http.post(url, data).toPromise();
          console.log(`POST request to ${url} succeeded.`);
        } else if (method === 'PUT') {
          console.log(`PUT request to ${url} with data:`, data);
          await this.http.put(url, data).toPromise();
          console.log(`PUT request to ${url} succeeded.`);
        } else if (method === 'DELETE') {
          console.log(`DELETE request to ${url}`);
          await this.http.delete(url).toPromise();
          console.log(`DELETE request to ${url} succeeded.`);
        }
  
        await db.delete('requests', request.key);
        console.log(`Request ${request.key} deleted from IndexedDB.`);
        this.refreshPage();
      } catch (error) {
        console.error('Failed to process request:', request, error);
      }
    }
    this.offlineOperationsSubject.next(false);
  }
  private refreshPage(): void {
    window.location.reload();  // This will fully reload the page
}


  private readonly apiCallKey = 'apiCallInProgress';
  setApiCallInProgress(inProgress: boolean): void {
    localStorage.setItem(this.apiCallKey, JSON.stringify(inProgress));
  }

  

  isApiCallInProgress(): boolean {
    return JSON.parse(localStorage.getItem(this.apiCallKey) || 'false');
  }

  formatDateToYYYYMMDD(date : any) { // takes a date object as input, modifies it by adding one day to it, and then returns the date in ISO string format.
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }

  
  StrapiFilterDate(date : any[] , count : any , datefield : string): string { //generates a query string for filtering dates in Strapi, a headless CMS. It handles both single dates and date ranges, converting them to the appropriate format and building the corresponding query parameters.
    let filter = '';
    if (Array.isArray(date)) {

      if (date.length === 2 && date[1] != null) {
        const startDate = this.formatDateToYYYYMMDD(date[0]);
        const endDate = this.formatDateToYYYYMMDD(date[1]);
        filter += `&filters[$and][${count}][${datefield}][$gte]=${startDate}` //$gte : Greater than or equal to (strapi)
        count += 1;
        filter += `&filters[$and][${count}][${datefield}][$lte]=${endDate}`;
      } else if (date.length === 2 && date[1] == null) {
        const formattedDate = this.formatDateToYYYYMMDD(date[0]);
        filter += `&filters[$and][${count}][${datefield}][$eq]=${formattedDate}`;
      } else {
        console.error('Invalid date range:', date);
      }
    } else {
      const formattedDate = this.formatDateToYYYYMMDD(date);
      filter += `&filters[$and][${count}][${datefield}][$eq]=${formattedDate}`;
    }
    console.log('filter is ' , filter);
    return filter
  }
clearApiCallState(): void {
  localStorage.removeItem(this.apiCallKey);
}


public async deleteRequestFromDB(requestKey: string): Promise<void> {
  try {
    const db = await this.dbPromise;
    await db.delete('requests', requestKey);
    console.log(`Request with key ${requestKey} deleted from IndexedDB`);
  } catch (error) {
    console.error('Failed to delete the request from IndexedDB:', error);
  }
}


}