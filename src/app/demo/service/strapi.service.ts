import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {

  private apiUrl = 'https://rh.cegidretail.shop/api/';
  total = 0 ;
  statuscode : any;
  constructor(private http: HttpClient ) { 
    
  }

  async getFromStrapi( table : string , page ?: number, size ?: number , field?: string , option? : any , filter ?: string , searshdata1? : string , searshdata2? : string ,date? : any  ,add ? : any , datefield? : any ): Promise<any[]> {
    this.statuscode = 0 //voir ekher comment
    this.apiUrl = 'https://rh.cegidretail.shop/api/';
    this.apiUrl = `${this.apiUrl}${table}?` //Sets the base URL for the API call and appends the table name to it.
    let searchUrl = `filters[$or][0][${searshdata1}][$containsi]=${filter}&`;
    searchUrl = searshdata2 ?  `${searchUrl}&filters[$or][1][${searshdata2}][$containsi]=${filter}`: searchUrl //Constructs the search URL for filtering based on searshdata1 and searshdata2
    const sortOrder = option === 1 ? 'DESC' : 'ASC' ; 
    let sort = field && option ? `&sort=${field}:${sortOrder}&` :  ''
    // if (table === 'ventes' &&  !field ) {
    //     sort = `sort=gl_numero:DESC&`
    // }
    const pagin = page ? `&pagination[page]=${page}&pagination[pageSize]=${size}` : ''; //Pagination: Constructs the pagination query string based on page and size
    let GetApi = ''
    if(filter && filter != ''){
       GetApi = `${this.apiUrl}${pagin}${sort}&${searchUrl}`
    }else{
       GetApi = `${this.apiUrl}${pagin}${sort}`
    }
    add ? GetApi = `${GetApi}${add}` : '';// Appends any additional query parameters and date filters to the API URL.
    date ?  GetApi = `${GetApi}${this.StrapiFilterDate(date, 0 , datefield)}` : '' ; // Appends any additional query parameters and date filters to the API URL.
    try {
      const apiResponse: any = await this.http.get(GetApi).toPromise();// Makes the API call using http.get and logs the response.
      console.log('API Response:', apiResponse);
    
      // Check for errors in the response
      if (apiResponse.data || apiResponse[0].id || apiResponse) {
        this.total = apiResponse.meta?.pagination?.total;
        return apiResponse.data ? apiResponse.data :apiResponse; //Checks if the response contains data or an ID. If valid, it updates total and returns the data.
      } else {
        // Handle error response
        console.error('Error in API response:', apiResponse);
    
        // Check for status code in case of an error
        if (apiResponse && apiResponse.status) {
          // Assuming the error message is in the response body
          const errorMessage = apiResponse.error?.message || 'Une erreur s\'est produite lors de la récupération des données.';
          
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Erreur de récupération',
          //   detail: errorMessage,
          // });
        }
    
        throw new Error('Error in API response');
      }
    } catch (error) {
      // Handle error and display an error message
      console.error('Error fetching clients:', error);
    
      let errorMessage = 'Une erreur s\'est produite lors de la récupération des données.';
      
    
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Erreur de récupération',
      //   detail: errorMessage,
      // });
    
      throw error;
    }
    //1. Basic URL with Pagination : table: 'users' page: 1 size: 10 Resulting URL: https://rh.cegidretail.shop/api/users?&pagination[page]=1&pagination[pageSize]=10
    //2. URL with Pagination and Sorting : https://rh.cegidretail.shop/api/users?&pagination[page]=1&pagination[pageSize]=10&sort=createdAt:DESC&
    //3 URL with Pagination, Sorting, and Filtering : https://rh.cegidretail.shop/api/users?&pagination[page]=1&pagination[pageSize]=10&sort=createdAt:DESC&&filters[$or][0][username][$containsi]=John&&filters[$or][1][email][$containsi]=John
    // 4. URL with Additional Custom Query Parameters : https://rh.cegidretail.shop/api/users?&pagination[page]=1&pagination[pageSize]=10&populate=profile
    //5. URL with Date Filtering : https://rh.cegidretail.shop/api/users?&pagination[page]=1&pagination[pageSize]=10&filters[$and][0][createdAt][$gte]=2023-01-01T00:00:00.000Z&filters[$and][1][createdAt][$lte]=2023-12-31T00:00:00.000Z
    //6. Full Example with All Parameters : https://rh.cegidretail.shop/api/users?&pagination[page]=1&pagination[pageSize]=10&sort=createdAt:DESC&&filters[$or][0][username][$containsi]=John&&filters[$or][1][email][$containsi]=John&populate=profile&filters[$and][0][createdAt][$gte]=2023-01-01T00:00:00.000Z&filters[$and][1][createdAt][$lte]=2023-12-31T00:00:00.000Z
  }  

  // ----------------------------- Date configuration ------------------------------- //
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

  //-------------------------------- Post Strapi --------------------------------//
  async postStrapi(table: string, classe: any): Promise<any> {
    this.apiUrl = 'https://rh.cegidretail.shop/api/';
    this.apiUrl = `${this.apiUrl}${table}`;
    try {
       await this.http.post<any>(this.apiUrl, classe).toPromise().then(
        response=>{
          if(response.status === 200 || response.status === 201 || response)
          {console.log(response)
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Validation réussie',
          //   detail: '',
          // });
          return response;}
          else{
            
        throw response;
          }
        }
       
      ).catch(error=>{
        console.error('Error in API call:', error.error.non_existant_article);
        let errorMessage = 'Une erreur s\'est produite lors de la validation.';
        console.log('le erueer est ',error)
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        console.log('no existant ', error.non_existant_article)
            console.log('no  5  ', error.error.non_existant_article)
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Erreur de validation'  ,
        //   detail: error.error.error +"  :" +  error.error.non_existant_article ,
        // });
        throw error;
      });
      // Check if the API response contains a success message
      
       
    } catch (error) {
      console.error('Error in API call:', error);
      
    }
  }
  private readonly apiCallKey = 'apiCallInProgress';
  setApiCallInProgress(inProgress: boolean): void {
    localStorage.setItem(this.apiCallKey, JSON.stringify(inProgress));
  }

  isApiCallInProgress(): boolean {
    return JSON.parse(localStorage.getItem(this.apiCallKey) || 'false');
  }

  clearApiCallState(): void {
    localStorage.removeItem(this.apiCallKey);
  }
  
  //-------------------------------- Delete Strapi --------------------------------//
  deleteById(table :any , id: number): Promise<any> {
    this.apiUrl = 'https://rh.cegidretail.shop/api/';
    this.apiUrl = `${this.apiUrl}${table}/`
    const url = `${this.apiUrl}${id}`;
    return this.http.delete(url).toPromise();
  }
   //-------------------------------- Update Strapi --------------------------------//
  async updateById(table : any ,id: number, updatedclasse : any): Promise<any> {
    this.apiUrl = 'https://rh.cegidretail.shop/api/';
    this.apiUrl = `${this.apiUrl}${table}/`
    const url = `${this.apiUrl}${id}`;
    try {
      const response = await this.http.put<any>(url, updatedclasse).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
