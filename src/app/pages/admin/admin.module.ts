import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../components/shared.module';
import { AdminDashboardComponent } from './admin.dashboard/dashboard.component';
import { AdminEntriesComponent } from './admin.entries/admin.entries.component';
import { AdminPaymentsComponent } from './admin.payments/admin.payments.component';
import { AdminUsersComponent } from './admin.users/admin.users.component';

export const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent, pathMatch: 'full' },
  { path: 'entries', component: AdminEntriesComponent, pathMatch: 'full' },
  {
    path: 'payments',
    component: AdminPaymentsComponent,
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: AdminUsersComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    // AdminDashboardComponent
    // EntriesComponent
  ],
  imports: [SharedModule, CommonModule, RouterModule.forChild(routes)],
  exports: [],
})
export class AdminModule {}
