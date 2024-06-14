import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  authenticated: boolean = false;
  isAdmin: boolean = false;
  userType: any;
  isActive: boolean = false;
  constructor(private authService: AuthService, private element: ElementRef) {
    this.authService.isLoggedIn().subscribe((isLogged) => {
      this.authenticated = isLogged;
    });
  }

  ngOnInit() {
    document.addEventListener('click', this.hideNav.bind(this));
    this.authService.getUserType().subscribe((role) => {
      this.userType = role;
    });
  }
  public get currentType() {
    return this.authService.userType$;
  }
  closeSession() {
    this.authService.logout();
  }
  toggleMenu() {
    this.isActive = !this.isActive;
  }
  hideNav(event: Event): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.isActive = false;
    }
  }
}
