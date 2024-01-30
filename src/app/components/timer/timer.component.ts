import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  @Input() user: any;

  constructor(private reportsService: ReportsService, private router: Router) {}
  
}
