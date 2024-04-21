import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { SharedModule } from "src/app/components/shared.module";
import { NotificationsComponent } from "./notifications.component";

export const router = [
    { path: '', component: NotificationsComponent}
]

@NgModule({
    declarations: [
        // NotificationsComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(router)
    ]
})

export class NotificationsModule {}