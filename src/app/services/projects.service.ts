import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Projects } from '../models/Project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) {}
  API_URI: string = `${environment.apiUrl}/projects`;

  public get(): Observable<Projects[]> {
    return this.http.get<Projects[]>(`${this.API_URI}`);
  }

  public submit(data: any, id: any = null) {
    if (id) return this.http.put(`${this.API_URI}/${id}`, data);
    return this.http.post(`${this.API_URI}`, data);
  }

  public delete(id: number) {
    return this.http.delete(`${this.API_URI}/${id}`);
  }
}
