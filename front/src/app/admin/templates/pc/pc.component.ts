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

		if (this.data.datosEquipo) this.cargarFormularioEquipo();
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
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}

	protected enviarCambios(): void {
		this.formPc.value.formValid = this.formPc.valid;
		this.parent.cacharDatosComponent(this.formPc.value, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formPc.reset();
		this.formPc.get('costoReparacion')?.setValue('$ 0');
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formPc.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		this.formPc.get('equipo')?.setValue(this.data.datosEquipo.nombre);
		this.formPc.get('password')?.setValue(this.data.datosEquipo.password);
		this.formPc.get('noSerie')?.setValue(this.data.datosEquipo.noSerie);
		this.formPc.get('descripcionFalla')?.setValue(this.data.datosEquipo.descripcionFalla);
		this.formPc.get('observaciones')?.setValue(this.data.datosEquipo.observaciones);

		this.formPc.get('botones')?.setValue(this.data.datosEquipo.botones);
		this.formPc.get('puertoUsb')?.setValue(this.data.datosEquipo.puertoUsb);
		this.formPc.get('puertoVga')?.setValue(this.data.datosEquipo.puertoVga);
		this.formPc.get('puertoHdmi')?.setValue(this.data.datosEquipo.puertoHdmi);
		this.formPc.get('displayPort')?.setValue(this.data.datosEquipo.displayPort);
		this.formPc.get('tornillos')?.setValue(this.data.datosEquipo.tornillos);
		this.formPc.get('carcasa')?.setValue(this.data.datosEquipo.carcasa);
		this.formPc.get('unidadDeCd')?.setValue(this.data.datosEquipo.unidadDeCd);
		
		this.formPc.get('detalles')?.setValue(this.data.datosEquipo.detalles);
		this.formPc.get('costoReparacion')?.setValue('$ '+(+this.data.datosEquipo.costoReparacion).toLocaleString());

		this.enviarCambios();
	}
}