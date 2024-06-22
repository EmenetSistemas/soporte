import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeRoutes } from "./home.routing";

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(HomeRoutes)
    ]
})

export class HomeModule {}