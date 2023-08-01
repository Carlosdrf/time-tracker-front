import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLogged = new BehaviorSubject<boolean>(false);
  private isAdmin = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<string>('2')
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private routes: Router
  ) {}
  API_URI = environment.apiUrl + '/auth';

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const body = JSON.stringify({ email, password });
    return this.http.post<any>(`${this.API_URI}/signin`, body, { headers });
  }
  signup(newUser: any): Observable<any> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    // const body = JSON.stringify({email, password});
    return this.http.post<any>(`${this.API_URI}/signup`, newUser, { headers });
  }
  logout() {
    localStorage.clear();
    this.isLogged.next(false);
  }

  isLoggedIn() {
    const jwt = localStorage.getItem('jwt');
    try {
      if (jwt !== null && !this.jwtHelper.isTokenExpired(jwt)) {
        this.isLogged.next(true);
        return this.isLogged.asObservable();
      } else {
        this.isLogged.next(false);
        // console.log(this.jwtHelper.isTokenExpired(jwt))
        return this.isLogged.asObservable();
      }
    } catch (error) {
      this.isLogged.next(false);
      return this.isLogged.asObservable();
    }
  }
  getUserType() {
    if (localStorage.getItem('role') !== null) {
      this.role.next(localStorage.getItem('role')!.toString())
      return this.role.asObservable();
    }else{
      this.role.next('2')
      return this.role.asObservable();
    }
  }
  verifyAdmin() {
    const role = localStorage.getItem('role');
    if (role !== null && role === '1') {
      this.isAdmin.next(true);
      return this.isAdmin.asObservable();
    } else {
      this.isAdmin.next(false);
      return this.isAdmin.asObservable();
    }
  }
  userTypeRouting(rol: string) {
    console.log(rol);
    if (rol == '1') {
      this.routes.navigate(['admin/dashboard']);
      return;
    } else if (rol == '2') {
      this.routes.navigate(['dashboard']);
      return;
    } else if (rol == '3') {
      this.routes.navigate(['client']);
      return;
    }
  }
  geTokenAccess() {}
  refreshToken() {}
  setAccessToken() {}
}
