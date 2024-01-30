import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { TimerComponent } from '../timer/timer.component';
import { ReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule, TimerComponent, SharedModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  @Input() user!: any;

  constructor(private reportService: ReportsService, private router: Router) {}
  selectUser(user: any) {
    this.reportService.setUserInformation(user);
  }
}
