import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../components/shared.module';
import { EmployeesComponent } from './employees.component';
import { ClientCustomerServiceComponent } from '../client.customer-service/client.customer-service.component';

export const router: Routes = [
  { path: '', component: EmployeesComponent, pathMatch: 'full' },
  {
    path: 'customer-service',
    component: ClientCustomerServiceComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [SharedModule, CommonModule, RouterModule.forChild(router)],
})
export class EmployeesModule {}
