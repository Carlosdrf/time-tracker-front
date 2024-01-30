import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ReportsService {
  API_URI = environment.apiUrl
  userSelection: any = null
  constructor(public http:HttpClient) { }

  setUserInformation(user: any){
    console.log(user)
    localStorage.setItem('userid', user.id)
    localStorage.setItem('user_name', user.name)
    this.userSelection = user
  }
  getSelectedUser(){

    return this.userSelection
  }
  resetUser(){
    localStorage.removeItem('userid')
    localStorage.removeItem('user_name')
    this.userSelection = null
  }
  getReport(data: any, user_id: any = ''){
    const headers = new HttpHeaders({'content-type': 'application/json'})
    const info = this.toBeSent(data, user_id)
    return this.http.post(`${this.API_URI}/reports`, info, {headers, responseType: 'blob'})
  }

  getRange(data: any, user_id: any= ''){
    const headers = new HttpHeaders({'content-type': 'application/json'})
    const info = this.toBeSent(data, user_id)
    return this.http.post(`${this.API_URI}/reports/entries`, info, {headers})
  }
  toBeSent(data: any, user_id: any){
    let info
    if(user_id == ''){
      info = ({
        firstSelect: data.firstSelect,
        lastSelect: data.lastSelect,
        timezone: new Date().getTimezoneOffset()
      })
    }else{
      info = ({
        firstSelect: data.firstSelect,
        lastSelect: data.lastSelect,
        user_id: user_id,
        timezone: new Date().getTimezoneOffset()
      })
    }
    return info;
  }
}
