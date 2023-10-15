import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/components/shared.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PaymentsComponent } from './payments/payments.component';
import { ClientBalanceComponent } from './client.balance/client.balance.component';

export const routes:Routes = [
  {path: '', component:DashboardComponent, pathMatch: 'full'},
  {path: 'payments', component:PaymentsComponent, pathMatch: 'full'},
  {path: 'balance', component: ClientBalanceComponent, pathMatch: 'full'}

]
@NgModule({
  declarations: [
    DashboardComponent,
    PaymentsComponent,
    ClientBalanceComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule
  ]
})
export class ClientModule {}
