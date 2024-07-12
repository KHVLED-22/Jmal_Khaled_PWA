import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environnement/environnement';
import { variation } from '../api/article';

@Injectable({
  providedIn: 'root'
})
export class VariationService {

    constructor(private http: HttpClient) { }



  UpdateVariation(vaiation: any,id:any) {
    let url = `${environment.url}/variations/${id}`;
    let body={data:vaiation}
    return this.http
        .put<any>(url,body)
        .toPromise()
        .then((res) =>{
            // return this.mapToCouleur(res.data);
           return res
            console.log(res)
              })
          .then((data) => data)
          .catch((error) => {
            console.error('Error updating variation:', error);
            throw error;
          });
}


updateCouleurImages(images:any,id:any){
    let url = `${environment.url}/couleur-images/${id}`;
    let body={data:images}

    return this.http
        .put<any>(url,body)
        .toPromise()
        .then((res) =>{
            // return this.mapToCouleur(res.data);
           return res
            console.log(res)
              })
          .then((data) => data)
          .catch((error) => {
            console.error('Error updating couleur image:', error);
            throw error;
          });
}
}
