import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entries } from '../models/Entries';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtInterceptor } from './jwt.interceptor';

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getEntries() {
    return this.http.get<any>(`${this.API_URI}/entries`);
  }
  getAllEntries(data: any) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    return this.http.post<any>(`${this.API_URI}/entries/all`, data, {
      headers,
    });
  }
  updateEntryTask(id: string, data: any) {
    return this.http.put<any>(`${this.API_URI}/entries/task/${id}`, data);
  }
  getUsers(body: any) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });

    return this.http.post<any>(`${this.API_URI}/users`, body, { headers });
  }
  getUsersEntries(user_id: any) {
    return this.http.post<any>(`${this.API_URI}/entries/user`, user_id);
  }

  getEntryCheck() {
    return this.http.get(`${this.API_URI}/entries/started`);
  }

  getUserEntryStatus(data: any) {
    return this.http.post(`${this.API_URI}/entries/users/status`, data);
  }
  createEntry(entry: any) {
    const jwt = localStorage.getItem('jwt');
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    return this.http.post(`${this.API_URI}/entries`, entry);
  }
  deleteEntry(id: number) {
    return this.http.delete(`${this.API_URI}/entries/${id}`);
  }
  closeCurrentEntry(entryId: number) {
    return this.http.get(`${this.API_URI}/entries/closeEntry/${entryId}`);
  }
  updateEntry(id: number, updatedEntry: Entries): Observable<Entries> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    // const body = JSON.stringify({hour_init});
    // console.log(updatedEntry)
    return this.http.put<Entries>(
      `${this.API_URI}/entries/${id}`,
      updatedEntry,
      { headers }
    );
  }
  getRoles() {
    return this.http.get(`${this.API_URI}/roles`);
  }
  createUser(userData: any) {
    return this.http.post(`${this.API_URI}/users/create`, userData);
  }
  // getCurrentEntry(data: any){
  //   return this.http.post(`${this.API_URI}/entries/currentEntry`, data)
  // }
}
