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

	protected permisos: any = JSON.parse(localStorage.getItem('permisos_soporte')+'');

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

	public aprobarSolicitud(pkSolicitud: number = this.solicitud.pkTblSolicitudOrden): void {
		this.mensajes.mensajeConfirmacionCustom('¿Está seguro de aprobar la solicitud en cuestión?', 'question', 'Aprobar solicitud').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();
				this.cerrarModal();
		
				this.apiOrdenes.aprobarSolicitudOrden(pkSolicitud).subscribe(
					respuesta => {
						this.mensajes.mensajeGenerico(respuesta.mensaje, 'success');
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	public eliminarSolicitud(pkSolicitud: number = this.solicitud.pkTblSolicitudOrden): void {
		this.mensajes.mensajeConfirmacionCustom(`¿Está seguro de ${(this.permisos.perfil == 'Administrador' || this.permisos.perfil == 'Superadministrador') ? 'eliminar' : 'cancelar'} la solicitud en cuestión?`, 'question', `${(this.permisos.perfil == 'Administrador' || this.permisos.perfil == 'Superadministrador') ? 'Eliminar' : 'Cancelar'} solicitud`).then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();
				this.cerrarModal();

				this.apiOrdenes.eliminarSolicitudOrden(pkSolicitud).subscribe(
					respuesta => {
						this.mensajes.mensajeGenerico((this.permisos.perfil == 'Administrador' || this.permisos.perfil == 'Superadministrador') ? respuesta.mensaje : 'Se canceló la solicitud con éxito', 'success');
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