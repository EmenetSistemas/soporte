import { AfterViewInit, Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import FGenerico from 'src/shared/util/funciones-genericas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenesService } from '../../services/api/ordenes/ordenes.service';
import { EquipoComponent } from '../../templates/equipo/equipo.component';
import { ChatbotService } from '../../services/api/chatbot/chatbot.service';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { ModalService } from '../../services/modal/modal.service';
import { ModalOrdenPdfComponent } from '../ordenes/modal-orden-pdf/modal-orden-pdf.component';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-orden',
	templateUrl: './orden.component.html',
	styleUrls: ['./orden.component.css']
})
export class OrdenComponent extends FGenerico implements OnInit, AfterViewInit {
	@Input() pkOrdenSolicitud: any = 0;
	@Input() cambiosSolicitud: any = null;
	@Input() solicitante: any = null;
	@ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

	protected permisos: any = JSON.parse(localStorage.getItem('permisos_soporte')+'');

	protected formCliente!: FormGroup;

	protected listaEquipos: any[] = [];
	protected count: number = 0;

	protected pkOrden: any = 0;

	protected detalleOrden: any = {};
	protected equiposOrden: any = [];

	public solicitudCambioCantidad: boolean = false;

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
		private router: Router,
		private apiChatbot: ChatbotService,
		protected child: SidenavComponent,
		private modal: ModalService
	) {
		super();
	}

	ngOnInit(): void {
		try {
			this.crearFormCliente();
			this.route.paramMap.subscribe(params => {
				this.pkOrden = params.get('pkOrden') ?? 0;
			});
	
			this.pkOrden = this.pkOrden == 0 ? this.pkOrdenSolicitud : this.pkOrden;

			if (this.pkOrden == 0) {
				return;
			}

			this.mensajes.mensajeEsperar();
			this.obtenerDetalleOrdenServicio();
		} catch (e) {
			this.router.navigate(['/']);
			this.mensajes.mensajeGenerico('No deberías intentar eso', 'error');
		}
	}

	ngAfterViewInit() {
		setTimeout(() => {
			const textareas = document.querySelectorAll('textarea');
			textareas.forEach((textarea: HTMLTextAreaElement) => {
				textarea.style.height = 'auto';
				textarea.style.height = `${(textarea.scrollHeight + 1)}px`;
			});
		}, 0);
	}

	private crearFormCliente(): void {
		this.formCliente = this.fb.group({
			cliente   : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			telefono  : [null, [Validators.required, Validators.pattern('[0-9 .]*'), Validators.maxLength(12)]],
			correo    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			direccion : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			total     : [{ value: '$ 0', disabled: true }],
			aCuenta   : ['$ 0', [Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11)]],
			restante  : [{ value: '$ 0', disabled: true }],
			nota      : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			codigo    : [{ value: null, disabled: true }]
		});
	}

	protected adjustTextareaHeight(event: Event): void {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = (textarea.scrollHeight+ 2) + 'px';
	}

	protected copyToClipboard(): void {
		navigator.clipboard.writeText(this.detalleOrden.codigo).then(() => {
		  this.mensajes.mensajeGenericoToast('Se copió el código en el portapapeles', 'success');
		});
	}	  

	protected addContent(itemType: string, data: any = null) {
		let componentFactory: any = this.resolver.resolveComponentFactory(EquipoComponent);

		const componentRef: any = this.container.createComponent(componentFactory);

		componentRef.instance.data = {
			idItem: this.count,
			itemType
		};

		if (data != null) {
			componentRef.instance.data.datosEquipo = data;
			componentRef.instance.data.datosCliente = {
				telefono: this.detalleOrden.telefono,
				cliente: this.detalleOrden.cliente
			};
			componentRef.instance.data.status = this.detalleOrden.status;

			if (this.pkOrdenSolicitud != 0) componentRef.instance.data.type = 'readonly';
		};

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
		let aCuenta = parseFloat((this.formCliente.value.aCuenta ?? this.detalleOrden.aCuenta).replace(/[,$]/g, ''));
		aCuenta = isNaN(aCuenta) ? 0 : aCuenta;

		if (+aCuenta > +this.obtenerTotalItems().replace(/[,$]/g, '')) {
			this.formCliente.get('aCuenta')?.setValue('$ '+((+(''+(aCuenta)).slice(0, -1)).toLocaleString()));
			this.mensajes.mensajeGenericoToast('La cantidad a cuenta no puede ser mayor al total', 'warning');
		}
	}

	protected cambioAcuenta(): void {
		let aCuenta = parseFloat((this.formCliente.value.aCuenta ?? this.detalleOrden.aCuenta).replace(/[,$]/g, ''));
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

		const aCuenta = parseFloat((this.formCliente.value.aCuenta ?? this.detalleOrden.aCuenta).replace(/[,$]/g, ''));

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

		const equipoInvalidoIndex = this.listaEquipos.findIndex(equipo => !equipo.data || (Object.keys(equipo.data).length > 1 && equipo.data?.costoReparacion == '$ 0') || (equipo.data && !equipo.data?.formValid));
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
					token: localStorage.getItem('token_soporte'),
					equipos: this.listaEquipos.map(({ component, pk, ...rest }) => rest)
				};
				
				this.apiOrdenes.registrarOrdenServicio(orden).subscribe(
					respuesta => {
						this.resetForm();
						this.pkOrden = respuesta.data.pkOrden;

						const mensaje = '🤖 Hola '+this.obtenerSaludo()+' *'+respuesta.data.cliente+'* a continuación te comparto los datos correspondientes a la orden de servicio de tus equipos para reparación en Emenet Comunicaciones 🛠️\n\n🆔 Folio de servicio: *'+respuesta.data.pkOrden+'*\n🔑 Código de entrega: *'+respuesta.data.codigo+'*\n\nEl cual es importante tener a la vista para poder recoger tus equipos una vez se encuentren listos ✅';

						this.apiChatbot.enviarMensajeTexto(respuesta.data.telefono, mensaje);
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

	protected enviarCodigo(): void {
		const telefono = this.detalleOrden.telefono;
		const mensaje = '🤖 Hola '+this.obtenerSaludo()+' *'+this.detalleOrden.cliente+'* a continuación te comparto los datos correspondientes a la orden de servicio de tus equipos para reparación en Emenet Comunicaciones 🛠️\n\n🆔 Folio de servicio: *'+this.detalleOrden.pkTblOrdenServicio+'*\n🔑 Código de entrega: *'+this.detalleOrden.codigo+'*\n\nEl cual es importante tener a la vista para poder recoger tus equipos una vez se encuentren listos ✅';

		this.apiChatbot.enviarMensajeTextoConfirmacion(telefono, mensaje, 'Reenviar código orden de servicio', '¿Está seguro de enviar de nuevo el código de la orden de servicio?');
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

	protected equiposPedientes(): number {
		return this.equiposOrden.filter((equipo: any) => equipo.status == 2 || equipo.status == 3).length;
	}

	protected equiposSinCancelar(): number {
		return this.equiposOrden.filter((equipo: any) => equipo.status != 4).length;
	}

	protected equiposCancelados(): number {
		return this.equiposOrden.filter((equipo: any) => equipo.status == 4).length;
	}

	// carga actualización

	private obtenerDetalleOrdenServicio(): Promise<any> {
		return this.apiOrdenes.obtenerDetalleOrdenServicio(this.pkOrden).toPromise().then(
			respuesta => {
				if (this.cambiosSolicitud != null) {
					respuesta.data.orden.cliente = this.cambiosSolicitud.cliente;
					respuesta.data.orden.telefono = this.cambiosSolicitud.telefono;
					respuesta.data.orden.correo = this.cambiosSolicitud.correo;
					respuesta.data.orden.direccion = this.cambiosSolicitud.direccion;
					respuesta.data.orden.aCuenta = this.cambiosSolicitud.aCuenta;
					respuesta.data.orden.nota = this.cambiosSolicitud.nota;
				
					this.cambiosSolicitud.equipos.forEach((equipo: any) => {
						const detalle = respuesta.data.detalleOrden.find((d: any) => d.pkTblDetalleOrdenServicio == equipo.data.pkTblDetalleOrdenServicio);
						if (detalle) {
							detalle.nombre = equipo.data.equipo;
							detalle.noSerie = equipo.data.noSerie;
							detalle.descripcionFalla = equipo.data.descripcionFalla;
							detalle.observaciones = equipo.data.observaciones;
							detalle.detalles = equipo.data.detalles;
							detalle.diagnosticoFinal = equipo.data.diagnosticoFinal;
							detalle.costoReparacion = equipo.data.costoReparacion;
							detalle.status = equipo.data.status;
							detalle.base = equipo.data.base ? 1 : 0;
							detalle.puertoVga = equipo.data.puertoVga ? 1 : 0;
							detalle.puertoDvi = equipo.data.puertoDvi ? 1 : 0;
							detalle.puertoHdmi = equipo.data.puertoHdmi ? 1 : 0;
							detalle.displayPort = equipo.data.displayPort ? 1 : 0;
							detalle.tornillos = equipo.data.tornillos ? 1 : 0;
							detalle.pantalla = equipo.data.pantalla ? 1 : 0;
						}
					});
				}

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
		if (this.pkOrdenSolicitud != 0 || data.status >= 3) this.formCliente.disable();

		this.formCliente.get('cliente')?.setValue(data.cliente);
		this.formCliente.get('telefono')?.setValue(data.telefono);
		this.formCliente.get('correo')?.setValue(data.correo);
		this.formCliente.get('direccion')?.setValue(data.direccion);
		this.formCliente.get('aCuenta')?.setValue('$ '+(+data.aCuenta).toLocaleString());

		let aCuenta = parseFloat((this.formCliente.value.aCuenta ?? this.detalleOrden.aCuenta).replace(/[,$]/g, ''));
		aCuenta = isNaN(aCuenta) ? 0 : aCuenta;

		if (+aCuenta > +this.obtenerTotalItems().replace(/[,$]/g, '')) {
			this.formCliente.get('aCuenta')?.setValue('$ 0');
			this.mensajes.mensajeGenericoToast('La cantidad a cuenta no puede ser mayor al total', 'warning');
		}

		this.formCliente.get('nota')?.setValue(data.nota);
		this.formCliente.get('codigo')?.setValue(data.codigo);
	}

	protected actualizarOrden(): void {
		const equipos = this.listaEquipos.filter(item => item.hasOwnProperty('data') && Object.keys(item.data).length > 1);

		if (!this.validaCambios() && equipos.length == 0) {
			this.mensajes.mensajeGenericoToast('No hay cambios por guardar', 'info');
			return;
		}

		const equipoInvalidoIndex = this.listaEquipos.findIndex(equipo => !equipo.data || (Object.keys(equipo.data).length > 1 && equipo.data?.costoReparacion == '$ 0') || (equipo.data && equipo.data?.pkTblDetalleOrdenServicio && !equipo.data?.formValid) || (equipo.data && Object.keys(equipo.data).length > 1 && !equipo.data?.formValid));
		
		if (equipoInvalidoIndex !== -1) {
			const equipoInvalido = this.listaEquipos[equipoInvalidoIndex];
			this.mensajes.mensajeGenerico(
				`Aún hay campos vacíos o que no cumplen con la estructura correcta del <b>equipo ${equipoInvalidoIndex + 1} | ${equipoInvalido.itemType}</b>`,
				'warning',
				'Los campos requeridos están marcados con un *'
			);
			return;
		}

		const orden = {
			...this.formCliente.value,
			token: localStorage.getItem('token_soporte'),
			equipos: equipos.map(({ component, pk, ...rest }) => rest)
		};

		if (this.pkOrden != 0) {
			orden.pkTblOrdenServicio = this.pkOrden;
		}

		if (this.permisos.ordenActualizar != 1 || this.solicitudCambioCantidad) {
			orden.aCuenta = parseFloat((orden.aCuenta).replace(/[,$]/g, ''));
			this.validarCambioOrden(this.solicitudCambioCantidad ? 'actualizar-cantidades' : 'actualizar', orden);
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'info', 'Actualizar orden de servicio').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

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

	public refrescarDatos(mensaje: string, status: number = 0): void {
		try {
			this.resetForm();
		} catch (e) {
			
		}
		
		this.obtenerDetalleOrdenServicio().then(()=> {
			if (status == 300) {
				this.mensajes.mensajeGenerico(mensaje, 'warning');
			} else {
				this.mensajes.mensajeGenericoToast(mensaje, 'success');
			}
		});
	}

	private validaCambios(): boolean {
		if (
			this.formCliente.value.cliente == this.detalleOrden.cliente &&
			this.formCliente.value.telefono == this.detalleOrden.telefono &&
			this.formCliente.value.correo == this.detalleOrden.correo &&
			this.formCliente.value.direccion == this.detalleOrden.direccion &&
			(this.formCliente.value.aCuenta ?? this.detalleOrden.aCuenta).replace(/[,$]/g, '').trim() == this.detalleOrden.aCuenta &&
			this.formCliente.value.nota == this.detalleOrden.nota
		) {
			return false;
		} else {
			return true;
		}
	}

	protected cancelarOrdenServicio(): void {
		const equipoInvalidoIndex = this.listaEquipos.findIndex(equipo => !equipo.data || (Object.keys(equipo.data).length > 1 && equipo.data?.costoReparacion == '$ 0') || (equipo.data && equipo.data?.pkTblDetalleOrdenServicio && Object.keys(equipo.data).length > 1) || (equipo.data && Object.keys(equipo.data).length > 1 && !equipo.data?.formValid));
		const equipos = this.listaEquipos.filter(item => item.hasOwnProperty('data') && Object.keys(item.data).length > 1);

		if (equipoInvalidoIndex !== -1 || (this.validaCambios() && equipos.length > 0)) {
			this.mensajes.mensajeGenerico('Aún tienes cambios pendientes por guardar, antes de continuar con la conclusión del servicio se recomienda actualizar la orden de servicio para no perder los mismos', 'warning', 'Cambios pendientes');
			return;
		}

		const dataCancelacion = {
			pkTblOrdenServicio: this.pkOrden,
			token: localStorage.getItem('token_soporte')
		};

		if (this.permisos.ordenCancelar != 1) {
			this.validarCambioOrden('cancelar', dataCancelacion);
			return;
		}

		this.mensajes.mensajeConfirmacionCustom(
			`¿Estás seguro de cancelar la orden de servicio?<br><br><b>Cambiará el status de la orden de servicio${this.extraMessage()} a "servicio cancelado"`,
			'question', 
			'Cancelar orden de servicio'
		).then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();
		
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
		if (this.permisos.ordenRetomar != 1) {
			this.validarCambioOrden('retomar', this.pkOrden);
			return;
		}

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

	protected concluirOrdenServicio(): void {
		const equipoInvalidoIndex = this.listaEquipos.findIndex(equipo => !equipo.data || (Object.keys(equipo.data).length > 1 && equipo.data?.costoReparacion == '$ 0') || (equipo.data && equipo.data?.pkTblDetalleOrdenServicio && Object.keys(equipo.data).length > 1) || (equipo.data && Object.keys(equipo.data).length > 1 && !equipo.data?.formValid));
		const equipos = this.listaEquipos.filter(item => item.hasOwnProperty('data') && Object.keys(item.data).length > 1);

		if (equipoInvalidoIndex !== -1 || (this.validaCambios() && equipos.length > 0)) {
			this.mensajes.mensajeGenerico('Aún tienes cambios pendientes por guardar, antes de continuar con la conclusión del servicio se recomienda actualizar la orden de servicio para no perder los mismos', 'warning', 'Cambios pendientes');
			return;
		}

		const dataConclucion = {
			pkTblOrdenServicio: this.pkOrden,
			token: localStorage.getItem('token_soporte')
		};

		if (this.permisos.ordenConcluir != 1) {
			this.validarCambioOrden('concluir', dataConclucion);
			return;
		}

		this.mensajes.mensajeConfirmacionCustom(
			`¿Estás seguro de concluir la orden de servicio?<br><br><b>Cambiará el status de la orden de servicio${this.extraMessageConclusion()} a "servicio concluido"`,
			'question', 
			'Concluir orden de servicio'
		).then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

				this.apiOrdenes.concluirOrdenServicio(dataConclucion).subscribe(
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

	private extraMessageConclusion(): string {
		return this.equiposOrden.filter((equipo: any) => equipo.status == 1).length > 1 ? ' así como de los equipos pedientes' : '';
	}

	protected xor(a: any, b: any): any {
		return ( a || b ) && !( a && b );
	}

	protected abrirModalOrdenPdf(pkOrden: number): void {
		const dataModal = {
			pkOrden
		};

		this.modal.abrirModalConComponente(ModalOrdenPdfComponent, dataModal);
	}

	public validarCambioOrden(actividad: string, data: any = null): void {
		let cargaSolicitud: any = null;

		let titulo: string = '', mensaje: string = '', confirmacion: string = '';

		switch (actividad) {
			case 'actualizar':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'orden',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};

				titulo = 'Solicitar autorización actualización';
				mensaje = '¿Estás seguro de solicitar la actualización de la orden en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar actualización';
			break;
			case 'actualizar-cantidades':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'orden',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};

				titulo = 'Solicitar autorización actualización <b>cantidades</b>';
				mensaje = '¿Estás seguro de solicitar la actualización de <b>cantidades</b> de la orden en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar actualización de <b>cantidades</b>';
			break;
			case 'concluir':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'orden',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};

				titulo = 'Solicitar autorización concluir orden';
				mensaje = '¿Estás seguro de solicitar la conclución de la orden en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar conclución de la orden';
			break;
			case 'concluir-equipo':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'equipo',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};

				titulo = 'Solicitar autorización para concluir servicio equipo';
				mensaje = '¿Estás seguro de solicitar concluir el servicio del equipo en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar concluir el servicio del equipo';
			break;
			case 'cancelar':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'orden',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};
				
				titulo = 'Solicitar autorización cancelar orden';
				mensaje = '¿Estás seguro de solicitar la cancelación de la orden en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar cancelación de la orden';
			break;
			case 'cancelar-equipo':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'equipo',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};

				titulo = 'Solicitar autorización para cancelar servicio equipo';
				mensaje = '¿Estás seguro de solicitar cancelar el servicio del equipo en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar cancelar el servicio del equipo';
			break;
			case 'retomar':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'orden',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};
				
				titulo = 'Solicitar autorización retomar orden';
				mensaje = '¿Estás seguro de solicitar retomar la orden en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar retomar la orden';
			break;
			case 'retomar-equipo':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'equipo',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};

				titulo = 'Solicitar autorización para retomar servicio equipo';
				mensaje = '¿Estás seguro de solicitar retomar el servicio del equipo en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar retomar el servicio del equipo';
			break;
			case 'eliminar-equipo':
				cargaSolicitud = {
					fkTblOrdenServicio: this.pkOrden,
					tipoSolicitud: 'equipo',
					actividad,
					data,
					token: localStorage.getItem('token_soporte')
				};

				titulo = 'Solicitar autorización para eliminar equipo';
				mensaje = '¿Estás seguro de solicitar eliminar el servicio del equipo en cuestión?';
				confirmacion = 'Se envió la solicitud para autorizar eliminar el servicio del equipo';
			break;
		}

		Swal.fire({
			title: titulo,
			html: mensaje,
			icon: 'question',
			input: 'textarea',
			inputLabel: 'Motivo:',
			inputPlaceholder: 'Agrega un motivo',
			showCancelButton: true,
			confirmButtonText: 'Enviar',
			cancelButtonText: 'Cancelar',
			buttonsStyling: false,
			allowOutsideClick: false,
			customClass: {
				confirmButton: 'order-1 btn btn-primary me-2',
				cancelButton: 'order-2 btn btn-danger',
				denyButton: 'order-3'
			},
			allowEscapeKey: false,
			inputValidator: (value): any => {
				if (!value) {
					return 'Es necesario colocar un motivo para poder continuar'
				}
			}
		}).then((result: any) => {
			if (!result.isConfirmed) return;

			this.mensajes.mensajeEsperar();

			cargaSolicitud.motivo = result.value;

			this.apiOrdenes.registrarSolicitudOrden(cargaSolicitud).subscribe(
				respuesta => {
					this.refrescarDatos(confirmacion);
				}, error => {
					this.mensajes.mensajeGenerico('error', 'error');
				}
			);
		});
	}

	public solicitarModificarCantidades(): void {
		this.solicitudCambioCantidad = !this.solicitudCambioCantidad;

		if (this.solicitudCambioCantidad) {
			this.mensajes.mensajeGenericoToast('Se solicitará autorización para modificar cantidades', 'info');
		} else {
			this.formCliente.get('aCuenta')?.setValue('$ '+this.detalleOrden.aCuenta);
			this.mensajes.cerrarMensajes();
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
		this.solicitudCambioCantidad = false;
	}
}