import { Component, OnInit } from '@angular/core';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { SharedModule } from 'src/app/components/shared.module';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { AdminTeamsComponent } from '../admin.teams/admin.teams.component';
import { ReportsComponent } from '../../reports/reports.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserListComponent, SharedModule, TimerComponent, SearchComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminClientDashboardComponent implements OnInit {
  name: string = '';
  public loaded: boolean = false;

  public components: Array<any> = [
    {
      href: null,
      path: '/admin/teams',
      resource: 'empleados-section.png',
      title: 'Teams',
      description: 'You can either manage Users or see Tracking dashboard',
      header: 'See Team Members',
      options: [
        {
          title: 'Users',
          icon: 'fa-solid fa-user-group',
          path: '/admin/users',
        },
        { title: 'Tracker', icon: 'fa-regular fa-clock', path: '/admin/teams' },
      ],
    },
    {
      path: '/admin/management',
      href: null,
      resource: null,
      title: 'Management section',
      description: 'Here you can manage options to work with',
      header: 'Go to Management',
      options: [
        {title: 'Forms Info', icon: 'fa-solid fa-sliders', path: '/admin/management', label:'Add/modify options used in /users'},
        {title: 'Notifications (coming soon..)', icon: 'fa-regular fa-comment-dots', path: '/admin/notifications'},
      ]
    },
    {
      path: '/client/customer-service',
      href: null,
      resource: 'customer-service-section.png',
      title: 'Customer Service',
      description: 'Here you can talk to an agent or create a ticket',
      header: 'Customer Service',
      options: [],
    },
    {
      component: '',
      path: null,
      href: 'https://i-nimble.com/blog/',
      resource: 'blog-section.png',
      title: 'Content Section',
      description: 'Go to I-nimble blog or manage the content will be displayed for users',
      header: 'See News',
      options: [
        {
          title: 'Create content (coming soon...)',
          icon: 'fa-solid fa-screwdriver-wrench',
          path: '',
        },
      ],
    },
  ];

  constructor() {}
  ngOnInit(): void {
    this.getName();
  }
  loading() {
    this.loaded = false;
  }

  public getName() {
    const name = localStorage.getItem('name');
    this.name = name || '';
    return name;
  }
}
