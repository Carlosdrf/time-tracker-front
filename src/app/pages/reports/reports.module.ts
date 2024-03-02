import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';

export const router: Routes = [
  { path: '', component: ReportsComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(router)],
})
export class ReportsModule {}
