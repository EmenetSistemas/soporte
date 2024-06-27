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
	@Input() data: any = null;

	protected formImpresora!: FormGroup;
	protected checks: any[] = [
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

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormImpresora();
		if (this.data.datosEquipo) this.cargarFormularioEquipo();
	}

	private crearFormImpresora(): void {
		this.formImpresora = this.fb.group({
			equipo           : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			noSerie          : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			descripcionFalla : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			observaciones    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}

	protected cambioCheck(option: any): void {
		option.checked = !option.checked;
		this.enviarCambios();
	}

	protected enviarCambios(): void {
		this.formImpresora.value.formValid = this.formImpresora.valid;
		if (this.data.datosEquipo) {
			this.formImpresora.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		}

		const data = {
			...this.formImpresora.value,
			...this.checks.reduce((acc: any, item: any) => {
				acc[item.identificador] = item.checked;
				return acc;
			}, {})
		};

		this.parent.cacharDatosComponent(data, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formImpresora.reset();
		this.formImpresora.get('costoReparacion')?.setValue('$ 0');
		this.checks.forEach(check => check.checked = false);
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formImpresora.patchValue({
			equipo: this.data.datosEquipo.nombre,
			noSerie: this.data.datosEquipo.noSerie,
			descripcionFalla: this.data.datosEquipo.descripcionFalla,
			observaciones: this.data.datosEquipo.observaciones,
			detalles: this.data.datosEquipo.detalles,
			costoReparacion: '$ ' + (+this.data.datosEquipo.costoReparacion).toLocaleString()
		});

		this.checks.forEach(check => {
			check.checked = this.data.datosEquipo[check.identificador] == 1;
		});

		this.parent.cacharDatosComponent(
			{costoReparacion : this.formImpresora.value.costoReparacion},
			this.data.idItem
		);
	}
}