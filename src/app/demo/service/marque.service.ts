import { Marque } from './../api/marque';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  constructor(private http: HttpClient) { }

  private mapToMarque(item: any): Marque {

        return {
            id: item.id,
            nom: item.attributes.nom,
            designation: item.attributes.designation,
            logo: {
              id: item.attributes?.logo?.data?.id,
              name: item.attributes?.logo?.data?.attributes?.formats?.thumbnail?.url
                ? "http://192.168.0.245" + item.attributes?.logo.data?.attributes?.formats?.thumbnail?.url
                : ""
            },
            activer:item.attributes.activer,
            nbArticles:item.attributes.nbArticle,

          };
    // }

  }

  getMarques(data?:string,pageSize?: any,currentPage?: any,sortFiled?:any,sortMode?:any) {
    let url = `${environment.url}/marques?populate=logo`;
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
            marques:res.data.map((item: any) => this.mapToMarque(item)),
            pagination: {
                total: res.meta.pagination.total,
                perPage: res.meta.pagination.pageSize,
                currentPage: res.meta.pagination.pageCount,
              }
         };
    })
        .then((data) => data)
        .catch((error) => {
            console.error('Error fetching marques :', error);
            throw error;
          });
}

DeleteMarque(id:any) {
    let url = `${environment.url}/marques/${id}`;
    return this.http
    .delete<any>(url)
    .toPromise()
    .then((res) => this.mapToMarque(res.data ))
    .then((data) => data)
    .catch((error) => {
            console.error('Error deleting marques:', error);
            throw error;
          });
}


postMarque(marque: Marque) {
    let url = `${environment.url}/marques?populate=logo`;
    let body={data:marque}
    return this.http
        .post<any>(url,body)
        .toPromise()
        .then((res) =>{
            if(res.message){
                return res
            }
            else{
                return this.mapToMarque(res.data);

            }

              })
          .then((data) => data)
          .catch((error) => {
            console.error('Error creating marque:', error);
            throw error;
          });
}

UpdateMarque(marque: Marque,id:any) {
    let url = `${environment.url}/marques/${id}?populate=logo`;
    let body={data:marque}
    return this.http
        .put<any>(url,body)
        .toPromise()
        .then((res) =>{
            return this.mapToMarque(res.data);

              })
          .then((data) => data)
          .catch((error) => {
            console.error('Error updating marque:', error);
            throw error;
          });
}

// getSearchedMarques(data?:string,pageSize?: any,currentPage?: any,sortFiled?:any,sortMode?:any) {
//     let url = `${environment.url}/marques?populate=logo`;
//     let params = new HttpParams();

//     if (pageSize && currentPage) {
//         params = params
//           .set('pagination[pageSize]', pageSize)
//           .set('pagination[page]', currentPage);
//       }
//       if (sortMode=== 1 && sortFiled) {
//         url += `&sort=${sortFiled}:DESC`;
//       } else if (sortMode=== -1 && sortFiled) {
//         url += `&sort=${sortFiled}:ASC`;
//       }
//       if(data){
//         url += `&filters[nom][$containsi]=${data}`;
//       }
//     return this.http
//         .get<any>(url,{params})
//         .toPromise()
//         .then((res) =>
//     {
//         return  {
//             marques:res.data.map((item: any) => this.mapToMarque(item)),
//             pagination: {
//                 total: res.meta.pagination.total,
//                 perPage: res.meta.pagination.pageSize,
//                 currentPage: res.meta.pagination.pageCount,
//               }
//          };
//     })
//         .then((data) => data)
//         .catch((error) => {
//             console.error('Error fetching marques :', error);
//             throw error;
//           });
// }


}
