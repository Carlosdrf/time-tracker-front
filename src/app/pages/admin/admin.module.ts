import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../components/shared.module';
import { AdminClientDashboardComponent } from './admin.dashboard/dashboard.component';
import { AdminEntriesComponent } from './admin.entries/admin.entries.component';
import { AdminPaymentsComponent } from './admin.payments/admin.payments.component';
import { AdminUsersComponent } from './admin.users/admin.users.component';
import { AdminTeamsComponent } from './admin.teams/admin.teams.component';
import { AdminManagementComponent } from './admin.management/admin.management.component';
import { CreateUserComponent } from './admin.users/create-user/create-user.component';
import { AdminNotificationsComponent } from './admin.notifications/admin.notifications.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminClientDashboardComponent,
    pathMatch: 'full',
  },
  { path: 'entries', component: AdminEntriesComponent, pathMatch: 'full' },
  { path: 'notifications', component: AdminNotificationsComponent, pathMatch: 'full' },
  {
    path: 'payments',
    component: AdminPaymentsComponent,
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: AdminUsersComponent,
    // children: [
    //   {
    //     path: 'create',
    //     component: CreateUserComponent,
    //   },
    // ],
  },
  { path: 'teams', component: AdminTeamsComponent, pathMatch: 'full' },
  {
    path: 'management',
    component: AdminManagementComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [SharedModule, CommonModule, RouterModule.forChild(routes)],
  exports: [],
})
export class AdminModule {}
