import { Component, Input } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  @Input() user!: any;

  constructor(private reportService: ReportsService) {}
  selectUser(user: any) {
    this.reportService.setUserInformation(user);
  }
}
