import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
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
		private router: Router
	) { }

	protected verOrden(): void {
		this.cerrarModal();
		this.router.navigate(['/detalle-orden', this.solicitud.fkTblOrdenServicio]);
	}

	protected cerrarModal(): void {
		this.modal.cerrarModal();
	}
}