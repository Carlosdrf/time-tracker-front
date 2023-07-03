import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from "./services/guards/auth-guard.service";
import { notAuthGuard } from "./services/guards/notAuth-guard.service";
import { AdminGuard } from "./services/guards/admin-guard.service";
import { NotAdmin } from "./services/guards/not-admin.service";
import { EntriesComponent } from './pages/admin/entries/entries.component';
import { EntriesModule } from './pages/admin/entries/entries.module';
import { UserTypeGuardService } from './services/guards/user-type-guard.service';

let ADMIN_TYPE_ROLE = '1'
let USER_TYPE_ROLE = '2'
let CLIENT_TYPE_ROLE = '3'
export const routes: Routes = [
  {
    path: '',
    component: PagesComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [ UserTypeGuardService ], data: {allowedUserTypes: [USER_TYPE_ROLE]}},
      { path: 'reports', canActivate: [ AuthGuard ], loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule), data: {allowedUserTypes: [ADMIN_TYPE_ROLE, USER_TYPE_ROLE]}},
      { path: 'login', canActivate: [ notAuthGuard ], loadChildren: () => import('./pages/login/login.module').then(m=> m.LoginModule)},
      { path: 'logout', redirectTo: 'login', pathMatch: 'full' },
      { path: 'signup', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule), canActivate: [ notAuthGuard ]},
      { path: 'admin', loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [ UserTypeGuardService ], data: {allowedUserTypes: [ADMIN_TYPE_ROLE]}},
      { path: 'user', loadChildren: () => import('./pages/admin/entries/entries.module').then(m => EntriesModule), canActivate: [ UserTypeGuardService ], data: {allowedUserTypes: [ADMIN_TYPE_ROLE]}},
      { path: 'client', loadChildren: ()=> import('./pages/client/client.module').then(m => m.ClientModule), canActivate: [UserTypeGuardService], data: {allowedUserTypes: [ADMIN_TYPE_ROLE, CLIENT_TYPE_ROLE]}}
      // {
      //   path: 'login',
      //   component: LoginComponent,
      //   canActivate: [notAuthGuard]
      // },
      // {
      //   path: 'signup',
      //   component: LoginComponent,
      //   canActivate: [notAuthGuard]
      // },
      // {
      //   path: 'reports',
      //   component: ReportsComponent,
      //   canActivate: [AuthGuard]
      // }
    ]
  }
  // ,{path: '', redirectTo: 'app-timer', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
