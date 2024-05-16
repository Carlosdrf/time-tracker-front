import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog } from '@angular/material/dialog';

import { NotificationsService } from 'src/app/services/notifications.service';
import { PagesComponent } from 'src/app/pages/pages.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit{
  @Input() loaded?: boolean;
  user: any
  userId!: number
  message: any 
  notifications: any[] = [];
  recentNotifications: any[] = [];
  earlierNotifications: any[] = [];

  constructor(private notificationsService: NotificationsService,
              private usersService: UsersService,
              private page: PagesComponent,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.loaded = false;
    this.notificationsService.get().subscribe(notifications => {
      this.notifications = notifications;
      
      this.notifications.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      const today = new Date();
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(today.getDate() - 2);
    
      this.recentNotifications = this.notifications.filter(
        (notification) => new Date(notification.createdAt) >= twoDaysAgo && new Date(notification.createdAt) <= today && notification.active === 1
      );
    
      this.earlierNotifications = this.notifications.filter(
        (notification) =>  new Date(notification.createdAt) < twoDaysAgo && notification.active === 1
      );
      this.loaded = true;
    });
  }
}
