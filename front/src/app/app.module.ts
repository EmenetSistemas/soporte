import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './admin/home/home.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing';
import { HomeModule } from './admin/home/home.module';
import { DashboardComponent } from './admin/modules/dashboard/dashboard.component';
import { NavbarComponent } from './admin/components/navbar/navbar.component';
import { SidenavComponent } from './admin/components/sidenav/sidenav.component';
import { FooterComponent } from './admin/components/footer/footer.component';
import { OrdenComponent } from './admin/modules/orden/orden.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultaOrdenesComponent } from './admin/modules/ordenes/consulta-ordenes/consulta-ordenes.component';
import { DropdownComponent } from './admin/components/dropdown/dropdown.component';
import { DatatableComponent } from './admin/components/datatable/datatable.component';
import { HttpClientModule } from '@angular/common/http';
import { EquipoComponent } from './admin/templates/equipo/equipo.component';
import { ModalOrdenPdfComponent } from './admin/modules/ordenes/modal-orden-pdf/modal-orden-pdf.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginComponent } from './auth/login/login.component';
import { InvalidRouteComponent } from './shared/invalid-route/invalid-route.component';
import { CambioStatusOrdenComponent } from './admin/components/modals/cambio-status-orden/cambio-status-orden.component';
import { ActualizacionOrdenComponent } from './admin/components/modals/actualizacion-orden/actualizacion-orden.component';
import { SolicitudesOrdenComponent } from './admin/modules/solicitudes-orden/solicitudes-orden.component';
import { ConsultaUsuariosComponent } from './admin/modules/usuarios/consulta-usuarios/consulta-usuarios.component';
import { ModificarUsuarioComponent } from './admin/modules/usuarios/modificar-usuario/modificar-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    SidenavComponent,
    FooterComponent,
    OrdenComponent,
    ConsultaOrdenesComponent,
    DropdownComponent,
    DatatableComponent,
    EquipoComponent,
    ModalOrdenPdfComponent,
    LoginComponent,
    InvalidRouteComponent,
    CambioStatusOrdenComponent,
    ActualizacionOrdenComponent,
    SolicitudesOrdenComponent,
    ConsultaUsuariosComponent,
    ModificarUsuarioComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    HomeModule,
    FormsModule,
		ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  providers: [
    SidenavComponent,
    CambioStatusOrdenComponent
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
