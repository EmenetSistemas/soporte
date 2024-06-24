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
	protected checks: any = [
		{
			identificador: 'teclado',
			label: 'Teclado'
		}, {
			identificador: 'puertoUsb',
			label: 'Puerto USB'
		}, {
			identificador: 'pantalla',
			label: 'Pantalla'
		}, {
			identificador: 'bisagras',
			label: 'Bisagras'
		}, {
			identificador: 'centroDeCarga',
			label: 'Centro de carga'
		}, {
			identificador: 'padDeBotones',
			label: 'Pad de botones'
		}, {
			identificador: 'unidadDeCd',
			label: 'Unidad de CD'
		}, {
			identificador: 'puertoVga',
			label: 'Puerto VGA'
		}, {
			identificador: 'puertoHdmi',
			label: 'Puerto HDMI'
		}, {
			identificador: 'botonEncendido',
			label: 'Botón encendido'
		}, {
			identificador: 'tornillos',
			label: 'Tornillos'
		}, {
			identificador: 'carcasa',
			label: 'Carcasa'
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
			teclado          : [false],
			puertoUsb        : [false],
			pantalla         : [false],
			bisagras         : [false],
			centroDeCarga    : [false],
			padDeBotones     : [false],
			unidadDeCd       : [false],
			puertoVga        : [false],
			puertoHdmi       : [false],
			botonEncendido   : [false],
			tornillos        : [false],
			carcasa          : [false],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		});
	}
	
	protected enviarCambios(): void {
		this.formLaptop.value.formValid = this.formLaptop.valid;
		this.parent.cacharDatosComponent(this.formLaptop.value, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formLaptop.reset();
		this.formLaptop.get('costoReparacion')?.setValue('$ 0');
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		this.formLaptop.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		this.formLaptop.get('equipo')?.setValue(this.data.datosEquipo.nombre);
		this.formLaptop.get('password')?.setValue(this.data.datosEquipo.password);
		this.formLaptop.get('noSerie')?.setValue(this.data.datosEquipo.noSerie);
		this.formLaptop.get('descripcionFalla')?.setValue(this.data.datosEquipo.descripcionFalla);
		this.formLaptop.get('observaciones')?.setValue(this.data.datosEquipo.observaciones);

		this.formLaptop.get('teclado')?.setValue(this.data.datosEquipo.teclado);
		this.formLaptop.get('puertoUsb')?.setValue(this.data.datosEquipo.puertoUsb);
		this.formLaptop.get('pantalla')?.setValue(this.data.datosEquipo.pantalla);
		this.formLaptop.get('bisagras')?.setValue(this.data.datosEquipo.bisagras);
		this.formLaptop.get('centroDeCarga')?.setValue(this.data.datosEquipo.centroDeCarga);
		this.formLaptop.get('padDeBotones')?.setValue(this.data.datosEquipo.padDeBotones);
		this.formLaptop.get('unidadDeCd')?.setValue(this.data.datosEquipo.unidadDeCd);
		this.formLaptop.get('puertoVga')?.setValue(this.data.datosEquipo.puertoVga);
		this.formLaptop.get('puertoHdmi')?.setValue(this.data.datosEquipo.puertoHdmi);
		this.formLaptop.get('botonEncendido')?.setValue(this.data.datosEquipo.botonEncendido);
		this.formLaptop.get('tornillos')?.setValue(this.data.datosEquipo.tornillos);
		this.formLaptop.get('carcasa')?.setValue(this.data.datosEquipo.carcasa);

		this.formLaptop.get('detalles')?.setValue(this.data.datosEquipo.detalles);
		this.formLaptop.get('costoReparacion')?.setValue('$ '+(+this.data.datosEquipo.costoReparacion).toLocaleString());

		this.enviarCambios();
	}
}