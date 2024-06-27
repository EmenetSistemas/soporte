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
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}
	
	protected cambioCheck(option: any): void {
		option.checked = !option.checked;
		this.enviarCambios();
	}

	protected enviarCambios(): void {
		this.formOtro.value.formValid = this.formOtro.valid;
		if (this.data.datosEquipo) {
			this.formOtro.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		}

		const data = {
			...this.formOtro.value,
			...this.checks.reduce((acc: any, item: any) => {
				acc[item.identificador] = item.checked;
				return acc;
			}, {})
		};

		this.parent.cacharDatosComponent(data, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formOtro.reset();
		this.formOtro.get('costoReparacion')?.setValue('$ 0');
		this.checks.forEach(check => check.checked = false);
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formOtro.patchValue({
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
			{costoReparacion : this.formOtro.value.costoReparacion},
			this.data.idItem
		);
	}
}