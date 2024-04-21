import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../../components/shared.module';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  // user: any;
  // notifications: any[] = [];
  // recentNotifications: any[] = [];
  // earlierNotifications: any[] = [];

  // constructor(private notificationsService: NotificationsService) {}

  // ngOnInit() {
  //   this.user = {
  //     id: localStorage.getItem('userid'),
  //   };
  //   console.log(this.user, 'USER ID')
  //   this.notificationsService.getNotifications(this.user).subscribe((notifications) => {
  //     this.notifications = notifications;
  //     this.filterNotifications();
  //   });
  // }

  // private filterNotifications() {
  //   const today = new Date();
  //   const twoDaysAgo = new Date();
  //   twoDaysAgo.setDate(today.getDate() - 2);

  //   this.recentNotifications = this.notifications.filter(
  //     (notification) => notification.date >= twoDaysAgo && notification.date <= today && notification.active === 1
  //   );

  //   this.earlierNotifications = this.notifications.filter(
  //     (notification) => notification.date < twoDaysAgo && notification.active === 1
  //   );
  // }
}

