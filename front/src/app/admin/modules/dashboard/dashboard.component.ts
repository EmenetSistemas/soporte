import { Component, OnInit } from '@angular/core';
import { GenericoService } from '../../services/api/generico/generico.service';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
	protected opcionesEstadisticas: any[] = [
		{
			value: 'today',
			label: 'Hoy',
			checked: true
		}, {
			value: 'week',
			label: 'Esta semana'
		}, {
			value: 'month',
			label: 'Este mes'
		}, {
			value: 'year',
			label: 'Este año'
		}
	];

	protected estadisticasSeleccionadas: any[] = [];
	protected estadisticas: any = {};
	private intervalo: any;

	protected columnasTabla: any = {
		'pkTblOrdenServicio' : '#',
		'cliente'            : 'Cliente',
		'telefono'           : 'Telefono',
		'totalEquipos'       : 'Equipos',
		'status'             : 'Status',
		'dias'				 : 'Días'
	};

	protected datosTabla: any = [];

	protected tableConfig = {
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
		},
		'dias': {
			'center': true,
		}
	};

	protected equipos: any = {};

	constructor(
        private apiGenerica: GenericoService,
        private mensajes: MensajesService,
		private router: Router
    ) { }

	ngOnInit(): void {
		this.obtenerEstadisticas().then(() => {
			this.repetitiveInstruction();
		});
	}

	private repetitiveInstruction(): void {
        this.intervalo = setInterval(async () => {
            await this.obtenerEstadisticas();
        }, 6000);
    }

	private obtenerEstadisticas(): Promise<any> {
        return this.apiGenerica.obtenerEstadisticas().toPromise().then(
            respuesta => {
                this.estadisticas = respuesta.data.estadisticas;
                this.datosTabla = respuesta.data.equiposMasTiempo;
				this.equipos = respuesta.data.noEquiposPendientesEntrega;

                // this.actualizarGraficaVentasGeneralesAgrupadas();
                // this.actualizarGraficaVentasProductos();
            }, error => {
                this.mensajes.mensajeGenerico('error', 'error');
            }
        );
    }

	protected actionSelected(data: any): void {
		this.router.navigate(['/detalle-orden', data.action]);
	}

    ngOnDestroy(): void {
        clearInterval(this.intervalo);
    }
}