import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/admin/services/api/usuarios/usuarios.service';
import { MensajesService } from 'src/app/admin/services/mensajes/mensajes.service';
import { ModalService } from 'src/app/admin/services/modal/modal.service';
import { ModificarUsuarioComponent } from '../modificar-usuario/modificar-usuario.component';

@Component({
	selector: 'app-consulta-usuarios',
	templateUrl: './consulta-usuarios.component.html',
	styleUrls: ['./consulta-usuarios.component.css']
})
export class ConsultaUsuariosComponent {
	protected statusSelect: any[] = [
		{
			label: 'Activos',
			value: 1,
			checked: true
		}, {
			label: 'Inactivos',
			value: 0
		}
	];
	protected statusSeleccionados: any[] = [];

	protected columnasTabla: any = {
		'pkTblUsuario'   : '#',
		'nombreCompleto' : 'Usuario',
		'correo'         : 'Correo',
		'fechaAlta'      : 'Alta',
		'status'         : 'Status'
	}

	protected tableConfig: any = {
		'pkTblUsuario' : {
			'center': true,
			'emitId': true,
			'value': 'pkTblUsuario'
		},
		'nombreCompleto' : {
			'center': true
		},
		'correo' : {
			'center': true
		},
		'fechaAlta' : {
			'center': true
		},
		'status': {
			'center': true,
			'dadges': true,
			'selectColumn': true,
			'dadgesCases': [
				{
					'text': 'Activo',
					'color': 'success'
				}, {
					'text': 'Inactivo',
					'color': 'danger'
				}
			]
		}
	};

	protected datosTabla: any = [];

	protected status = 0;

	private intervalo: any;

	constructor (
		private apiUsuarios: UsuariosService,
		private mensajes: MensajesService,
		private modal: ModalService
	) {}

	protected obtenerListaUsuarios(status: number): Promise<any> {
		return this.apiUsuarios.obtenerListaUsuarios(status).toPromise().then(
			respuesta => {
				this.datosTabla = respuesta.data.listaUsuarios;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private repetitiveInstruction(): void {
		this.intervalo = setInterval(async () => {
			await this.obtenerListaUsuarios(this.status);
		}, 6000);
	}

	protected selectionChange(data: any): void {
		const status = data.selectedOptions[0]?.value ?? null;

		if (status == this.status) return;

		this.mensajes.mensajeEsperar();

		clearInterval(this.intervalo);
		this.status = status;

		this.obtenerListaUsuarios(this.status).then(() => {
			this.mensajes.mensajeGenericoToast('Se obtuvó la lista de usuarios en el status seleccionado con éxito', 'success');
			this.repetitiveInstruction();
		});
	}

	protected actionSelected(data: any): void {
		const dataModal = {
			pkUsuario: data.action
		};

		this.modal.abrirModalConComponente(ModificarUsuarioComponent, dataModal, 'lg-modal');
	}
}