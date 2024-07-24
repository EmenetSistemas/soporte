import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { DashboardComponent } from "../modules/dashboard/dashboard.component";
import { OrdenComponent } from "../modules/orden/orden.component";
import { ConsultaOrdenesComponent } from "../modules/ordenes/consulta-ordenes/consulta-ordenes.component";
import { AdminGuard } from "../guards/admin/admin.guard";
import { SolicitudesOrdenComponent } from "../modules/solicitudes-orden/solicitudes-orden.component";
import { ConsultaUsuariosComponent } from "../modules/usuarios/consulta-usuarios/consulta-usuarios.component";

export const HomeRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AdminGuard],
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
                path: 'detalle-orden/:pkOrden',
                component: OrdenComponent
            }, {
                path: 'solicitudes-orden',
                component: SolicitudesOrdenComponent
            }, {
                path: 'usuarios',
                component: ConsultaUsuariosComponent
            }
        ]
    }
];