import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeRoutes } from "./home.routing";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        ModalModule.forChild()
    ]
})

export class HomeModule {}