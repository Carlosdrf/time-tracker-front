import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './services/guards/auth-guard.service';
import { notAuthGuard } from './services/guards/notAuth-guard.service';
import { UserTypeGuardService } from './services/guards/user-type-guard.service';

const ADMIN_TYPE_ROLE = '1';
const USER_TYPE_ROLE = '2';
const CLIENT_TYPE_ROLE = '3';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [UserTypeGuardService],
        data: { allowedUserTypes: [USER_TYPE_ROLE] },
      },
      {
        path: 'reports',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./pages/reports/reports.module').then((m) => m.ReportsModule),
        data: { allowedUserTypes: [ADMIN_TYPE_ROLE, USER_TYPE_ROLE] },
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('./pages/client/client.employees/employees.module').then(
            (m) => m.EmployeesModule
          ),
        canActivate: [UserTypeGuardService],
        data: { allowedUserTypes: [CLIENT_TYPE_ROLE] },
      },
      {
        path: 'entries',
        loadChildren: () =>
          import(
            './pages/dashboard/entries.employees/entries.employees.module'
          ).then((m) => m.EntriesEmployeesModule),
        canActivate: [UserTypeGuardService],
        data: { allowedUserTypes: [USER_TYPE_ROLE, CLIENT_TYPE_ROLE] },
      },
      {
        path: 'login',
        canActivate: [notAuthGuard],
        loadChildren: () =>
          import('./pages/login/login.module').then((m) => m.LoginModule),
      },
      { path: 'logout', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'signup',
        loadChildren: () =>
          import('./pages/login/login.module').then((m) => m.LoginModule),
        canActivate: [notAuthGuard],
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [UserTypeGuardService],
        data: { allowedUserTypes: [ADMIN_TYPE_ROLE] },
      },
      // {
      //   path: 'user',
      //   loadChildren: () =>
      //     import('./pages/admin/admin.entries/admin.entries.module').then(
      //       (m) => EntriesModule
      //     ),
      //   canActivate: [UserTypeGuardService],
      //   data: { allowedUserTypes: [CLIENT_TYPE_ROLE, ADMIN_TYPE_ROLE] },
      // },
      {
        path: 'client',
        loadChildren: () =>
          import('./pages/client/client.module').then((m) => m.ClientModule),
        canActivate: [UserTypeGuardService],
        data: { allowedUserTypes: [CLIENT_TYPE_ROLE, ADMIN_TYPE_ROLE] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
