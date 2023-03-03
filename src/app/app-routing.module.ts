import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from './components/login/login.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AuthGuard } from "./services/auth-guard.service";
import { notAuthGuard } from "./services/notAuth-guard.service";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [notAuthGuard]
  },
  {
    path: 'signup',
    component: LoginComponent,
    canActivate: [notAuthGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 
}
