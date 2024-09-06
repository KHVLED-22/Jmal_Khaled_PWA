import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalDatabaseService {

  private apiUrl = 'http://localhost:5432';  // Adjust with your local PostgreSQL settings

  constructor(private http: HttpClient) { }

  async getDataFromLocalTable(tableName: string): Promise<any[]> {
    const url = `${this.apiUrl}/${tableName}`;
    try {
      const response = await this.http.get<any[]>(url).toPromise();
      return response || []; // Return an empty array if response is undefined
    } catch (error) {
      console.error('Error fetching data from local database:', error);
      throw error;
    }
  }

  // Implement other CRUD operations as needed
}
