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
	protected checks: any = [
		{
			identificador: 'base',
			label: 'Base'
		}, {
			identificador: 'puertoVga',
			label: 'Puerto VGA'
		}, {
			identificador: 'puertoDvi',
			label: 'Puerto DVI'
		}, {
			identificador: 'puertoHdmi',
			label: 'Puerto HDMI'
		}, {
			identificador: 'displayPort',
			label: 'Puerto Display Port'
		}, {
			identificador: 'tornillos',
			label: 'Tornillos'
		}, {
			identificador: 'pantalla',
			label: 'Pantalla'
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
			base             : [false],
			puertoVga        : [false],
			puertoDvi        : [false],
			puertoHdmi       : [false],
			displayPort      : [false],
			tornillos        : [false],
			pantalla         : [false],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}
	
	protected enviarCambios(): void {
		this.formMonitor.value.formValid = this.formMonitor.valid;
		this.parent.cacharDatosComponent(this.formMonitor.value, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formMonitor.reset();
		this.formMonitor.get('costoReparacion')?.setValue('$ 0');
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formMonitor.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		this.formMonitor.get('equipo')?.setValue(this.data.datosEquipo.nombre);
		this.formMonitor.get('noSerie')?.setValue(this.data.datosEquipo.noSerie);
		this.formMonitor.get('descripcionFalla')?.setValue(this.data.datosEquipo.descripcionFalla);
		this.formMonitor.get('observaciones')?.setValue(this.data.datosEquipo.observaciones);

		this.formMonitor.get('base')?.setValue(this.data.datosEquipo.base);
		this.formMonitor.get('puertoVga')?.setValue(this.data.datosEquipo.puertoVga);
		this.formMonitor.get('puertoDvi')?.setValue(this.data.datosEquipo.puertoDvi);
		this.formMonitor.get('puertoHdmi')?.setValue(this.data.datosEquipo.puertoHdmi);
		this.formMonitor.get('displayPort')?.setValue(this.data.datosEquipo.displayPort);
		this.formMonitor.get('tornillos')?.setValue(this.data.datosEquipo.tornillos);
		this.formMonitor.get('pantalla')?.setValue(this.data.datosEquipo.pantalla);
		
		this.formMonitor.get('detalles')?.setValue(this.data.datosEquipo.detalles);
		this.formMonitor.get('costoReparacion')?.setValue('$ '+(+this.data.datosEquipo.costoReparacion).toLocaleString());

		this.enviarCambios();
	}
}