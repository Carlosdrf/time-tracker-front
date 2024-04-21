import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog } from '@angular/material/dialog';

import { NotificationsService } from 'src/app/services/notifications.service';
import { Notification } from '../../models/Notifications';
import { PagesComponent } from 'src/app/pages/pages.component';
import { ModalComponent } from '../modal/modal.component';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit{
  user: any
  userId!: number
  message: any 
  notifications: any[] = [];
  notificationIds: number[] = [];
  users_notifications: any[] = [];
  recentNotifications: any[] = [];
  earlierNotifications: any[] = [];

  constructor(private notificationsService: NotificationsService,
              private usersService: UsersService,
              private page: PagesComponent,
              private dialog: MatDialog) {}

  // ngOnInit() {
  //   this.user = {
  //     id: Number(localStorage.getItem('userid'))
  //   };
  
  //   this.notificationsService.getNotifications().subscribe((data) => {
  //     this.notifications = data.notifications;
  //     this.notificationIds = this.notifications.map(notification => notification.id);
  
  //     const all_users_notifications:any = []; 
  
  //     this.notificationIds.forEach((notificationId) => {
  //       this.notificationsService.getNotificationsByUser(notificationId, 34)
  //         .subscribe({
  //             next: (data: any) => {
  //               const user_notifications = data.notifications;
  //               all_users_notifications.push(...user_notifications); 
  //               this.users_notifications = all_users_notifications;
  //                   console.log(this.users_notifications, 'all_user_notifications');
  //             },
  //             error: (response : any) => {
  //             console.log(response.error);
  //             }
  //         });
        // this.notificationsService.getNotificationsByUser(notificationId, 34).subscribe((data) => {
        //   const user_notifications = data.notifications;
        //   console.log(user_notifications, 'user_notifications');
  
        //   all_users_notifications.push(...user_notifications); 
  
        //   if (true) {
        //     this.users_notifications = all_users_notifications;
        //     console.log(this.users_notifications, 'all_user_notifications');
        //   }
        // });
  //     });
  //   });  
  // }

  ngOnInit() {

    const email = localStorage.getItem('email'); // Obtener el email almacenado en el localStorage

    console.log(email);

    if (email) {
      const body = {
        email: email
      };
  
      this.usersService.getUsers(body).subscribe(data => {
 
        const filteredUsers = data.filter((user: any) => user.email === email);
  
        if (filteredUsers.length > 0) {
          this.userId = filteredUsers[0].id;
          console.log(this.userId, 'User ID');
        }
      });
    }


    this.notificationsService.getNotifications().pipe(
      catchError((error) => {
        console.error(error); 
        return of({ notifications: [] }); 
      })
    ).subscribe((data) => {
      this.notifications = data.notifications;
      this.notificationIds = this.notifications.map(notification => notification.id);
  
      const all_users_notifications: any[] = [];
  
      this.notificationIds.forEach((notificationId) => {
        this.notificationsService.getNotificationsByUser(notificationId, this.userId).pipe(
          catchError((error) => {
            console.error(error); 
            return of({ notifications: [] }); 
          })
        ).subscribe((data: any) => {
          const user_notifications = data.notifications;
  
          all_users_notifications.push(...user_notifications);
  
          if (true) {
            this.users_notifications = all_users_notifications;
          }
        });
      });
    });
  }

  private filterNotifications() {
    const today = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    // this.recentNotifications = this.notifications.filter(
    //   (notification) => notification.date >= twoDaysAgo && notification.date <= today && notification.active === 1
    // );

    // this.earlierNotifications = this.notifications.filter(
    //   (notification) => notification.date < twoDaysAgo && notification.active === 1
    // );
  }

  btnNotification(index: number, isRecent: boolean) {
    // if (isRecent) {
    //   const notification = this.recentNotifications[index];
    //   if (notification) {
    //     const dialog = this.dialog.open(ModalComponent, {
    //       data: { subject: 'notification' },
    //     });
    //     dialog.afterClosed().subscribe((option: boolean) => {
    //       if (option) {
    //         this.notificationsService.removeNotification(notification.id);
    //         this.recentNotifications.splice(index, 1);
    //         this.message = 'Notification has been removed';
    //         this.page.setAlert(this.message);
    //       }
    //     });
    //   }
    // } else {
    //   const notification = this.earlierNotifications[index];
    //   if (notification) {
    //     const dialog = this.dialog.open(ModalComponent, {
    //       data: { subject: 'notification' },
    //     });
    //     dialog.afterClosed().subscribe((option: boolean) => {
    //       if (option) {
    //         this.notificationsService.removeNotification(notification.id);
    //         this.earlierNotifications.splice(index, 1);
    //         this.message = 'Notification has been removed';
    //         this.page.setAlert(this.message);
    //       }
    //     });

    //   }
    // }
  }
}
