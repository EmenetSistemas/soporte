import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FGenerico from 'src/shared/util/funciones-genericas';
import { OrdenComponent } from '../../modules/orden/orden.component';
import { invalidZeroValidator } from 'src/app/shared/validators/cero-validator';

@Component({
	selector: 'app-impresora',
	templateUrl: './impresora.component.html',
	styleUrls: ['./impresora.component.css']
})
export class ImpresoraComponent extends FGenerico implements OnInit{
	@Input() data: any;

	protected formImpresora!: FormGroup;
	protected checks: any = [
		{
			identificador: 'botones',
			label: 'Botones'
		},{
			identificador: 'puertoUsb',
			label: 'Puerto USB'
		},{
			identificador: 'pantalla',
			label: 'Pantalla'
		},{
			identificador: 'tornillos',
			label: 'Tornillos'
		},{
			identificador: 'carcasa',
			label: 'Carcasa'
		},{
			identificador: 'charolaHojas',
			label: 'Charola de hojas'
		},{
			identificador: 'cableCorriente',
			label: 'Cable de corriente'
		},{
			identificador: 'escaner',
			label: 'Escaner'
		},{
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
		this.crearFormImpresora();
	}

	private crearFormImpresora(): void {
		this.formImpresora = this.fb.group({
			equipo           : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			noSerie          : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			descripcionFalla : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			observaciones    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			botones          : [false],
			puertoUsb        : [false],
			pantalla         : [false],
			tornillos        : [false],
			carcasa          : [false],
			charolaHojas     : [false],
			cableCorriente   : [false],
			escaner          : [false],
			cartuchos        : [false],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}

	protected enviarCambios(): void {
		this.formImpresora.value.formValid = this.formImpresora.valid;
		this.parent.cacharDatosComponent(this.formImpresora.value, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formImpresora.reset();
		this.formImpresora.get('costoReparacion')?.setValue('$ 0');
		this.enviarCambios();
	}
}