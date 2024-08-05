import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/admin/services/api/usuarios/usuarios.service';
import { MensajesService } from 'src/app/admin/services/mensajes/mensajes.service';
import { ModalService } from 'src/app/admin/services/modal/modal.service';
import { ModificarUsuarioComponent } from '../modificar-usuario/modificar-usuario.component';
import { UsuariosService as UsuariosServiceAuth } from 'src/app/auth/services/usuarios/usuarios.service';

@Component({
	selector: 'app-consulta-usuarios',
	templateUrl: './consulta-usuarios.component.html',
	styleUrls: ['./consulta-usuarios.component.css']
})
export class ConsultaUsuariosComponent implements OnInit{
	protected permisos: any = JSON.parse(localStorage.getItem('permisos_soporte')+'');

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
		'status'         : 'Status',
		'linea'          : 'Línea'
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
					'color': 'primary'
				}, {
					'text': 'Inactivo',
					'color': 'warning'
				}
			]
		},
		'linea': {
			'center': true,
			'linea': true,
			'noFilter': true
		}
	};

	protected datosTabla: any = [];

	protected status = 0;

	private intervalo: any;

	private informacionPerfil: any;

	constructor (
		private apiUsuarios: UsuariosService,
		private mensajes: MensajesService,
		private modal: ModalService,
		private apiAuth: UsuariosServiceAuth
	) {}
	
	ngOnInit(): void {
		this.obtenerDetallePerfilPorToken();
	}

	protected obtenerListaUsuarios(status: number): Promise<any> {
		const tipo = this.permisos.perfil == 'Superadministrador' ? 'complex' : 'simple';

		return this.apiUsuarios.obtenerListaUsuarios(status, tipo).toPromise().then(
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

	private obtenerDetallePerfilPorToken(): Promise<any> {
		return this.apiAuth.obtenerInformacionUsuarioPorToken(localStorage.getItem('token_soporte')).toPromise().then(
			respuesta => {
				this.informacionPerfil = respuesta[0];
			},
			error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		)
	}

	protected actionSelected(data: any): void {
		if (this.informacionPerfil.pkTblUsuario == data.action) {
			this.mensajes.mensajeGenericoToast('Sesión actual', 'info');
			return;
		}

		const dataModal = {
			pkUsuario: data.action
		};

		this.modal.abrirModalConComponente(ModificarUsuarioComponent, dataModal, 'lg-modal');
	}
}