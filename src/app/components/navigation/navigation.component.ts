import { Component, OnInit, ElementRef, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  userService = inject(UsersService);
  authenticated: boolean = false;
  isAdmin: boolean = false;
  userType: any;
  isActive: boolean = false;
  notificationsExpanded: boolean = false;
  constructor(
    private authService: AuthService,
    private element: ElementRef,
    public notificationsService: NotificationsService,
    public entriesService: EntriesService,
  ) {
    this.authService.isLoggedIn().subscribe((isLogged) => {
      this.authenticated = isLogged;
    });
  }

  ngOnInit() {
    this.notificationsService.loadNotifications()
    document.addEventListener('click', this.hideNav.bind(this));
    this.authService.getUserType().subscribe((role) => {
      this.userType = role;
    });
    const role = localStorage.getItem('role');
    if (role != '1') {
      this.notificationsService.loadNotificationsNav()
    } else {
      this.entriesService.loadEntriesNav()
    }
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
  toggleNotifications() {
    this.notificationsExpanded = !this.notificationsExpanded;
    if(!this.notificationsExpanded) {
      if(this.userType !== '1') {
        this.notificationsService.update(this.notificationsService.recentNotifications, 2)
      }
    }
  }
  hideNav(event: Event): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.isActive = false;
    }
  }

  clearSelectedUser() {
    this.userService.resetUser();
  }
}
