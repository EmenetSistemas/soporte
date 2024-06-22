import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FGenerico from 'src/shared/util/funciones-genericas';
import { OrdenComponent } from '../../modules/orden/orden.component';
import { invalidZeroValidator } from '../../../shared/validators/cero-validator';

@Component({
	selector: 'app-laptop',
	templateUrl: './laptop.component.html',
	styleUrls: ['./laptop.component.css']
})
export class LaptopComponent extends FGenerico implements OnInit{
	@Input() data: any;

	protected formLaptop!: FormGroup;
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
			identificador: 'botonEncendido',
			label: 'Botón encendido'
		}, {
			identificador: 'tornillos',
			label: 'Tornillos'
		}, {
			identificador: 'carcasa',
			label: 'Carcasa'
		}
	];

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormLaptop();
	}
	
	private crearFormLaptop(): void {
		this.formLaptop = this.fb.group({
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
			botonEncendido   : [false],
			tornillos        : [false],
			carcasa          : [false],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costo            : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}
	
	protected enviarCambios(): void {
		this.formLaptop.value.formValid = this.formLaptop.valid;
		this.parent.cacharDatosComponent(this.formLaptop.value, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formLaptop.reset();
		this.formLaptop.get('costo')?.setValue('$ 0');
		this.enviarCambios();
	}
}