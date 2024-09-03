import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  API_URI = `${environment.apiUrl}/notifications`;
  notifications: any[] = [];
  recentNotifications: any[] = [];
  earlierNotifications: any[] = [];

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get<any>(`${this.API_URI}`);
  }

  public submit(data: any, id: any = null) {
    if (id) return this.http.put(`${this.API_URI}/${id}`, data);
    return this.http.post(`${this.API_URI}`, data);
  }

  update(notifications: any, status: number) {
      const promises = notifications.map((notification: any) => {
        const now = new Date();
        const body:any = {
          "user_id": notification.users_notifications.user_id,
          "notification_id": notification.id,
          "status": status,
          "updatedAt": now
        }
      
        return this.http.put(`${this.API_URI}/${notification.id}/${notification.users_notifications.user_id}`, body)
        .subscribe({
          next: (response) => {
            this.loadNotifications()
          }
        });
      });
  }

  loadNotifications() {
    this.get().subscribe(notifications => {
      this.notifications = notifications;
      
      this.notifications.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      const today = new Date();
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(today.getDate() - 2);

      this.recentNotifications = this.notifications.filter(
        (notification) => new Date(notification.createdAt) >= twoDaysAgo && new Date(notification.createdAt) <= today && notification.active === 1 && notification.users_notifications.status !== 2
      );
    
      this.earlierNotifications = this.notifications.filter(
        (notification) =>  notification.active === 1 && notification.users_notifications.status === 2
      );
    });
  }

  loadNotificationsNav() {
    this.get().subscribe(notifications => {
      this.notifications = notifications.filter((notification:any) => {
        return notification.active == 1;
      }).slice(0, 4); 
      
      this.notifications.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }); 
  }

}
