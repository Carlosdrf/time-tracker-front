import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private http: HttpClient) { }

  charge(amount: number, tokenId: any){
    const body = {
      stripeToken: tokenId,
      cantidad: amount
    }
    const headers = new HttpHeaders({'content_type':'application/json'})
    return this.http.post<any>(environment.apiUrl+'/stripe/checkout', body, {headers})
  }
  webhook(data: any){
    const headers = new HttpHeaders({'content_type':'application/json'})
    return this.http.post<any>(environment.apiUrl + '/stripe/webhook', data, {headers})
  }
}
