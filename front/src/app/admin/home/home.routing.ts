import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { DashboardComponent } from "../modules/dashboard/dashboard.component";
import { OrdenComponent } from "../modules/orden/orden.component";
import { ConsultaOrdenesComponent } from "../modules/ordenes/consulta-ordenes/consulta-ordenes.component";

export const HomeRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: DashboardComponent
            }, {
                path: 'orden',
                component: OrdenComponent
            }, {
                path: 'consulta-ordenes',
                component: ConsultaOrdenesComponent
            }, {
                path: 'detalle-orden/:pkOrden/:msj',
                component: OrdenComponent
            }
        ]
    }
];