import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { SharedModule } from "../../components/shared.module";
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { FormsModule } from '@angular/forms';
import { EmployeeDashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/components/shared.module';
import { ClientCustomerServiceComponent } from '../client/client.customer-service/client.customer-service.component';

export const routes: Routes = [
  { path: '', component: EmployeeDashboardComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [
    EmployeeDashboardComponent,
    // CustomDatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  // exports: [
  //     ClientDashboardComponent
  // ]
  // providers: [
  //     CustomDatePipe
  // ]
})
export class EmployeeDashboardModule {}
