import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  API_URI = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get<any>(`${this.API_URI}`);
  }

  public submit(data: any, id: any = null) {
    if (id) return this.http.put(`${this.API_URI}/${id}`, data);
    return this.http.post(`${this.API_URI}`, data);
  }
}
