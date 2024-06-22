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
import { LaptopComponent } from './admin/templates/laptop/laptop.component';
import { ImpresoraComponent } from './admin/templates/impresora/impresora.component';
import { PcComponent } from './admin/templates/pc/pc.component';
import { MonitorComponent } from './admin/templates/monitor/monitor.component';
import { OtroComponent } from './admin/templates/otro/otro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultaOrdenesComponent } from './admin/modules/ordenes/consulta-ordenes/consulta-ordenes.component';
import { DropdownComponent } from './admin/components/dropdown/dropdown.component';
import { DatatableComponent } from './admin/components/datatable/datatable.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    SidenavComponent,
    FooterComponent,
    OrdenComponent,
    LaptopComponent,
    ImpresoraComponent,
    PcComponent,
    MonitorComponent,
    OtroComponent,
    ConsultaOrdenesComponent,
    DropdownComponent,
    DatatableComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    HomeModule,
    FormsModule,
		ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
