import { Component, OnInit } from '@angular/core';
import {
  DashboardItems,
  DashboardLibComponent,
} from 'src/app/components/dashboard-lib/dashboard-lib.component';
import { SharedModule } from 'src/app/components/shared.module';
import { PositionsService } from 'src/app/services/positions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [SharedModule, DashboardLibComponent],
})
export class ClientDashboardComponent implements OnInit {
  name?: any;
  services?: any;
  servicesComponent?: any;
  components: DashboardItems[] = [
    {
      title: 'Your Inimble Services',
      path: '/',
      description:
        'Below are the roles provided by Inimble for your business needs.',
      header: 'see services',
      options: [],
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
  constructor(private positionsService : PositionsService) {}

  ngOnInit(): void {
    this.name = this.getUserName();
    this.positionsService.getCompanyPositions().subscribe((services) => {
      this.services = services;
      this.servicesComponent = this.components.find((component) => component.title === 'Your Inimble Services');
      if (this.servicesComponent) {
        services.forEach(element => {
          this.servicesComponent.options.push({
            title: element,
            icon: 'fa-solid fa-user',
            path: '/',
          });
        });
      }
    });
  }
  getUserName() {
    const name = localStorage.getItem('name');
    return name;
  }
}
