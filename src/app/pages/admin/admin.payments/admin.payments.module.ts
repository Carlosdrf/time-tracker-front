import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AdminPaymentsComponent } from "./admin.payments.component";
import { SharedModule } from "src/app/components/shared.module";

export const routes: Routes = [{
    path: 'payments', component: AdminPaymentsComponent, pathMatch: 'full'
}]

@NgModule({
    declarations: [AdminPaymentsComponent],
    imports: [SharedModule, CommonModule, RouterModule.forChild(routes)]
})

export class AdminPaymentsModule {}