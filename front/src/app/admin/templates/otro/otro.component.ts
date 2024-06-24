import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FGenerico from 'src/shared/util/funciones-genericas';
import { OrdenComponent } from '../../modules/orden/orden.component';
import { invalidZeroValidator } from 'src/app/shared/validators/cero-validator';

@Component({
	selector: 'app-otro',
	templateUrl: './otro.component.html',
	styleUrls: ['./otro.component.css']
})
export class OtroComponent extends FGenerico {
	@Input() data: any = null;

	protected formOtro!: FormGroup;
	protected checks: any = [
		{
			identificador: 'teclado',
			label: 'Teclado'
		}, {
			identificador: 'puertoUsb',
			label: 'Puerto USB'
		}, {
			identificador: 'pantalla',
			label: 'Pantalla'
		}, {
			identificador: 'bisagras',
			label: 'Bisagras'
		}, {
			identificador: 'centroDeCarga',
			label: 'Centro de carga'
		}, {
			identificador: 'padDeBotones',
			label: 'Pad de botones'
		}, {
			identificador: 'unidadDeCd',
			label: 'Unidad de CD'
		}, {
			identificador: 'puertoVga',
			label: 'Puerto VGA'
		}, {
			identificador: 'puertoHdmi',
			label: 'Puerto HDMI'
		}, {
			identificador: 'puertoDvi',
			label: 'Puerto DVI'
		}, {
			identificador: 'displayPort',
			label: 'Display Port'
		}, {
			identificador: 'botonEncendido',
			label: 'Boton de encendido'
		}, {
			identificador: 'tornillos',
			label: 'Tornillos'
		}, {
			identificador: 'carcasa',
			label: 'Carcasa'
		}, {
			identificador: 'base',
			label: 'Base'
		}, {
			identificador: 'botones',
			label: 'Botones'
		}, {
			identificador: 'charolaHojas',
			label: 'Charola de hojas'
		}, {
			identificador: 'cableCorriente',
			label: 'Cable de corriente'
		}, {
			identificador: 'escaner',
			label: 'Escaner'
		}, {
			identificador: 'cartuchos',
			label: 'Cartuchos'
		}
	];

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormOtro();

		if (this.data.datosEquipo) this.cargarFormularioEquipo();
	}
	
	private crearFormOtro(): void {
		this.formOtro = this.fb.group({
			equipo           : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			password         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			noSerie          : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			descripcionFalla : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			observaciones    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			teclado          : [false],
			puertoUsb        : [false],
			pantalla         : [false],
			bisagras         : [false],
			centroDeCarga    : [false],
			padDeBotones     : [false],
			unidadDeCd       : [false],
			puertoVga        : [false],
			puertoHdmi       : [false],
			puertoDvi        : [false],
			displayPort      : [false],
			botonEncendido   : [false],
			tornillos        : [false],
			carcasa          : [false],
			base             : [false],
			botones          : [false],
			charolaHojas     : [false],
			cableCorriente   : [false],
			escaner          : [false],
			cartuchos        : [false],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}
	
	protected enviarCambios(): void {
		this.formOtro.value.formValid = this.formOtro.valid;
		this.parent.cacharDatosComponent(this.formOtro.value, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formOtro.reset();
		this.formOtro.get('costoReparacion')?.setValue('$ 0');
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formOtro.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		this.formOtro.get('equipo')?.setValue(this.data.datosEquipo.nombre);
		this.formOtro.get('password')?.setValue(this.data.datosEquipo.password);
		this.formOtro.get('noSerie')?.setValue(this.data.datosEquipo.noSerie);
		this.formOtro.get('descripcionFalla')?.setValue(this.data.datosEquipo.descripcionFalla);
		this.formOtro.get('observaciones')?.setValue(this.data.datosEquipo.observaciones);

		this.formOtro.get('teclado')?.setValue(this.data.datosEquipo.teclado);
		this.formOtro.get('puertoUsb')?.setValue(this.data.datosEquipo.puertoUsb);
		this.formOtro.get('pantalla')?.setValue(this.data.datosEquipo.pantalla);
		this.formOtro.get('bisagras')?.setValue(this.data.datosEquipo.bisagras);
		this.formOtro.get('centroDeCarga')?.setValue(this.data.datosEquipo.centroDeCarga);
		this.formOtro.get('padDeBotones')?.setValue(this.data.datosEquipo.padDeBotones);
		this.formOtro.get('unidadDeCd')?.setValue(this.data.datosEquipo.unidadDeCd);
		this.formOtro.get('puertoVga')?.setValue(this.data.datosEquipo.puertoVga);
		this.formOtro.get('puertoHdmi')?.setValue(this.data.datosEquipo.puertoHdmi);
		this.formOtro.get('puertoDvi')?.setValue(this.data.datosEquipo.puertoDvi);
		this.formOtro.get('displayPort')?.setValue(this.data.datosEquipo.displayPort);
		this.formOtro.get('botonEncendido')?.setValue(this.data.datosEquipo.botonEncendido);
		this.formOtro.get('tornillos')?.setValue(this.data.datosEquipo.tornillos);
		this.formOtro.get('carcasa')?.setValue(this.data.datosEquipo.carcasa);
		this.formOtro.get('base')?.setValue(this.data.datosEquipo.base);
		this.formOtro.get('botones')?.setValue(this.data.datosEquipo.botones);
		this.formOtro.get('charolaHojas')?.setValue(this.data.datosEquipo.charolaHojas);
		this.formOtro.get('cableCorriente')?.setValue(this.data.datosEquipo.cableCorriente);
		this.formOtro.get('escaner')?.setValue(this.data.datosEquipo.escaner);
		this.formOtro.get('cartuchos')?.setValue(this.data.datosEquipo.cartuchos);

		this.formOtro.get('detalles')?.setValue(this.data.datosEquipo.detalles);
		this.formOtro.get('costoReparacion')?.setValue('$ '+(+this.data.datosEquipo.costoReparacion).toLocaleString());

		this.enviarCambios();
	}
}