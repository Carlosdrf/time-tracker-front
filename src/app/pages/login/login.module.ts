import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { LoginComponent } from "./login.component";
import { SharedModule } from "../../components/shared.module";

export const router = [
    { path: '', component: LoginComponent}
]

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(router)
    ]
})

export class LoginModule {}