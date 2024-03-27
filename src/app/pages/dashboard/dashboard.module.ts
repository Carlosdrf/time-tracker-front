import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
// import { SharedModule } from "../../components/shared.module";
import { CustomDatePipe } from "../../services/custom-date.pipe";
import { FormsModule } from "@angular/forms";
import { ClientDashboardComponent } from "./dashboard.component";
import { SharedModule } from "src/app/components/shared.module";
import { ClientCustomerServiceComponent } from "../client/client.customer-service/client.customer-service.component";

export const routes: Routes = [
    {path: '', component: ClientDashboardComponent, pathMatch: 'full'},
    {path: 'customer-service', component: ClientCustomerServiceComponent, pathMatch: 'full'}
]

@NgModule({
    declarations: [
        ClientDashboardComponent,
        // CustomDatePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    // exports: [
    //     ClientDashboardComponent
    // ]
    // providers: [
    //     CustomDatePipe
    // ]
})
export class DashboardModule {}
