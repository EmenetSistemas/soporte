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
	@Input() data: any = null;

	protected formPc!: FormGroup;
	protected checks: any[] = [
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

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormPc();

		if (this.data.datosEquipo) this.cargarFormularioEquipo();
	}

	private crearFormPc(): void {
		this.formPc = this.fb.group({
			equipo           : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			password         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
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
		this.formPc.value.formValid = this.formPc.valid;
		if (this.data.datosEquipo) {
			this.formPc.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		}

		const data = {
			...this.formPc.value,
			...this.checks.reduce((acc: any, item: any) => {
				acc[item.identificador] = item.checked;
				return acc;
			}, {})
		};

		this.parent.cacharDatosComponent(data, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formPc.reset();
		this.formPc.get('costoReparacion')?.setValue('$ 0');
		this.checks.forEach(check => check.checked = false);
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formPc.patchValue({
			equipo: this.data.datosEquipo.nombre,
			password: this.data.datosEquipo.password,
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
			{costoReparacion : this.formPc.value.costoReparacion},
			this.data.idItem
		);
	}
}