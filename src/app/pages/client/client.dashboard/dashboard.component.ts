import { Component, OnInit } from '@angular/core';
import {
  DashboardItems,
  DashboardLibComponent,
} from 'src/app/components/dashboard-lib/dashboard-lib.component';
import { SharedModule } from 'src/app/components/shared.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [SharedModule, DashboardLibComponent],
})
export class ClientDashboardComponent implements OnInit {
  name?: any;
  components: DashboardItems[] = [
    {
      title: 'Payment Section',
      path: 'balance',
      description:
        'Here you can pay and see your current balance and status with I-nimble.',
      header: 'see payments',
      options: [
        {
          title: 'see payments',
          icon: 'fa-regular fa-credit-card',
          path: 'balance',
        },
      ],
    },
    {
      title: 'Team Members',
      path: '/employees',
      description: 'See your Members current timer or review their reports.',
      header: 'see your team',
      options: [
        { title: 'tracker', path: '/employees', icon: 'fa-regular fa-clock' },
        {
          title: 'reports',
          path: '/reports',
          icon: 'fa-solid fa-chart-column',
        },
      ],
    },
    {
      title: 'Customer Service',
      path: 'customer-service',
      description: `Here you can talk to an agent or create a ticket, keep in mind there are some not available options, we're working on it.`,
      header: 'Customer Service',
    },
    {
      title: 'blog section',
      href: 'https://i-nimble.com/blog',
      description: 'Get our last news.',
      header: 'see our news',
    },
  ];
  constructor() {}

  ngOnInit(): void {
    this.name = this.getUserName();
  }
  getUserName() {
    const name = localStorage.getItem('name');
    return name;
  }
}
