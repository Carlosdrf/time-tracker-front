import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  authenticated: boolean = false

  constructor(private authService: AuthService, private router: Router){
    this.authService.isLoggedIn().subscribe(isLogged =>{
      this.authenticated = isLogged;
      // console.log(isLogged)
    })
    
  }
  ngOninit(){
    console.log(this.authenticated)
  }
  
  closeSession(){
    // this.router.navigateByUrl('/')
    this.authService.logout()
    // this.authenticated = this.authService.isLogged
  }

}
