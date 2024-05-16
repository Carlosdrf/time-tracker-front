import { Component, OnInit, ElementRef } from '@angular/core';
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
  authenticated: boolean = false;
  isAdmin: boolean = false;
  userType: any;
  isActive: boolean = false;
  notifications: any[] = [];
  recentNotifications: any[] = [];
  reviewEntries: any = [];
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private element: ElementRef,
    private notificationsService: NotificationsService,
    private entriesService: EntriesService,
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
    const role = localStorage.getItem('role');
    if (role != '1') {
    this.notificationsService.get().subscribe(notifications => {
      this.notifications = notifications.filter((notification:any) => {
        return notification.active == 1;
      }).slice(0, 4); 
      
      this.notifications.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      });
    } else {
      let body = {};
      this.userService.getUsers(body).subscribe({
        next: (users) => {
          this.reviewEntries = users.filter((user: any) => user.review);
          this.reviewEntries = this.reviewEntries.map((user: any) => {
            return {
              message: `Entries For Review: ${user.name} ${user.last_name}`,
              id: user.id,
              name: user.name
            };
          })
          .slice(0, 4); 
        }
      });
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
  hideNav(event: any) {
    if (!this.element.nativeElement.contains(event.target)) {
      this.isActive = false;
    }
  }
}
