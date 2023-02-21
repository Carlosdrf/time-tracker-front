import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    const jwt = localStorage.getItem('jwt');
    if(jwt){
      request = request.clone({
        setHeaders: {
          Authorization: `bearer ${jwt}`
        }
      })
    }
    return next.handle(request);
  }

  constructor() { }

}


