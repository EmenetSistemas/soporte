import { Component } from '@angular/core';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import Swal from 'sweetalert2';
import { OrdenesService } from '../../services/api/ordenes/ordenes.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
    protected permisos: any = JSON.parse(localStorage.getItem('permisos_soporte')+'');

    constructor (
        private mensajes: MensajesService,
        private apiOrdenes: OrdenesService,
        private router: Router
    ) { }

    public entregarEquipo(folio: any = null, codigo: any = null): void {
        Swal.fire({
            title: 'Entregar equipo',
            html: `
                <p>¿Está seguro de entregar el equipo?</p>
                <form class="row g-3" autocomplete="off">
                    <div class="col-sm-6 col-12">
                        <label class="form-label">Folio:</label>
                        <input id="folio" type="text" class="form-control t-center" placeholder="Folio" autocomplete="off" value="${folio ?? ''}">
                    </div>
                    <div class="col-sm-6 col-12">
                        <label class="form-label">Código:</label>
                        <input id="codigo" type="text" class="form-control t-center" placeholder="Código" autocomplete="off" value="${codigo ?? ''}">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Folio ticket:</label>
                        <input id="folioTicket" type="text" class="form-control t-center" placeholder="Folio ticket" autocomplete="off">
                    </div>
                </form>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Entregar',
            cancelButtonText: 'Cancelar',
            buttonsStyling: false,
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'order-1 btn btn-primary me-2',
                cancelButton: 'order-2 btn btn-danger',
                denyButton: 'order-3'
            },
            preConfirm: () => {
                const folio = (document.getElementById('folio') as HTMLInputElement).value;
                const codigo = (document.getElementById('codigo') as HTMLInputElement).value;
                const folioTicket = (document.getElementById('folioTicket') as HTMLInputElement).value;
                if (!folio || !codigo || !folioTicket) {
                    Swal.showValidationMessage('Es necesario colocar todos los datos solicitados para poder continuar');
                }
                return { folio, codigo, folioTicket };
            }
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.mensajes.mensajeEsperar();

                result.value.token = localStorage.getItem('token_soporte');
                
                this.apiOrdenes.entregarEquiposOrden(result.value).subscribe(
                    respuesta => {
                        if (respuesta.status == 300) {
                            this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
                            return;
                        }

                        this.mensajes.mensajeGenerico(respuesta.mensaje, 'success');
                        this.router.navigate(['/orden']);
                        setTimeout(() => {
                            this.router.navigate(['/detalle-orden', result.value.folio]);
                        }, 2000);
                    }, error => {
                        this.mensajes.mensajeGenerico('error', 'error');
                    }
                );
            }
        });
    }
}