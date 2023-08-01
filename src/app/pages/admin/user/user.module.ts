import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class UserModule {}
