import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import FGenerico from 'src/shared/util/funciones-genericas';
import { LaptopComponent } from '../../templates/laptop/laptop.component';
import { ImpresoraComponent } from '../../templates/impresora/impresora.component';
import { PcComponent } from '../../templates/pc/pc.component';
import { MonitorComponent } from '../../templates/monitor/monitor.component';
import { OtroComponent } from '../../templates/otro/otro.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesService } from '../../services/api/ordenes/ordenes.service';

@Component({
	selector: 'app-orden',
	templateUrl: './orden.component.html',
	styleUrls: ['./orden.component.css']
})
export class OrdenComponent extends FGenerico implements OnInit {
	@ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

	protected formCliente!: FormGroup;

	protected listaEquipos: any[] = [];
	protected count: number = 0;

	protected pkOrden: any = 0;
	protected mensajeEsp: string = '';

	protected detalleOrden: any = {};

	protected status: any = [
		'pendiente',
		'concluida',
		'entregada',
		'cancelada'
	];

	constructor(
		private fb: FormBuilder,
		private resolver: ComponentFactoryResolver,
		private mensajes: MensajesService,
		private route: ActivatedRoute,
		private apiOrdenes: OrdenesService,
		private router: Router
	) {
		super();
	}

	ngOnInit(): void {
		this.mensajes.mensajeEsperar();
		this.crearFormCliente();
		this.route.paramMap.subscribe(params => {
			this.pkOrden = params.get('pkOrden') ?? 0;
			this.mensajeEsp = params.get('msj') && params.get('msj') == 'msj' ? 'Se registró la orden de servicio con éxito' : '';
		});

		if (this.pkOrden == 0) {
			this.mensajes.cerrarMensajes();
			return;
		}
		this.obtenerDetalleOrdenServicio();
	}

	private crearFormCliente(): void {
		this.formCliente = this.fb.group({
			cliente    : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			telefono  : [null, [Validators.required, Validators.pattern('[0-9 .]*'), Validators.maxLength(12)]],
			correo    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			direccion : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			total     : [{ value: '$ 0', disabled: true }],
			aCuenta   : ['$ 0', [Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11)]],
			restante  : [{ value: '$ 0', disabled: true }],
			nota      : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	protected addContent(type: string, data: any = null) {
		let componentFactory: any;

		switch (type) {
			case 'laptop':
				componentFactory = this.resolver.resolveComponentFactory(LaptopComponent);
			break;
			case 'impresora':
				componentFactory = this.resolver.resolveComponentFactory(ImpresoraComponent);
			break;
			case 'pc':
				componentFactory = this.resolver.resolveComponentFactory(PcComponent);
			break;
			case 'monitor':
				componentFactory = this.resolver.resolveComponentFactory(MonitorComponent);
			break;
			case 'otro':
				componentFactory = this.resolver.resolveComponentFactory(OtroComponent);
			break;
		}

		const componentRef: any = this.container.createComponent(componentFactory);

		componentRef.instance.data = {
			idItem: this.count
		};

		if (data != null) componentRef.instance.data.datosEquipo = data;

		this.listaEquipos.push({ component: componentRef, pk: this.count, itemType: type });
		this.count += 1;
	}

	public cacharDatosComponent(dataFormComponent: any, pk: number): void {
		const componente = this.listaEquipos.find(item => item.pk === pk);
		componente.data = dataFormComponent;
		this.cambioAcuenta();
	}

	protected obtenerTotalItems(): string {
		const total = this.listaEquipos.reduce((total, item) => {
			const cost = parseFloat(item.data?.costoReparacion.replace(/[,$]/g, '') ?? 0);
			return total + (isNaN(cost) ? 0 : cost);
		}, 0);

		return '$ '+total.toLocaleString();
	}

	protected writeACuenta(): void {
		let aCuenta = parseFloat(this.formCliente.value.aCuenta.replace(/[,$]/g, ''));
		aCuenta = isNaN(aCuenta) ? 0 : aCuenta;

		if (+aCuenta > +this.obtenerTotalItems().replace(/[,$]/g, '')) {
			this.formCliente.get('aCuenta')?.setValue('$ '+((+(''+(aCuenta)).slice(0, -1)).toLocaleString()));
			this.mensajes.mensajeGenericoToast('La cantidad a cuenta no puede ser mayor al total', 'warning');
		}
	}

	protected cambioAcuenta(): void {
		let aCuenta = parseFloat(this.formCliente.value.aCuenta.replace(/[,$]/g, ''));
		aCuenta = isNaN(aCuenta) ? 0 : aCuenta;

		if (+aCuenta > +this.obtenerTotalItems().replace(/[,$]/g, '')) {
			this.formCliente.get('aCuenta')?.setValue('$ 0');
		}
	}

	protected obtenerRestanteItems(): string {
		const total = this.listaEquipos.reduce((total, item) => {
			const cost = parseFloat(item.data?.costoReparacion.replace(/[,$]/g, '') ?? 0);
			return total + (isNaN(cost) ? 0 : cost);
		}, 0);

		const aCuenta = parseFloat(this.formCliente.value.aCuenta.replace(/[,$]/g, ''));

		return '$ '+(total - (isNaN(aCuenta) ? 0 : aCuenta)).toLocaleString();
	}

	public removeContent(index: number) {
		const componentRef = this.listaEquipos.find(item => item.pk === index).component;
		componentRef.destroy();
		this.listaEquipos = this.listaEquipos.filter(item => item.pk !== index);
		this.cambioAcuenta();
	}

	protected generarOrden(): void {
		if ( this.formCliente.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la <b>Información del cliente<b>', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		const equipoInvalidoIndex = this.listaEquipos.findIndex(equipo => !equipo.data || equipo.data?.costoReparacion == '$ 0');
		if (equipoInvalidoIndex !== -1) {
			const equipoInvalido = this.listaEquipos[equipoInvalidoIndex];
			this.mensajes.mensajeGenerico(
				`Aún hay campos vacíos o que no cumplen con la estructura correcta del <b>equipo ${equipoInvalidoIndex + 1} | ${equipoInvalido.itemType}</b>`,
				'warning',
				'Los campos requeridos están marcados con un *'
			);
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'info', 'Registrar orden de servicio').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

				const orden = {
					...this.formCliente.value,
					equipos: this.listaEquipos.map(({ component, pk, ...rest }) => rest)
				};
				
				this.apiOrdenes.registrarOrdenServicio(orden).subscribe(
					respuesta => {
						this.router.navigate(['/detalle-orden', respuesta.data.pkOrden, 'msj']);
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	// carga actualización

	private obtenerDetalleOrdenServicio(): Promise<any> {
		return this.apiOrdenes.obtenerDetalleOrdenServicio(this.pkOrden).toPromise().then(
			respuesta => {
				this.detalleOrden = respuesta.data.orden;

				this.crearComponentesEquipos(respuesta.data.detalleOrden);
				this.cargarDatosFormularioCliente(this.detalleOrden);

				if (this.mensajeEsp != '') {
					this.mensajes.mensajeGenerico(this.mensajeEsp, 'success');
				} else {
					this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
				}
			}, error => {
				this.router.navigate(['/']);
				this.mensajes.mensajeGenerico('No deberías intentar eso', 'error');
			}
		);
	}

	private crearComponentesEquipos(equipos: any): void {
		equipos.forEach((equipo: any) => {
			this.addContent(equipo.tipoEquipo, equipo);
		});
	}

	private cargarDatosFormularioCliente(data: any): void {
		this.formCliente.get('cliente')?.setValue(data.cliente);
		this.formCliente.get('telefono')?.setValue(data.telefono);
		this.formCliente.get('correo')?.setValue(data.correo);
		this.formCliente.get('direccion')?.setValue(data.direccion);
		this.formCliente.get('aCuenta')?.setValue('$ '+(+data.aCuenta).toLocaleString());
		this.formCliente.get('nota')?.setValue(data.nota);
	}
}