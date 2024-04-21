import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Notification, usersNotification } from '../models/Notifications';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtInterceptor } from './jwt.interceptor';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  API_URI = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNotifications() {
    return this.http.get<any>(`${this.API_URI}/notifications`);
  }

  getNotificationsByUser(notification_id: any, user_id: number) {
    return this.http.get<any>(`${this.API_URI}/notifications/${notification_id}/user/${user_id}`);
  }

//   private notifications: Notification[] = [
//     {id: 1, date: new Date('2024-04-01T00:00:00-08:00'), message: 'Notification 1', active: 1},
//     {id: 2, date: new Date('2024-04-05T00:00:00-08:00'), message: 'Notification 2', active: 1},
//     {id: 3, date: new Date('2024-04-06T00:00:00-08:00'), message: 'Notification 3', active: 1},
//     {id: 4, date: new Date('2024-04-08T00:00:00-08:00'), message: 'Notification 4', active: 1},
//     {id: 5, date: new Date('2024-04-09T00:00:00-08:00'), message: 'Notification 5', active: 0},
//     {id: 6, date: new Date('2024-04-09T00:00:00-08:00'), message: 'Notification 6', active: 1},
//     {id: 7, date: new Date('2024-04-10T00:00:00-08:00'), message: 'Notification 7', active: 1},
//     {id: 8, date: new Date('2024-04-11T00:00:00-08:00'), message: 'Notification 8', active: 1},
// ] ;
  
//   private users_notifications: usersNotification[] = [
//     {user_id: 1,  notification_id: 1, status: 'unread'},
//     {user_id: 34, notification_id: 2, status: 'unread'},
//     {user_id: 37, notification_id: 3, status: 'unread'},
//     {user_id: 34, notification_id: 4, status: 'unread'},
//     {user_id: 37, notification_id: 5, status: 'unread'},
//   ];

//   constructor(private http: HttpClient) {}
  
//   getNotifications(): Observable<Notification[]> {
//     return of(this.notifications);
//   }

  removeNotification(notificationId: number) {
    // const notification = this.notifications.find(n => n.id === notificationId);
    // if (notification) {
    //   notification.active = 0; 
    // }
  }

}
