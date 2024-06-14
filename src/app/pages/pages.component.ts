import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../components/shared.module';
import { NotificationModalComponent } from '../components/notification-modal/notification-modal.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [SharedModule, NotificationModalComponent],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  onAlert?: boolean = false;
  message?: any;
  alertElement?: any;
  constructor() {}

  ngOnInit(): void {}

  public setAlert(message: any) {
    this.message = message;
    this.onAlert = !this.onAlert;

    this.alertElement.style.display = 'block';
    setTimeout(() => {
      this.alertElement.style.opacity = 1;
    }, 300);
    setTimeout(() => {
      this.alertElement.style.opacity = 0;
      setTimeout(() => {
        this.alertElement.style.display = 'none';
        this.onAlert = !this.onAlert;
      }, 300);
    }, 2500);
  }
}
