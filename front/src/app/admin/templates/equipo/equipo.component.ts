import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenComponent } from '../../modules/orden/orden.component';
import FGenerico from 'src/shared/util/funciones-genericas';
import { invalidZeroValidator } from 'src/app/shared/validators/cero-validator';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { OrdenesService } from '../../services/api/ordenes/ordenes.service';
import { ChatbotService } from '../../services/api/chatbot/chatbot.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent extends FGenerico implements OnInit, AfterViewInit, OnDestroy{
	@Input() data: any = null;

	protected permisos: any = JSON.parse(localStorage.getItem('permisos_soporte')+'');

	protected formEquipo!: FormGroup;
	protected checks: any[] = [];

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent,
		private mensajes: MensajesService,
		private apiOrdenes: OrdenesService,
		private apiChatbot: ChatbotService
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormEquipo();
		this.inicializarChecks();
		this.limpiarFormulario();
		if (this.data.datosEquipo) this.cargarFormularioEquipo();
	}

	ngAfterViewInit() {
		setTimeout(() => {
			const textareas = document.querySelectorAll('textarea');
			textareas.forEach((textarea: HTMLTextAreaElement) => {
				textarea.style.height = 'auto';
				textarea.style.height = `${(textarea.scrollHeight + 2)}px`;
			});
		}, 0);
	}

	private inicializarChecks(): void {
		switch (this.data.itemType) {
			case 'laptop':
				this.checks = [
					{
						identificador: 'teclado',
						label: 'Teclado',
						checked: false
					}, {
						identificador: 'puertoUsb',
						label: 'Puerto USB',
						checked: false
					}, {
						identificador: 'pantalla',
						label: 'Pantalla',
						checked: false
					}, {
						identificador: 'bisagras',
						label: 'Bisagras',
						checked: false
					}, {
						identificador: 'centroDeCarga',
						label: 'Centro de carga',
						checked: false
					}, {
						identificador: 'padDeBotones',
						label: 'Pad de botones',
						checked: false
					}, {
						identificador: 'unidadDeCd',
						label: 'Unidad de CD',
						checked: false
					}, {
						identificador: 'puertoVga',
						label: 'Puerto VGA',
						checked: false
					}, {
						identificador: 'puertoHdmi',
						label: 'Puerto HDMI',
						checked: false
					}, {
						identificador: 'botonEncendido',
						label: 'Botón encendido',
						checked: false
					}, {
						identificador: 'tornillos',
						label: 'Tornillos',
						checked: false
					}, {
						identificador: 'carcasa',
						label: 'Carcasa',
						checked: false
					}
				];
			break;
			case 'impresora':
				this.checks = [
					{
						identificador: 'botones',
						label: 'Botones',
						checked: false
					},{
						identificador: 'puertoUsb',
						label: 'Puerto USB',
						checked: false
					},{
						identificador: 'pantalla',
						label: 'Pantalla',
						checked: false
					},{
						identificador: 'tornillos',
						label: 'Tornillos',
						checked: false
					},{
						identificador: 'carcasa',
						label: 'Carcasa',
						checked: false
					},{
						identificador: 'charolaHojas',
						label: 'Charola de hojas',
						checked: false
					},{
						identificador: 'cableCorriente',
						label: 'Cable de corriente',
						checked: false
					},{
						identificador: 'escaner',
						label: 'Escaner',
						checked: false
					},{
						identificador: 'cartuchos',
						label: 'Cartuchos',
						checked: false
					}
				];
			break;
			case 'pc':
				this.checks = [
					{
						identificador: 'botones',
						label: 'Botones',
						checked: false
					}, {
						identificador: 'puertoUsb',
						label: 'Puerto USB',
						checked: false
					}, {
						identificador: 'puertoVga',
						label: 'Puerto VGA',
						checked: false
					}, {
						identificador: 'puertoHdmi',
						label: 'Puerto HDMI',
						checked: false
					}, {
						identificador: 'displayPort',
						label: 'Display Port',
						checked: false
					}, {
						identificador: 'tornillos',
						label: 'Tornillos',
						checked: false
					}, {
						identificador: 'carcasa',
						label: 'Carcasa(Gabinete)',
						checked: false
					}, {
						identificador: 'unidadDeCd',
						label: 'Unidad de CD',
						checked: false
					}
				];
			break;
			case 'monitor':
				this.checks = [
					{
						identificador: 'base',
						label: 'Base',
						checked: false
					}, {
						identificador: 'puertoVga',
						label: 'Puerto VGA',
						checked: false
					}, {
						identificador: 'puertoDvi',
						label: 'Puerto DVI',
						checked: false
					}, {
						identificador: 'puertoHdmi',
						label: 'Puerto HDMI',
						checked: false
					}, {
						identificador: 'displayPort',
						label: 'Puerto Display Port',
						checked: false
					}, {
						identificador: 'tornillos',
						label: 'Tornillos',
						checked: false
					}, {
						identificador: 'pantalla',
						label: 'Pantalla',
						checked: false
					}
				];
			break;
			case 'otro':
				this.checks = [
					{
						identificador: 'teclado',
						label: 'Teclado',
						checked: false
					}, {
						identificador: 'puertoUsb',
						label: 'Puerto USB',
						checked: false
					}, {
						identificador: 'pantalla',
						label: 'Pantalla',
						checked: false
					}, {
						identificador: 'bisagras',
						label: 'Bisagras',
						checked: false
					}, {
						identificador: 'centroDeCarga',
						label: 'Centro de carga',
						checked: false
					}, {
						identificador: 'padDeBotones',
						label: 'Pad de botones',
						checked: false
					}, {
						identificador: 'unidadDeCd',
						label: 'Unidad de CD',
						checked: false
					}, {
						identificador: 'puertoVga',
						label: 'Puerto VGA',
						checked: false
					}, {
						identificador: 'puertoHdmi',
						label: 'Puerto HDMI',
						checked: false
					}, {
						identificador: 'puertoDvi',
						label: 'Puerto DVI',
						checked: false
					}, {
						identificador: 'displayPort',
						label: 'Display Port',
						checked: false
					}, {
						identificador: 'botonEncendido',
						label: 'Boton de encendido',
						checked: false
					}, {
						identificador: 'tornillos',
						label: 'Tornillos',
						checked: false
					}, {
						identificador: 'carcasa',
						label: 'Carcasa',
						checked: false
					}, {
						identificador: 'base',
						label: 'Base',
						checked: false
					}, {
						identificador: 'botones',
						label: 'Botones',
						checked: false
					}, {
						identificador: 'charolaHojas',
						label: 'Charola de hojas',
						checked: false
					}, {
						identificador: 'cableCorriente',
						label: 'Cable de corriente',
						checked: false
					}, {
						identificador: 'escaner',
						label: 'Escaner',
						checked: false
					}, {
						identificador: 'cartuchos',
						label: 'Cartuchos',
						checked: false
					}
				];
			break;
		}
	}
	
	private crearFormEquipo(): void {
		const elements: any = {
			equipo           : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			noSerie          : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			descripcionFalla : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			observaciones    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			diagnosticoFinal : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		};

		if ( this.data.itemType != 'impresora' && this.data.itemType != 'monitor' ) {
			elements.password = [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]];
		}

		this.formEquipo = this.fb.group(elements);

		if (!this.data.datosEquipo) this.enviarCambios();
	}

	protected adjustTextareaHeight(event: Event): void {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = (textarea.scrollHeight+ 2) + 'px';
	}

	protected canSend(): boolean {
		return this.formEquipo.value.diagnosticoFinal != null && this.formEquipo.value.diagnosticoFinal.trim() != ''
	}

	protected enviarDiagnostico(): void {
		const telefono = this.data.datosCliente.telefono;
		const mensaje = this.formEquipo.value.diagnosticoFinal;

		this.apiChatbot.enviarMensajeTextoConfirmacion(
			telefono,
			mensaje,
			'Enviar diagnóstico del equipo "'+this.data.datosEquipo.nombre+'"',
			'¿Está seguro de enviar el diagnóstico del equipo en cuestión?'
		);
	}
	
	protected cambioCheck(option: any): void {
		option.checked = !option.checked;
		this.enviarCambios();
	}

	protected enviarCambios(): void {
		const cambios: any = {...this.formEquipo.value};

		cambios.formValid = this.formEquipo.valid;

		if (this.data.datosEquipo) {
			cambios.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
			cambios.costoReparacion = this.data.datosEquipo.status != 4 ? '$ '+ (this.formEquipo.value.costoReparacion ?? this.data.datosEquipo.costoReparacion).toLocaleString() : '$ 0';
			cambios.status = this.data.datosEquipo.status;
		}

		if (cambios.costoReparacion) {
			cambios.costoReparacion = (cambios.costoReparacion).replace(/[,$]/g, '');
		}

		const data = {
			token: localStorage.getItem('token_soporte'),
			...cambios,
			...this.checks.reduce((acc: any, item: any) => {
				acc[item.identificador] = item.checked;
				return acc;
			}, {})
		};

		this.parent.cacharDatosComponent(data, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formEquipo.reset();
		this.formEquipo.get('costoReparacion')?.setValue('$ 0');
		this.checks.forEach(check => check.checked = false);
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formEquipo.get('equipo')?.setValue(this.data.datosEquipo.nombre);
		this.formEquipo.get('noSerie')?.setValue(this.data.datosEquipo.noSerie);
		this.formEquipo.get('descripcionFalla')?.setValue(this.data.datosEquipo.descripcionFalla);
		this.formEquipo.get('observaciones')?.setValue(this.data.datosEquipo.observaciones);
		this.formEquipo.get('detalles')?.setValue(this.data.datosEquipo.detalles);
		this.formEquipo.get('diagnosticoFinal')?.setValue(this.data.datosEquipo.diagnosticoFinal ?? null);
		this.formEquipo.get('costoReparacion')?.setValue('$ ' + (+this.data.datosEquipo.costoReparacion).toLocaleString());

		if ( this.data.itemType != 'impresora' && this.data.itemType != 'monitor' ) {
			this.formEquipo.get('password')?.setValue(this.data.datosEquipo.password);
		}

		this.checks.forEach(check => {
			check.checked = this.data.datosEquipo[check.identificador] == 1;
		});

		if (this.data.type == 'readonly' || this.data.status >= 3 || this.data.datosEquipo.status == 4) this.formEquipo.disable();

		this.parent.cacharDatosComponent(
			{costoReparacion : this.data.datosEquipo.status != 4 ? this.formEquipo.value.costoReparacion : '$ 0'},
			this.data.idItem
		);
	}

	protected cambioStatusServicio(tipoCambio: string, status: number): void {
		const statusList = [
			'pendiente',
			'concluido',
			'entregado',
			'cancelado'
		];

		const data = {
			pkTblDetalleOrdenServicio: this.data.datosEquipo.pkTblDetalleOrdenServicio,
			token: localStorage.getItem('token_soporte'),
			status
		};

		if (status == 1 && this.permisos.ordenRetomar != 1) {
			this.parent.validarCambioOrden('retomar-equipo', data);
			return;
		}

		if (status == 2 && this.permisos.ordenConcluir != 1) {
			this.parent.validarCambioOrden('concluir-equipo', data);
			return;
		}

		if (status == 4 && this.permisos.ordenCancelar != 1) {
			this.parent.validarCambioOrden('cancelar-equipo', data);
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('¿Estás seguro cambiar el status del equipo en cuestión a "'+statusList[status-1]+'"?', 'question', tipoCambio+' servicio equipo "'+this.data.datosEquipo.nombre+'"').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

				this.apiOrdenes.cambioStatusServicio(data).subscribe(
					respuesta => {
						this.parent.refrescarDatos(respuesta.mensaje, respuesta.status);
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	protected eliminarEquipoOrden(): void {
		const dataEliminacion = {
			token: localStorage.getItem('token_soporte'),
			pkTblDetalleOrdenServicio: this.data.datosEquipo.pkTblDetalleOrdenServicio
		};

		if (this.permisos.ordenEliminar != 1) {
			this.parent.validarCambioOrden('eliminar-equipo', dataEliminacion);
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('¿Estás seguro de eliminar el equipo en cuestión de la orden de servicio?', 'question', 'Eliminar equipo "'+this.data.datosEquipo.nombre+'" de orden de servicio').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

				this.apiOrdenes.eliminarEquipoOrden(dataEliminacion).subscribe(
					respuesta => {
						this.parent.refrescarDatos(respuesta.mensaje, respuesta.status);
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	protected solicitarModificarCantidades(): void {
		this.parent.solicitarModificarCantidades();

		if (!this.parent.solicitudCambioCantidad) this.formEquipo.get('costoReparacion')?.setValue('$ ' + (+this.data.datosEquipo.costoReparacion).toLocaleString());
	}

	ngOnDestroy(): void {
		this.limpiarFormulario();
	}
}