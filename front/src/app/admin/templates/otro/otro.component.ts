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
	@Input() data: any;

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
}