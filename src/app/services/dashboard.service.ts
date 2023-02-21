import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Entries } from "../models/Entries";
import { Observable } from 'rxjs';
import { JwtInterceptor } from './jwt.interceptor';

@Injectable({
  providedIn: 'root',
  
})

export class DashboardService {
  API_URI = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }
  getEntries(){
    return this.http.get(`${this.API_URI}/entries`)
  }

  getEntryCheck(){
    return this.http.get(`${this.API_URI}/entries/started`)
  }
  createEntry(entry: Entries){
    const jwt = localStorage.getItem('jwt')
    const headers = new HttpHeaders({'content-type': 'application/json'})
    return this.http.post(`${this.API_URI}/entries`, entry)
  }
  deleteEntry(id: number){
    return this.http.delete(`${this.API_URI}/entries/${id}`)
  }
  closeCurrentEntry(entryId: number){
    return this.http.get(`${this.API_URI}/entries/closeEntry/${entryId}`);
  }
  updateEntry(id: number, updatedEntry: Entries):Observable<Entries>{
    const headers = new HttpHeaders({ 'content-type': 'application/json'});
    // const body = JSON.stringify({hour_init});
    // console.log(updatedEntry)
    return this.http.put<Entries>(`${this.API_URI}/entries/${id}`, updatedEntry, {headers});
  }

}
