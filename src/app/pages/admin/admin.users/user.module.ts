import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { UserComponent } from './admin.user/user.component';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from './admin.users.component';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserComponent,
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: AdminUsersComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class UserModule {}
