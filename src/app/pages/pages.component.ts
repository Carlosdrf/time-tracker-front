import { Component, OnInit } from '@angular/core';
import { NotificationsPopupComponent } from '../components/notifications-popup/notifications-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationsService } from '../services/notifications.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit{
  onAlert?: boolean = false
  message?: any
  alertElement?: any
  notifications: any[] = [];

  constructor(private router: Router,
              private dialog: MatDialog, 
              private notificationsService: NotificationsService){}

  ngOnInit(): void {
    this.alertElement = document.getElementById('alert');
  
    const role = localStorage.getItem('role');
    if (role != '1') {
      this.notificationsService.get().subscribe(notifications => {
        this.notifications = notifications.filter((notification: any) => notification.users_notifications.status === 3);
  
        if (this.notifications.length > 0) {
          const currentUrl = this.router.url;
  
          if (!currentUrl.includes('login') && !currentUrl.includes('signup')) {
            const dialogRef = this.dialog.open(NotificationsPopupComponent, {
              data: '',
            });
            dialogRef.afterClosed().subscribe((option: boolean) => {
              if (option) {
              }
            });  
          }
        }
      });
    }
  }
  
  
  ngOnChanges(){
  }
  public setAlert(message: any){
    this.message = message
    this.onAlert = !this.onAlert

    this.alertElement.style.display = 'block'
    setTimeout(() => {
      this.alertElement.style.opacity = 1
    }, 300);
    setTimeout(() => {
      this.alertElement.style.opacity = 0
      setTimeout(() => {
        this.alertElement.style.display = 'none'
        this.onAlert = !this.onAlert
      }, 300);
    }, 2500);
  }
}
