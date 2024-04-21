import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Notification } from '../../models/Notifications';

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
  notifications: Notification[] = [];
  recentNotifications: any[] = [];
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private element: ElementRef,
    private notificationsService: NotificationsService
  ) {
    this.authService.isLoggedIn().subscribe((isLogged) => {
      this.authenticated = isLogged;
    });
  }

  ngOnInit() {
    document.addEventListener('click', this.hideNav.bind(this));
    this.authService.getUserType().subscribe((role) => {
      this.userType = role;
    });
    this.notificationsService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
      this.filterRecentNotifications();
    });
  }
  private filterRecentNotifications() {
    // this.notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
    // this.recentNotifications = this.notifications.slice(0, 3);
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
  hideNav(event: any) {
    if (!this.element.nativeElement.contains(event.target)) {
      this.isActive = false;
    }
  }
  resetUserReport() {
    this.userService.resetUser();
  }
}
