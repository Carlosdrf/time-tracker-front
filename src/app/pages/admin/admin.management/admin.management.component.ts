import { Component } from '@angular/core';
import { SharedModule } from 'src/app/components/shared.module';

@Component({
  selector: 'app-admin.management',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin.management.component.html',
  styleUrl: './admin.management.component.scss',
})
export class AdminManagementComponent {
  options: any = [
    { title: 'Positions', label: 'Set the employees positions' },
    { title: 'Companies', label: 'Create/Edit companies info' },
  ];
}
