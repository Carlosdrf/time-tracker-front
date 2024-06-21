import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeDashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/components/shared.module';

export const routes: Routes = [
  { path: '', component: EmployeeDashboardComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class EmployeeDashboardModule {}
