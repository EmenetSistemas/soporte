import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import FGenerico from 'src/shared/util/funciones-genericas';
import { LaptopComponent } from '../../templates/laptop/laptop.component';
import { ImpresoraComponent } from '../../templates/impresora/impresora.component';
import { PcComponent } from '../../templates/pc/pc.component';
import { MonitorComponent } from '../../templates/monitor/monitor.component';
import { OtroComponent } from '../../templates/otro/otro.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from '../../services/api/ordenes/ordenes.service';

@Component({
	selector: 'app-orden',
	templateUrl: './orden.component.html',
	styleUrls: ['./orden.component.css']
})
export class OrdenComponent extends FGenerico implements OnInit {
	@ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

	protected formCliente!: FormGroup;

	protected contentList: any[] = [];
	protected count: number = 0;

	protected pkOrden: any = 0;
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
		private apiOrdenes: OrdenesService
	) {
		super();
	}

	ngOnInit(): void {
		this.mensajes.mensajeEsperar();
		this.crearFormCliente();
		this.route.paramMap.subscribe(params => {
			this.pkOrden = params.get('pkOrden') ?? 0;
		});

		if (this.pkOrden == 0) {
			this.mensajes.cerrarMensajes();
			return;
		}
		this.obtenerDetalleOrdenServicio();
	}

	private crearFormCliente(): void {
		this.formCliente = this.fb.group({
			nombre    : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			telefono  : [null, [Validators.required, Validators.pattern('[0-9 .]*')]],
			correo    : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			direccion : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			total     : [{ value: '$ 0', disabled: true }],
			aCuenta   : ['$ 0', [Validators.pattern('[0-9 ,.]*'), Validators.maxLength(11)]],
			restante  : [{ value: '$ 0', disabled: true }],
			nota      : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
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

		this.contentList.push({ component: componentRef, pk: this.count, itemType: type });
		this.count += 1;
	}

	public cacharDatosComponent(dataFormComponent: any, pk: number): void {
		const componente = this.contentList.find(item => item.pk === pk);
		componente.data = dataFormComponent;
		this.cambioAcuenta();
	}

	protected obtenerTotalItems(): string {
		const total = this.contentList.reduce((total, item) => {
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
		const total = this.contentList.reduce((total, item) => {
			const cost = parseFloat(item.data?.costoReparacion.replace(/[,$]/g, '') ?? 0);
			return total + (isNaN(cost) ? 0 : cost);
		}, 0);

		const aCuenta = parseFloat(this.formCliente.value.aCuenta.replace(/[,$]/g, ''));

		return '$ '+(total - (isNaN(aCuenta) ? 0 : aCuenta)).toLocaleString();
	}

	public removeContent(index: number) {
		const componentRef = this.contentList.find(item => item.pk === index).component;
		componentRef.destroy();
		this.contentList = this.contentList.filter(item => item.pk !== index);
		this.cambioAcuenta();
	}

	// carga actualización

	private obtenerDetalleOrdenServicio(): Promise<any> {
		return this.apiOrdenes.obtenerDetalleOrdenServicio(this.pkOrden).toPromise().then(
			respuesta => {
				this.detalleOrden = respuesta.data.orden;
				this.crearComponentesEquipos(respuesta.data.detalleOrden);
				this.cargarDatosFormularioCliente(this.detalleOrden);
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private crearComponentesEquipos(equipos: any): void {
		equipos.forEach((equipo: any) => {
			this.addContent(equipo.tipoEquipo, equipo);
		});
	}

	private cargarDatosFormularioCliente(data: any): void {
		this.formCliente.get('nombre')?.setValue(data.cliente);
		this.formCliente.get('telefono')?.setValue(data.telefono);
		this.formCliente.get('correo')?.setValue(data.correo);
		this.formCliente.get('direccion')?.setValue(data.direccion);
		this.formCliente.get('aCuenta')?.setValue('$ '+(+data.aCuenta).toLocaleString());
		this.formCliente.get('nota')?.setValue(data.nota);
	}
}