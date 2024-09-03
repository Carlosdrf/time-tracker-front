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

  constructor(public notificationsService: NotificationsService,
              private usersService: UsersService,
              private page: PagesComponent,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.loaded = false;
    this.notificationsService.loadNotifications()
    this.loaded = true;
  }
}
