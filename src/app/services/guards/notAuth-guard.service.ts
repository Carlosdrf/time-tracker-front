import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class notAuthGuard implements CanActivate{
  loggedIn: boolean= true
  isAdmin!: boolean

    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      this.authService.isLoggedIn().subscribe(isLogged =>{
        this.loggedIn = isLogged
      })
      this.authService.verifyAdmin().subscribe(isAdmin =>{
        this.isAdmin = isAdmin
      })
      // console.log(this.isAdmin)
      // console.log(this.loggedIn)
      if(this.loggedIn == true && this.isAdmin == false){
        this.router.navigate(['dashboard'])
        return false;
      }else if(this.loggedIn == true && this.isAdmin == true){
        this.router.navigate(['admin/dashboard'])
        return false
      }else{
        return true
      }
    }
}
