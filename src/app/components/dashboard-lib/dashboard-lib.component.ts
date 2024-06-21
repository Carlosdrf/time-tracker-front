import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DashboardItems {
  path?: string | null;
  title: string;
  description: string;
  header: string;
  resource?: string;
  href?: string | null;
  alert?: boolean;
  options?: DashboardItemsOptions[];
}

export interface DashboardItemsOptions {
  title: string;
  path: string;
  icon?: string;
  label?: string;
}
@Component({
  selector: 'app-dashboard-lib',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, RouterLink],
  templateUrl: './dashboard-lib.component.html',
  styleUrl: './dashboard-lib.component.scss',
})
export class DashboardLibComponent {
  @Input() components!: DashboardItems[];
  @Input() entriesAlert: string = '';

  displayAlert(component: any) {
    switch (component.title) {
      case 'Tracker':
        return this.entriesAlert;
      default:
        return '';
    }
  }
}
