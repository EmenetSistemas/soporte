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
	@Input() data: any;

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
			costo            : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}
	
	protected enviarCambios(): void {
		this.formMonitor.value.formValid = this.formMonitor.valid;
		this.parent.cacharDatosComponent(this.formMonitor.value, this.data);
	}

	protected limpiarFormulario(): void {
		this.formMonitor.reset();
		this.formMonitor.get('costo')?.setValue('$ 0');
		this.enviarCambios();
	}
}