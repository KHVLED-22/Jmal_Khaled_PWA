import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {

  private apiUrl = 'http://localhost:5000/api'; 

  constructor(private http: HttpClient) { }

 
 async getRestaurants(): Promise<any> {
    return await this.http.get(`${this.apiUrl}/tab1s`).toPromise();
  }
  // getRestaurant(id : number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/tab1s/${id}`);
  // }
  // deleteRestaurant(id:number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/tab1s/${id}`);
  // }
  // setRestaurant(name: string, stars: number, chef: string): Observable<any> {
  //   const restaurant = { name, stars, chef };
  //   return this.http.post(`${this.apiUrl}/tab1s`, restaurant);
  // }
  // updateRestaurant(id: number,name: string, stars: number, chef: string): Observable<any> {
  //   const restaurant = { name, stars, chef };
  //   return this.http.put(`${this.apiUrl}/tab1s/${id}`, restaurant);
  // }
}  
