import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environnement/environnement';
import { Attribut } from '../api/attribut';

@Injectable({
  providedIn: 'root'
})
export class AttributService {

  constructor(private http: HttpClient) { }

  private mapToAttribut(item: any): Attribut {
    return {
      id: item.id,
      nom: item.attributes.nom,
      designation: item.attributes?.designation,
      attribut_values:item.attributes.attribut_values?.data?.map((val:any)=>
       ( {
         id:val?.id,
         valeur:val?.attributes?.valeur,
         designation:val?.attributes?.designation,
      })),
      visible:item?.attributes?.visible,

    };
  }
  private mapToAttributUpdated(item: any): Attribut {
    return {
        id: item.id,
        nom: item.nom,
        visible: item.visible,
        attribut_values: item.attribut_values.map((val: any) => {
            return {
                id: val.id,
                valeur: val.valeur,
                designation: val.designation,
                code_hexa: val.code_hexa,
                createdAt: val.createdAt,
                updatedAt: val.updatedAt
            };
        })
    };
  }

  getAttributs(data?:any,pageSize?: any,currentPage?: any,sortFiled?:any,sortMode?:any) {
    let url = `${environment.url}/attributs?populate=attribut_values`;
    let params = new HttpParams();

    if (pageSize && currentPage) {
        params = params
          .set('pagination[pageSize]', pageSize)
          .set('pagination[page]', currentPage);
      }
      if (sortMode=== 1 && sortFiled) {
        url += `&sort=${sortFiled}:DESC`;
      } else if (sortMode=== -1 && sortFiled) {
        url += `&sort=${sortFiled}:ASC`;
      }

      if(data){
        url += `&filters[nom][$containsi]=${data}`;
      }
    return this.http
        .get<any>(url,{params})
        .toPromise()
        .then((res) =>
    {
        // console.log(res)
        return  {
            attribut:res.data.map((item: any) => this.mapToAttribut(item)),
            pagination: {
                total: res.meta.pagination.total,
                perPage: res.meta.pagination.pageSize,
                currentPage: res.meta.pagination.pageCount,
              }
         };
    })
        .then((data) => data)
        .catch((error) => {
            console.error('Error fetching attribut :', error);
            throw error;
          });
}


DeleteAttribut(id:any) {
    let url = `${environment.url}/attributs/${id}`;
    return this.http
    .delete<any>(url)
    .toPromise()
    .then((res) => this.mapToAttribut(res.data ))
    .then((data) => data)
    .catch((error) => {
            console.error('Error deleting attribut:', error);
            throw error;
          });
}

getSearchedAttribut(data?:string,pageSize?: any,currentPage?: any,sortFiled?:any,sortMode?:any) {
    let url = `${environment.url}/attributs?populate=attribut_values`;
    let params = new HttpParams();

    if (pageSize && currentPage) {
        params = params
          .set('pagination[pageSize]', pageSize)
          .set('pagination[page]', currentPage);
      }
      if (sortMode=== 1 && sortFiled) {
        url += `&sort=${sortFiled}:DESC`;
      } else if (sortMode=== -1 && sortFiled) {
        url += `&sort=${sortFiled}:ASC`;
      }
      if(data){
        url += `&filters[nom][$containsi]=${data}`;
      }
    return this.http
        .get<any>(url,{params})
        .toPromise()
        .then((res) =>
    {
        return  {
            attribut:res.data.map((item: any) => this.mapToAttribut(item)),
            pagination: {
                total: res.meta.pagination.total,
                perPage: res.meta.pagination.pageSize,
                currentPage: res.meta.pagination.pageCount,
              }
         };
    })
        .then((data) => data)
        .catch((error) => {
            console.error('Error fetching attribut :', error);
            throw error;
          });
}


UpdateAttribut(attribut: Attribut,id:any) {
    let url = `${environment.url}/attributs/${id}?populate=attribut_values`;
    let body={data:attribut}
    return this.http
        .put<any>(url,body)
        .toPromise()
        .then((res) =>{
            return this.mapToAttributUpdated(res.existingAttribut);

              })
          .then((data) => data)
          .catch((error) => {
            console.error('Error updating attribut:', error);
            throw error;
          });
}

postAttribut(attribut: any) {
    let url = `${environment.url}/attributs?populate=attribut_values`;
    let body={data:attribut}
    return this.http
        .post<any>(url,body)
        .toPromise()
        .then((res) =>{
            if(res){
                return res

            }
                else {
                throw new Error('Invalid response data format');
              }})
          .then((data) => data)
          .catch((error) => {
            console.error('Error creating Attribut:', error);
            throw error;
          });
}

}
