import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://rh.cegidretail.shop/api/auth/local';
  private refreshUrl = 'https://rh.cegidretail.shop/api/token/refresh';

  private loginUrl = 'https://rh.cegidretail.shop/api/auth/local';
  constructor(private http: HttpClient, private cookieService: CookieService) {}
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { identifier: email, password: password }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.jwt) {
            localStorage.setItem('token', response.jwt)
            localStorage.setItem('refreshToken', response.refreshToken)
          }
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken'); 
    return this.http.post<any>(this.refreshUrl, { refreshToken : refreshToken }, { withCredentials: true });
  }
}
