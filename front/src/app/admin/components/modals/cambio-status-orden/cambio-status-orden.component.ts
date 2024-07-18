import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenesService } from 'src/app/admin/services/api/ordenes/ordenes.service';
import { MensajesService } from 'src/app/admin/services/mensajes/mensajes.service';
import { ModalService } from 'src/app/admin/services/modal/modal.service';

@Component({
	selector: 'app-cambio-status-orden',
	templateUrl: './cambio-status-orden.component.html',
	styleUrls: ['./cambio-status-orden.component.css']
})
export class CambioStatusOrdenComponent {
	@Input() solicitud: any = {};

	constructor(
		private modal: ModalService,
		private router: Router,
		private mensajes: MensajesService,
		private apiOrdenes: OrdenesService
	) { }

	protected verOrden(): void {
		this.cerrarModal();
		this.router.navigate(['/detalle-orden', this.solicitud.fkTblOrdenServicio]);
	}

	protected eliminarSolicitud(): void {
		this.mensajes.mensajeConfirmacionCustom('¿Está seguro de eliminar la solicitud en cuestión?', 'question', 'Eliminar solicitud').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();
				this.cerrarModal();
				
				this.apiOrdenes.eliminarSolicitudOrden(this.solicitud.pkTblSolicitudOrden).subscribe(
					respuesta => {
						this.mensajes.mensajeGenerico(respuesta.mensaje, 'success');
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	protected cerrarModal(): void {
		this.modal.cerrarModal();
	}
}