import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Positions } from '../models/Position.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  constructor(private http: HttpClient) { }
  private API_URI = environment.apiUrl

  public get(): Observable<Positions[]>{
    return this.http.get<Positions[]>(`${this.API_URI}/positions`)
  }
}
