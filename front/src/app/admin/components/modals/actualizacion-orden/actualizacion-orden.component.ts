import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/admin/services/modal/modal.service';
import { CambioStatusOrdenComponent } from '../cambio-status-orden/cambio-status-orden.component';

@Component({
	selector: 'app-actualizacion-orden',
	templateUrl: './actualizacion-orden.component.html',
	styleUrls: ['./actualizacion-orden.component.css']
})
export class ActualizacionOrdenComponent implements OnInit{
	@Input() solicitud: any = {};

	protected permisos: any = JSON.parse(localStorage.getItem('permisos_soporte')+'');

	constructor(
		private modal: ModalService,
		protected patern: CambioStatusOrdenComponent
	) { }

	ngOnInit(): void {
		console.log(this.solicitud);
	}

	protected cerrarModal(): void {
		this.modal.cerrarModal();
	}
}