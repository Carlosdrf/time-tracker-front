import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ReportsService {
  API_URI = environment.apiUrl
  constructor(public http:HttpClient) { }

  getReport(data: any, user_id: any = ''){
    const headers = new HttpHeaders({'content-type': 'application/json'})
    const info = this.toBeSent(data, user_id)
    return this.http.post(`${this.API_URI}/reports`, info, {headers, responseType: 'blob'})
  }

  getRange(data: any, user: any = null){
    const headers = new HttpHeaders({'content-type': 'application/json'})
    const info = this.toBeSent(data, user)
    return this.http.post(`${this.API_URI}/reports/entries`, info, {headers})
  }
  toBeSent(data: any, user: any){
    let info
    if(!user){
      info = ({
        firstSelect: data.firstSelect,
        lastSelect: data.lastSelect,
        timezone: new Date().getTimezoneOffset()
      })
    }else{
      info = ({
        firstSelect: data.firstSelect,
        lastSelect: data.lastSelect,
        user_id: user.id,
        role: user.role,
        timezone: new Date().getTimezoneOffset()
      })
    }
    return info;
  }
}
