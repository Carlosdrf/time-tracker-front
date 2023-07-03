import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../components/shared.module";
import { AdminDashboardComponent } from "./dashboard.component";
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [
    {path: 'dashboard', component: AdminDashboardComponent, pathMatch: 'full'}
]

@NgModule({
    declarations: [
        AdminDashboardComponent
    ],
    imports:[
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [

    ]
})

export class DashboardModule {}