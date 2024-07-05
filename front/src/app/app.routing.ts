import { Routes } from "@angular/router";
import { HomeComponent } from "./admin/home/home.component";
import { LoginComponent } from "./auth/login/login.component";
import { InvalidRouteComponent } from "./shared/invalid-route/invalid-route.component";

export const AppRoutes : Routes = [
    {
        path: '',
        component: HomeComponent
    }, {
        path: 'login',
        component: LoginComponent
    }, {
        path: '**',
        component: InvalidRouteComponent
    }
];