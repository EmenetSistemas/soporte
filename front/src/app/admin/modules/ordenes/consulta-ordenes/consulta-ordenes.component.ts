import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenesService } from 'src/app/admin/services/api/ordenes/ordenes.service';
import { MensajesService } from 'src/app/admin/services/mensajes/mensajes.service';

@Component({
	selector: 'app-consulta-ordenes',
	templateUrl: './consulta-ordenes.component.html',
	styleUrls: ['./consulta-ordenes.component.css']
})
export class ConsultaOrdenesComponent implements OnDestroy{
	protected statusSelect: any[] = [
		{
			label: 'Pendientes',
			value: 1,
			checked: true
		}, {
			label: 'Concluidas',
			value: 2
		}, {
			label: 'Entregadas',
			value: 3
		}, {
			label: 'Canceladas',
			value: 4
		}
	];
	protected statusSeleccionados: any[] = [];

	protected tableConfig: any = {
		'pkTblOrdenServicio' : {
			'center': true,
			'emitId': true,
			'value': 'pkTblOrdenServicio'
		},
		'cliente' : {
			'center' : true
		},
		'telefono': {
			'center' : true,
			'telefono': true
		},
		'totalEquipos': {
			'center': true
		},
		'total': {
			'moneyColumn': true,
			'center': true
		},
		'aCuenta': {
			'moneyColumn': true,
			'center': true
		},
		'fechaRegistro' : {
			'dateRange' : true,
			'center' : true
		},
		'fechaConclucion' : {
			'dateRange' : true,
			'center' : true
		},
		'fechaEntrega' : {
			'dateRange' : true,
			'center' : true
		},
		'fechaCancelacion' : {
			'dateRange' : true,
			'center' : true
		},
		'status': {
			'center': true,
			'dadges': true,
			'selectColumn': true,
			'dadgesCases': [
				{
					'text': 'Pendiente',
					'color': 'warning'
				}, {
					'text': 'Concluida',
					'color': 'primary'
				}, {
					'text': 'Entregada',
					'color': 'success'
				}, {
					'text': 'Cancelada',
					'color': 'danger'
				}
			]
		}
	};

	private columnasBase: any = {
		'pkTblOrdenServicio' : '#',
		'cliente'            : 'Cliente',
		'telefono'           : 'Telefono',
		'totalEquipos'       : 'Equipos',
		'total'              : 'Total',
		'aCuenta'            : 'A cuenta',
		'status'             : 'Status'
	}

	protected columnasTabla: any = this.columnasBase;

	protected datosTabla: any = [];

	protected status = 0;

	private intervalo: any;

	protected listaStatus: any = [
		'pendiente',
		'concluida',
		'entregada',
		'cancelada'
	];

	constructor (
		private apiOrdenes: OrdenesService,
		private mensajes: MensajesService,
		private router: Router
	) {}

	protected obtenerOrdenesServicio(status: number): Promise<any> {
		return this.apiOrdenes.obtenerOrdenesServicio(status).toPromise().then(
			respuesta => {
				this.datosTabla = respuesta.data.ordenesStatus;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private repetitiveInstruction(): void {
		this.intervalo = setInterval(async () => {
			await this.obtenerOrdenesServicio(this.status);
		}, 6000);
	}

	protected selectionChange(data: any): void {
		const status = data.selectedOptions[0]?.value ?? null;

		if (status == this.status) return;

		this.mensajes.mensajeEsperar();

		switch (status) {
			case 1:
				this.columnasTabla = {
					...this.columnasBase,
					'fechaRegistro' : 'Recepción'
				}
			break;
			case 2:
				this.columnasTabla = {
					...this.columnasBase,
					'fechaConclucion' : 'Concluida'
				}
			break;
			case 3:
				this.columnasTabla = {
					...this.columnasBase,
					'fechaEntrega' : 'Entrega'
				}
			break;
			case 4:
				this.columnasTabla = {
					...this.columnasBase,
					'fechaCancelacion' : 'Cancelada'
				}
			break;
		}

		clearInterval(this.intervalo);
		this.status = status;

		this.obtenerOrdenesServicio(this.status).then(() => {
			this.mensajes.mensajeGenericoToast('Se obtuvieron las ordenes del status seleccionado con éxito', 'success');
			this.repetitiveInstruction();
		});
	}

	protected actionSelected(data: any): void {
		this.router.navigate(['/detalle-orden', data.action]);
	}

	ngOnDestroy(): void {
		clearInterval(this.intervalo);
	}
}