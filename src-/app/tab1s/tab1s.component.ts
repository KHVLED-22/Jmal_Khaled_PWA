import { Component, OnInit } from '@angular/core';
import { StrapiService } from '../strapi.service';

@Component({
  selector: 'app-tab1s',
  templateUrl: './tab1s.component.html',
  styleUrls: ['./tab1s.component.scss']
})
export class Tab1sComponent implements OnInit {
  restaurants: any[] = [];

  constructor(private strapiService: StrapiService) { }

  ngOnInit(): void {
    this.fetchRestaurants();
  }

  async fetchRestaurants() {
   await this.strapiService.getRestaurants().then(
      (res: any) => {
        this.restaurants = res.data;
      },
      error => {
        console.error('Error fetching restaurants', error);
      }
    );
  }

  // fetchRestaurant(id: number): void {
  //   this.strapiService.getRestaurant(id).subscribe(
  //     (data: any) => {
  //       this.restaurants = data; 
  //     },
  //     error => {
  //       console.error('Error fetching restaurant', error);
  //       // Handle error as needed
  //     }
  //   );
  // }

  // modifyRestaurant(id: number, name: string, stars: number, chef: string): void {
  //   this.strapiService.updateRestaurant(id, name, stars, chef).subscribe(
  //     (data: any) => {
  //       console.log('Restaurant updated successfully', data);
  //     },
  //     error => {
  //       console.error('Error updating restaurant', error);
  //     }
  //   );
  // }

  // createRestaurant(id: number, name: string, stars: number, chef: string): void {
  //   this.strapiService.updateRestaurant(id, name, stars, chef).subscribe(
  //     (data: any) => {
  //       console.log('Restaurant created successfully', data);
  //     },
  //     error => {
  //       console.error('Error creating restaurant', error);
  //     }
  //   );
  // }

  // supprimerRestaurant(id: number): void {
  //   this.strapiService.deleteRestaurant(id).subscribe(
  //     () => {
  //       console.log('Restaurant deleted successfully');
  //       this.fetchRestaurants();
  //     },
  //     error => {
  //       console.error('Error deleting restaurant', error);
  //     }
  //   );
  // }
}
