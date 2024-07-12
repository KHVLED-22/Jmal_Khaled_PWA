import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttributCouleur, ValCouleur } from '../api/couleur';
import { environment } from 'src/environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class CouleurService {

  constructor(private http: HttpClient) { }

  private mapToCouleur(item: any): ValCouleur {
    return {
        id: item.id,
        valeur: item.attributes.valeur,
        designation: item.attributes?.designation,
        code_hexa:item?.attributes?.code_hexa,

        attribut:
         {
           id:item.attributes.attribut?.data?.id,
           nom:item.attributes.attribut?.data?.attributes?.nom,
           designation:item.attributes.attribut?.data?.attributes?.designation,
           visible:item.attributes.attribut?.data?.attributes?.visible,

        },

    };
  }

  getCouleurs(data?:string,pageSize?: any,currentPage?: any,sortFiled?:any,sortMode?:any) {
    let url = `${environment.url}/attribut-values?populate=attribut&filters[attribut][id][$eq]=1`;
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
        url += `&filters[valeur][$containsi]=${data}`;
      }
    return this.http
        .get<any>(url,{params})
        .toPromise()
        .then((res) =>
    {
        // console.log(res)
        return  {
            // attribut:res.data.map((item: any) => this.mapToCouleur(item)),
            attribut:res.data.map((item: any) => this.mapToCouleur(item)),

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

postCouleur(couleur: ValCouleur) {
    let url = `${environment.url}/attribut-values?populate=attribut`;
    let body={data:couleur}
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
            console.log('Error object:', error);
            if (error && error.error && error.error.details && error.error.details.errors && error.error.details.errors.length > 0) {
                // Extract error messages and paths
                const validationErrors = error.error.details.errors.map((err: any) => {
                    return {
                        message: err.message,
                        path: err.path ? err.path.join('.') : ''
                    };
                });
                // Throw the extracted validation errors
                throw validationErrors;
            } else {
                console.error('Error creating Valeur Couleur:', error);
                throw error;
            }
        });


}

UpdateCouleur(couleur: ValCouleur,id:any) {
    let url = `${environment.url}/attribut-values/${id}?populate=attribut`;
    let body={data:couleur}
    return this.http
        .put<any>(url,body)
        .toPromise()
        .then((res) =>{
            return this.mapToCouleur(res.data);

              })
          .then((data) => data)
          .catch((error) => {
            console.error('Error updating valeur couleur:', error);
            throw error;
          });
}

DeleteCouleur(id:any) {
    let url = `${environment.url}/attribut-values/${id}?populate=attribut`;
    return this.http
    .delete<any>(url)
    .toPromise()
    .then((res) => this.mapToCouleur(res.data ))
    .then((data) => data)
    .catch((error) => {
            console.error('Error deleting valeur couleur:', error);
            throw error;
          });
}

}
