import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/components/shared.module";
import { EntriesEmployeesComponent } from "./entries.employees.component";


export const router: Routes = [
    {path: '', component: EntriesEmployeesComponent, pathMatch: 'full'} 
]

@NgModule({
    declarations: [],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(router)
    ]
})

export class EntriesEmployeesModule {}