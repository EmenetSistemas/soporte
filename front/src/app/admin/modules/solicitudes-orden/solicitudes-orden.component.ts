import { Component, OnDestroy } from '@angular/core';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { OrdenesService } from '../../services/api/ordenes/ordenes.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal/modal.service';
import { ActualizacionOrdenComponent } from '../../components/modals/actualizacion-orden/actualizacion-orden.component';
import { CambioStatusOrdenComponent } from '../../components/modals/cambio-status-orden/cambio-status-orden.component';

@Component({
	selector: 'app-solicitudes-orden',
	templateUrl: './solicitudes-orden.component.html',
	styleUrls: ['./solicitudes-orden.component.css']
})
export class SolicitudesOrdenComponent implements OnDestroy{
	protected options: any[] = [
		{
			label: 'Pendientes',
			value: 1,
			checked: true
		}, {
			label: 'Aprobadas',
			value: 2
		}
	];

	protected columnasTabla: any = {
		'pkTblSolicitudOrden' : '#',
		'solicitante'         : 'Solicita',
		'actividad'           : 'Actividad',
		'tipoSolicitud'       : 'Afectado',
		'fkTblOrdenServicio'  : 'Orden',
		'fechaSolicitud'      : 'Fecha'
	}

	protected datosTabla: any = [];

	protected tableConfig: any = {
		'pkTblSolicitudOrden' : {
			'action': 'solicitud',
			'emitId': true,
			'value': 'pkTblSolicitudOrden',
			'center': true
		},
		'solicitante' : {
			'selectColumn': true,
			'center': true
		},
		'actividad' : {
			'selectColumn': true,
			'center': true
		},
		'tipoSolicitud' : {
			'selectColumn': true,
			'center': true
		},
		'fkTblOrdenServicio' : {
			'selectColumn': true,
			'action': 'orden',
			'emitId': true,
			'value': 'fkTblOrdenServicio',
			'center': true
		},
		'fechaSolicitud' : {
			'center': true
		}
	};

	protected status = 0;

	private intervalo: any;

	constructor (
		private mensajes: MensajesService,
		private apiOrdenes: OrdenesService,
		private router: Router,
		private modal: ModalService
	) {}

	private obtenerSolicitudesOrdenes(): Promise<any> {
		return this.apiOrdenes.obtenerSolicitudesOrdenes(this.status).toPromise().then(
			respuesta => {
				this.datosTabla = respuesta.data.solicitudes;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private repetitiveInstruction(): void {
		this.intervalo = setInterval(async () => {
			await this.obtenerSolicitudesOrdenes();
		}, 6000);
	}

	protected selectionChange(data: any): void {
		const status = data.selectedOptions[0]?.value ?? null;

		if (status == this.status) return;

		this.mensajes.mensajeEsperar();

		clearInterval(this.intervalo);
		this.status = status;

		this.obtenerSolicitudesOrdenes().then(() => {
			this.mensajes.mensajeGenericoToast('Se obtuvieron las solicitudes de orden con éxito', 'success');
			this.repetitiveInstruction();
		});
	}
	protected actionSelected(data: any): void {
		if (data.idAccion == 'orden') {
			this.router.navigate(['/detalle-orden', data.action]);
		}

		if (data.idAccion == 'orden') {
			const solicitud = this.datosTabla.find((solicitud: any) => solicitud.pkTblSolicitudOrden == data.action);

			solicitud.type = 'past';
			
			const dataModal = {
				solicitud
			};
	
			switch (solicitud.actividad) {
				case 'actualizar':
					this.modal.abrirModalConComponente(ActualizacionOrdenComponent, dataModal, 'modal-xxl');
				break;
				default:
					this.modal.abrirModalConComponente(CambioStatusOrdenComponent, dataModal, 'lg-modal');
				break;
			}		
		}
	}
	
	ngOnDestroy(): void {
		clearInterval(this.intervalo);
	}
}