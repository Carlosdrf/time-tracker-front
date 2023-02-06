import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Entries} from "../models/Entries";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  API_URI = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }
  getEntries(){
    return this.http.get(`${this.API_URI}/entries`)
  }

  // getEntry(id: string){
  //   return this.http.get(`${this.API_URI}/entries/${id}`)
  // }
  createEntry(entry: Entries){
    return this.http.post(`${this.API_URI}/entries`, entry)
  }
  deleteEntry(id: string){
    return this.http.delete(`${this.API_URI}/entries/${id}`)
  }
  updateEntry(id: string, updatedEntry: Entries): Observable<Entries>{
    return this.http.put(`${this.API_URI}/entries/${id}`, updatedEntry);
  }

}
