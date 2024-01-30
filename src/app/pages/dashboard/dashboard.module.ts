import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
// import { SharedModule } from "../../components/shared.module";
import { CustomDatePipe } from "../../services/custom-date.pipe";
import { FormsModule } from "@angular/forms";
import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from "src/app/components/shared.module";

export const routes: Routes = [
    {path: '', component: DashboardComponent, pathMatch: 'full'}
]

@NgModule({
    declarations: [
        DashboardComponent,
        // CustomDatePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    // exports: [
    //     DashboardComponent
    // ]
    // providers: [
    //     CustomDatePipe
    // ]
})
export class DashboardModule {}
