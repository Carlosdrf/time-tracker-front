import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Company } from '../models/User.model';
import { Observable } from 'rxjs/internal/Observable';
import { PossibleClient } from '../models/Client';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  constructor(private http: HttpClient) {}
  API_URI = environment.apiUrl + '/companies';

  public getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.API_URI);
  }

  public submit(data: any, id: any = null) {
    if (id) return this.http.put(`${this.API_URI}/${id}`, data);
    return this.http.post(`${this.API_URI}`, data);
  }

  public delete(id: number) {
    return this.http.delete(`${this.API_URI}/${id}`);
  }

  public getEmployees(company_id: string) {
    return this.http.get(`${this.API_URI}/${company_id}/employees`);
  }

  public createPossible(body: PossibleClient) {
    return this.http.post(`${this.API_URI}/create/possible`, body);
  }
}
