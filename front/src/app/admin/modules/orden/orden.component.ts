import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import FGenerico from 'src/shared/util/funciones-genericas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesService } from '../../services/api/ordenes/ordenes.service';
import { EquipoComponent } from '../../templates/equipo/equipo.component';

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

	protected detalleOrden: any = {};
	protected equiposOrden: any = [];

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
		try {
			this.crearFormCliente();
			this.route.paramMap.subscribe(params => {
				this.pkOrden = params.get('pkOrden') ?? 0;
			});
	
			if (this.pkOrden == 0) {
				this.mensajes.cerrarMensajes();
				return;
			}
			this.obtenerDetalleOrdenServicio();
		} catch (e) {
			this.router.navigate(['/']);
			this.mensajes.mensajeGenerico('No deberías intentar eso', 'error');
		}
	}

	private crearFormCliente(): void {
		this.formCliente = this.fb.group({
			cliente   : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			telefono  : [null, [Validators.required, Validators.pattern('[0-9 .]*'), Validators.maxLength(12)]],
			correo    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			direccion : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			total     : [{ value: '$ 0', disabled: true }],
			aCuenta   : ['$ 0', [Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11)]],
			restante  : [{ value: '$ 0', disabled: true }],
			nota      : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	protected addContent(itemType: string, data: any = null) {
		let componentFactory: any = this.resolver.resolveComponentFactory(EquipoComponent);

		const componentRef: any = this.container.createComponent(componentFactory);

		componentRef.instance.data = {
			idItem: this.count,
			itemType
		};

		if (data != null) componentRef.instance.data.datosEquipo = data;

		this.listaEquipos.push({ component: componentRef, pk: this.count, itemType });
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
						this.resetForm();
						this.pkOrden = respuesta.data.pkOrden;
						this.obtenerDetalleOrdenServicio().then(()=> {
							this.mensajes.mensajeGenerico(respuesta.mensaje, 'success');
						});
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	public validaListaPedientes(): boolean {
		return this.equiposOrden.filter((equipo: any) => equipo.status == 1).length > 1;
	}

	public validaListaPedientesEntregados(): boolean {
		return this.equiposOrden.filter((equipo: any) => equipo.status == 1 || equipo.status == 2).length > 1;
	}

	public validaOpcionesIndividuales(): boolean {
		return this.equiposOrden.length > 1;
	}

	// carga actualización

	private obtenerDetalleOrdenServicio(): Promise<any> {
		return this.apiOrdenes.obtenerDetalleOrdenServicio(this.pkOrden).toPromise().then(
			respuesta => {
				this.detalleOrden = respuesta.data.orden;
				this.equiposOrden = respuesta.data.detalleOrden;
				this.crearComponentesEquipos(this.equiposOrden);
		
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.router.navigate(['/']);
				this.mensajes.mensajeGenerico('No deberías intentar eso', 'error');
			}
		);
	}
	  

	private crearComponentesEquipos(equipos: any): void{
		equipos.forEach((equipo: any) => {
			this.addContent(equipo.tipoEquipo, equipo);
		});

		setTimeout(() => {
			this.cargarDatosFormularioCliente(this.detalleOrden);
		}, 100);
	}

	private cargarDatosFormularioCliente(data: any): void {
		this.formCliente.get('cliente')?.setValue(data.cliente);
		this.formCliente.get('telefono')?.setValue(data.telefono);
		this.formCliente.get('correo')?.setValue(data.correo);
		this.formCliente.get('direccion')?.setValue(data.direccion);
		this.formCliente.get('aCuenta')?.setValue('$ '+data.aCuenta);
		this.formCliente.get('nota')?.setValue(data.nota);
	}

	protected actualizarOrden(): void {
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

		const equipos = this.listaEquipos.filter(item => item.hasOwnProperty('data') && Object.keys(item.data).length > 1);

		if (!this.validaCambios() && equipos.length == 0) {
			this.mensajes.mensajeGenericoToast('No hay cambios por guardar', 'info');
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'info', 'Actualizar orden de servicio').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

				const orden = {
					...this.formCliente.value,
					equipos: equipos.map(({ component, pk, ...rest }) => rest)
				};

				if (this.pkOrden != 0) {
					orden.pkTblOrdenServicio = this.pkOrden;
				}

				this.apiOrdenes.actualizarOrdenServicio(orden).subscribe(
					respuesta => {
						this.refrescarDatos(respuesta.mensaje);
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	public refrescarDatos(mensaje: string): void {
		this.resetForm();
		this.obtenerDetalleOrdenServicio().then(()=> {
			this.mensajes.mensajeGenericoToast(mensaje, 'success');
		});
	}

	private validaCambios(): boolean {
		if (
			this.formCliente.value.cliente == this.detalleOrden.cliente &&
			this.formCliente.value.telefono == this.detalleOrden.telefono &&
			this.formCliente.value.correo == this.detalleOrden.correo &&
			this.formCliente.value.direccion == this.detalleOrden.direccion &&
			this.formCliente.value.aCuenta.replace(/[,$]/g, '').trim() == this.detalleOrden.aCuenta &&
			this.formCliente.value.nota == this.detalleOrden.nota
		) {
			return false;
		} else {
			return true;
		}
	}

	private resetForm(): void {
		this.formCliente.reset();
		this.formCliente.get('total')?.setValue('$ 0');
		this.formCliente.get('aCuenta')?.setValue('$ 0');
		this.formCliente.get('restante')?.setValue('$ 0');

		this.listaEquipos.forEach(equipo => {
			equipo.component.destroy();
		});

		this.listaEquipos = [];
		this.count = 0;
	}

	protected cancelarOrdenServicio(): void {
		this.mensajes.mensajeConfirmacionCustom(
			`¿Estás seguro de cancelar la orden de servicio?<br><br><b>Cambiará el status de la orden de servicio${this.extraMessage()} a "servicio cancelado"`,
			'question', 
			'Cancelar orden de servicio'
		).then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

				const dataCancelacion = {
					pkTblOrdenServicio: this.pkOrden
				};
		
				this.apiOrdenes.cancelarOrdenServicio(dataCancelacion).subscribe(
					respuesta => {
						this.refrescarDatos(respuesta.mensaje);
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	protected retomarOrdenServicio(): void {
		this.mensajes.mensajeConfirmacionCustom(
			`¿Estás seguro de retomar la orden de servicio?<br><br><b>Cambiará el status de la orden de servicio${this.extraMessage()} a "servicio pendiente"`,
			'question', 
			'Retomar orden de servicio'
		).then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

				this.apiOrdenes.retomarOrdenServicio(this.pkOrden).subscribe(
					respuesta => {
						this.refrescarDatos(respuesta.mensaje);
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	private extraMessage(): string {
		return this.listaEquipos.length > 1 ? ' así como de todos los equipos' : '';
	}
}