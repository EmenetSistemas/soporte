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
	@Input() data: any = null;

	protected formLaptop!: FormGroup;
	protected checks: any[] = [
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

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormLaptop();
		if (this.data.datosEquipo) this.cargarFormularioEquipo();
	}
	
	private crearFormLaptop(): void {
		this.formLaptop = this.fb.group({
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
		this.formLaptop.value.formValid = this.formLaptop.valid;
		if (this.data.datosEquipo) {
			this.formLaptop.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		}

		const data = {
			...this.formLaptop.value,
			...this.checks.reduce((acc: any, item: any) => {
				acc[item.identificador] = item.checked;
				return acc;
			}, {})
		};

		this.parent.cacharDatosComponent(data, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formLaptop.reset();
		this.formLaptop.get('costoReparacion')?.setValue('$ 0');
		this.checks.forEach(check => check.checked = false);
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formLaptop.patchValue({
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
			{costoReparacion : this.formLaptop.value.costoReparacion},
			this.data.idItem
		);
	}
}