import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../components/shared.module';
import { EmployeesComponent } from './employees.component';

export const router: Routes = [
  { path: '', component: EmployeesComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [SharedModule, CommonModule, RouterModule.forChild(router)],
})
export class EmployeesModule {}
