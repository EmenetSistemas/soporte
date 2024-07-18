import { Component, Input } from '@angular/core';
import { ModalService } from 'src/app/admin/services/modal/modal.service';

@Component({
	selector: 'app-actualizacion-orden',
	templateUrl: './actualizacion-orden.component.html',
	styleUrls: ['./actualizacion-orden.component.css']
})
export class ActualizacionOrdenComponent {
	@Input() solicitud: any = {};

	constructor(
		private modal: ModalService
	) { }

	protected cerrarModal(): void {
		this.modal.cerrarModal();
	}
}