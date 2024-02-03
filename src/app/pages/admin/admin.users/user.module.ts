import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from './admin.users.component';

const routes: Routes = [
  {
    path: 'users',
    component: AdminUsersComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class UserModule {}
