import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FGenerico from 'src/shared/util/funciones-genericas';
import { OrdenComponent } from '../../modules/orden/orden.component';
import { invalidZeroValidator } from 'src/app/shared/validators/cero-validator';

@Component({
	selector: 'app-pc',
	templateUrl: './pc.component.html',
	styleUrls: ['./pc.component.css']
})
export class PcComponent extends FGenerico implements OnInit {
	@Input() data: any;

	protected formPc!: FormGroup;
	protected checks: any = [
		{
			identificador: 'botones',
			label: 'Botones'
		}, {
			identificador: 'puertoUsb',
			label: 'Puerto USB'
		}, {
			identificador: 'puertoVga',
			label: 'Puerto VGA'
		}, {
			identificador: 'puertoHdmi',
			label: 'Puerto HDMI'
		}, {
			identificador: 'displayPort',
			label: 'Display Port'
		}, {
			identificador: 'tornillos',
			label: 'Tornillos'
		}, {
			identificador: 'carcasa',
			label: 'Carcasa(Gabinete)'
		}, {
			identificador: 'unidadDeCd',
			label: 'Unidad de CD'
		}
	];

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormPc();
	}

	private crearFormPc(): void {
		this.formPc = this.fb.group({
			equipo           : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			password         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			noSerie          : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			descripcionFalla : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			observaciones    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			botones          : [false],
			puertoUsb        : [false],
			puertoVga        : [false],
			puertoHdmi       : [false],
			displayPort      : [false],
			tornillos        : [false],
			carcasa          : [false],
			unidadDeCd       : [false],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costo            : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}

	protected enviarCambios(): void {
		this.formPc.value.formValid = this.formPc.valid;
		this.parent.cacharDatosComponent(this.formPc.value, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formPc.reset();
		this.formPc.get('costo')?.setValue('$ 0');
		this.enviarCambios();
	}
}