import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLogged = new BehaviorSubject<boolean>(false)
  constructor(private http:HttpClient) { }
  API_URI = 'http://localhost:3000/api/auth';

  login(email: string, password: string): Observable<any>{
    const headers = new HttpHeaders({ 'content-type': 'application/json'});
    const body = JSON.stringify({email, password});
    return this.http.post<any>(`${this.API_URI}/signin`, body, {headers})
  }
  signup(newUser: any): Observable<any>{
    const headers = new HttpHeaders({ 'content-type': 'application/json'});
    // const body = JSON.stringify({email, password});
    return this.http.post<any>(`${this.API_URI}/signup`, newUser, {headers})
  }
  logout(){
    localStorage.clear()
    this.isLogged.next(false)
  }

  isLoggedIn(){
    const jwt = localStorage.getItem('jwt')
    if(jwt !== null){
      this.isLogged.next(true)
      return this.isLogged.asObservable()
    }else{
      this.isLogged.next(false)
      return this.isLogged.asObservable()
    }
  }
}
