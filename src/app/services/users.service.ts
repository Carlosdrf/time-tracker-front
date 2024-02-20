import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  private API_URI = environment.apiUrl;

  getUsers(body: any) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });

    return this.http.post<any>(`${this.API_URI}/users`, body, { headers });
  }
  createUser(userData: any) {
    return this.http.post(`${this.API_URI}/users/create`, userData);
  }
  public update(user: any){
    return this.http.put(`${this.API_URI}/users/${user.id}`, user)
  }
  public delete(id: string) {
    return this.http.delete(`${this.API_URI}/users/${id}`)
  }
  public verifyUsername(email: any, userId: string) {
    const body = {
      email,
      userId,
    };
    return this.http.post(`${this.API_URI}/users/verifyusername`, body);
  }

  getRoles() {
    return this.http.get(`${this.API_URI}/roles`);
  }
  fetchTimezonesApi() {
    return this.http.get(`${this.API_URI}/timezones`);
  }
}
