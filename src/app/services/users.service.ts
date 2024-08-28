import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PossibleMember } from '../models/Client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}
  selectedUser: any = { id: null, name: '' };
  private API_URI = environment.apiUrl;

  getUsers(body: any) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    return this.http.post<any>(`${this.API_URI}/users`, body, { headers });
  }
  createUser(userData: any) {
    return this.http.post(`${this.API_URI}/users/create`, userData);
  }
  public update(user: any) {
    return this.http.put(`${this.API_URI}/users/${user.id}`, user);
  }
  public delete(id: string) {
    return this.http.delete(`${this.API_URI}/users/${id}`);
  }
  public verifyUsername(email: any, userId: string) {
    const body = {
      email,
      userId,
    };
    return this.http.post(`${this.API_URI}/users/verifyusername`, body);
  }
  getEmployees() {
    return this.http.get(environment.apiUrl + '/users/employees');
  }
  getRoles() {
    return this.http.get(`${this.API_URI}/roles`);
  }

  createPossible(body: PossibleMember) {
    let form = new FormData();
    form.append('name', body.name);
    form.append('lastname', body.lastname);
    form.append('email', body.email);
    form.append('phone', body.phone);
    form.append('englishLevel', body.englishLevel);
    form.append('resume', body.resume);
    return this.http.post(`${this.API_URI}/users/create/possible`, form);
  }
  setUserInformation(user: any) {
    this.selectedUser = user;
  }
  getSelectedUser() {
    return this.selectedUser;
  }
  resetUser() {
    this.selectedUser = { id: null, name: null };
  }
}
