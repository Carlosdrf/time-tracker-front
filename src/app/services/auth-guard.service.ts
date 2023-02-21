import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  loggedIn: boolean = true

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    this.authService.isLoggedIn().subscribe(isLogged =>{
      this.loggedIn = isLogged
    })
    
    if(this.loggedIn){
      return true;
    }else{
      this.router.navigate(['/login'])
      return false
    }
  }
  

}

