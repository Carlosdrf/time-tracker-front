import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../components/shared.module';
import { EntriesComponent } from './admin.entries.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'entries', component: EntriesComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [EntriesComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class EntriesModule {}
