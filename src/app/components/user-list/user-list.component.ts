import { Component, Input } from '@angular/core';
import { SharedModule } from '../shared.module';
import { TimerComponent } from '../timer/timer.component';
import { ReportsService } from 'src/app/services/reports.service';
import { UserOptionsComponent } from '../user-options/user-options.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule, TimerComponent, UserOptionsComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  @Input() users!: any;
  @Input() timer: boolean = false;
  @Input() loaded!: boolean;
  // @Input() editMode: boolean = false
  @Input() links: any

  constructor(private reportService: ReportsService) {}

  selectUser(user: any) {
    this.reportService.setUserInformation(user);
  }
}
