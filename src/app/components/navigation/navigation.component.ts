import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { ReportsService } from "../../services/reports.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  authenticated: boolean = false
  isAdmin: boolean = false
  isActive: boolean = false
  constructor(private reports: ReportsService ,private authService: AuthService, private router: Router, private element: ElementRef){
    this.authService.isLoggedIn().subscribe(isLogged =>{
      this.authenticated = isLogged;
    })
    this.authService.verifyAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    })
    
  }

  ngOnInit(){
    document.addEventListener('click', this.hideNav.bind(this))
  }
  
  closeSession(){
    this.authService.logout()
  }
  toggleMenu(){
    this.isActive = !this.isActive
  }
  hideNav(event: any){
    if(!this.element.nativeElement.contains(event.target)){
      this.isActive = false
    }
  }
  resetUserReport(){
    this.reports.resetUser()
  }
}
