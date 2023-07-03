import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReportsComponent } from "./reports.component";
import { SharedModule } from "src/app/components/shared.module";
import { CustomDatePipe } from "src/app/services/custom-date.pipe";

export const router: Routes = [
    {path: '', component: ReportsComponent, pathMatch: 'full'}
]

@NgModule({
    exports: [],
    imports: [
        CommonModule,
        RouterModule.forChild(router),
        SharedModule,
        
    ],
    declarations: [
        ReportsComponent,
        // CustomDatePipe
    ],
    // providers: [ CustomDatePipe ]
})

export class ReportsModule {}