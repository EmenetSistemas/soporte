import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenComponent } from '../../modules/orden/orden.component';
import FGenerico from 'src/shared/util/funciones-genericas';
import { invalidZeroValidator } from 'src/app/shared/validators/cero-validator';
import { laptop_checks } from 'src/app/shared/util/laptop-checks';
import { impresora_checks } from 'src/app/shared/util/impresora-checks';
import { pc_checks } from 'src/app/shared/util/pc-checks';
import { monitor_checks } from 'src/app/shared/util/monitor-checks';
import { otro_checks } from 'src/app/shared/util/otro-checks';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent extends FGenerico implements OnInit{
	@Input() data: any = null;

	protected formEquipo!: FormGroup;
	protected checks: any[] = [];

	constructor(
		private fb: FormBuilder,
		protected parent: OrdenComponent
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormEquipo();
		this.inicializarChecks();
		if (this.data.datosEquipo) this.cargarFormularioEquipo();
	}

	private inicializarChecks(): void {
		switch (this.data.itemType) {
			case 'laptop':
				this.checks = laptop_checks;
			break;
			case 'impresora':
				this.checks = impresora_checks;
			break;
			case 'pc':
				this.checks = pc_checks;
			break;
			case 'monitor':
				this.checks = monitor_checks;
			break;
			case 'otro':
				this.checks = otro_checks;
			break;
		}
	}
	
	private crearFormEquipo(): void {
		const elements: any = {
			equipo           : [null, [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			noSerie          : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			descripcionFalla : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			observaciones    : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			detalles         : [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			costoReparacion  : ['$ 0', [Validators.required, Validators.pattern('[0-9 $,.]*'), Validators.maxLength(11), invalidZeroValidator()]]
		};

		if ( this.data.itemType != 'impresora' && this.data.itemType != 'monitor' ) {
			elements.password = [null, [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]];
		}

		this.formEquipo = this.fb.group(elements);
	}
	
	protected cambioCheck(option: any): void {
		option.checked = !option.checked;
		this.enviarCambios();
	}

	protected enviarCambios(): void {
		this.formEquipo.value.formValid = this.formEquipo.valid;
		if (this.data.datosEquipo) {
			this.formEquipo.value.pkTblDetalleOrdenServicio = this.data.datosEquipo.pkTblDetalleOrdenServicio;
		}

		const data = {
			...this.formEquipo.value,
			...this.checks.reduce((acc: any, item: any) => {
				acc[item.identificador] = item.checked;
				return acc;
			}, {})
		};

		this.parent.cacharDatosComponent(data, this.data.idItem);
	}

	protected limpiarFormulario(): void {
		this.formEquipo.reset();
		this.formEquipo.get('costoReparacion')?.setValue('$ 0');
		this.checks.forEach(check => check.checked = false);
		this.enviarCambios();
	}

	// modificación componente

	private cargarFormularioEquipo(): void {
		const carga: any = {
			equipo: this.data.datosEquipo.nombre,
			noSerie: this.data.datosEquipo.noSerie,
			descripcionFalla: this.data.datosEquipo.descripcionFalla,
			observaciones: this.data.datosEquipo.observaciones,
			detalles: this.data.datosEquipo.detalles,
			costoReparacion: '$ ' + (+this.data.datosEquipo.costoReparacion).toLocaleString()
		};

		if ( this.data.itemType != 'impresora' && this.data.itemType != 'monitor' ) {
			carga.password = this.data.datosEquipo.password;
		}

		this.formEquipo.patchValue(carga);

		this.checks.forEach(check => {
			check.checked = this.data.datosEquipo[check.identificador] == 1;
		});

		this.parent.cacharDatosComponent(
			{costoReparacion : this.formEquipo.value.costoReparacion},
			this.data.idItem
		);
	}
}