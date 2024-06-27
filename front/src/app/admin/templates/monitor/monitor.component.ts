import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FGenerico from 'src/shared/util/funciones-genericas';
import { OrdenComponent } from '../../modules/orden/orden.component';
import { invalidZeroValidator } from 'src/app/shared/validators/cero-validator';

@Component({
	selector: 'app-monitor',
	templateUrl: './monitor.component.html',
	styleUrls: ['./monitor.component.css']
})
export class MonitorComponent extends FGenerico implements OnInit{
	@Input() data: any = null;

	protected formMonitor!: FormGroup;
	protected checks: any[] = [
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

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormMonitor();
		if (this.data.datosEquipo) this.cargarFormularioEquipo();
	}
	
	private crearFormMonitor(): void {
		this.formMonitor = this.fb.group({
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
		this.formMonitor.value.formValid = this.formMonitor.valid;
		if (this.data.datosEquipo) {
			this.formMonitor.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		}

		const data = {
			...this.formMonitor.value,
			...this.checks.reduce((acc: any, item: any) => {
				acc[item.identificador] = item.checked;
				return acc;
			}, {})
		};

		this.parent.cacharDatosComponent(data, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formMonitor.reset();
		this.formMonitor.get('costoReparacion')?.setValue('$ 0');
		this.checks.forEach(check => check.checked = false);
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formMonitor.patchValue({
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
			{costoReparacion : this.formMonitor.value.costoReparacion},
			this.data.idItem
		);
	}
}