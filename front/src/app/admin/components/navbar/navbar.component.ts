import { Component, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { Router } from '@angular/router';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { LoginService } from 'src/app/auth/services/login/login.service';
import { UsuariosService } from 'src/app/auth/services/usuarios/usuarios.service';
import { OrdenesService } from '../../services/api/ordenes/ordenes.service';
import { ModalService } from '../../services/modal/modal.service';
import { CambioStatusOrdenComponent } from '../modals/cambio-status-orden/cambio-status-orden.component';
import { ActualizacionOrdenComponent } from '../modals/actualizacion-orden/actualizacion-orden.component';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy{
	protected informacionUsuario: any = [];
	protected solicitudesOrdenes: any = [];

	private intervalo: any;
	
	constructor(
		private dataService: DataService,
		private apiUsuarios: UsuariosService,
		private router: Router,
		private mensajes: MensajesService,
		private apiLogin: LoginService,
		private apiOrdenes: OrdenesService,
		private modal: ModalService
	) { }

	async ngOnInit(): Promise<void> {
		this.obtenerDatosUsuarios();
	}

	private repetitiveInstruction(): void {
		this.intervalo = setInterval(async () => {
			if (this.informacionUsuario.perfil == 'Administrador') {
				await this.obtenerSolicitudesOrdenes();
			} else {
				await this.obtenerMisSolicitudesOrdenes();
			}
		}, 6000);
	}

	private obtenerDatosUsuarios(): void {
		let token = localStorage.getItem('token_soporte');
		if (token != undefined) {
			this.apiUsuarios.obtenerInformacionUsuarioPorToken(token).subscribe(
				respuesta => {
					this.informacionUsuario = respuesta[0];

					if (this.informacionUsuario.perfil == 'Administrador') {
						this.obtenerSolicitudesOrdenes().then(() => {
							this.repetitiveInstruction();
						});
					} else {
						this.obtenerMisSolicitudesOrdenes().then(() => {
							this.repetitiveInstruction();
						});
					}
				}, error => {
					localStorage.removeItem('token_soporte');
					localStorage.removeItem('permisos_soporte');
					this.router.navigate(['/login']);
					this.mensajes.mensajeGenerico('Al parecer su sesión expiró, necesita volver a iniciar sesión', 'error');
				}
			)
		}
	}

	private obtenerSolicitudesOrdenes(): Promise<any> {
		return this.apiOrdenes.obtenerSolicitudesOrdenes(1).toPromise().then(
			respuesta => {
				this.solicitudesOrdenes = respuesta.data.solicitudes;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private obtenerMisSolicitudesOrdenes(): Promise<any> {
		const token = localStorage.getItem('token_soporte');
		return this.apiOrdenes.obtenerMisSolicitudesOrdenes(1, token).toPromise().then(
			respuesta => {
				this.solicitudesOrdenes = respuesta.data.solicitudes;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected logout(): void {
		this.mensajes.mensajeConfirmacionCustom('¿Estás seguro de cerrar sesión?', 'question', 'Cerrar sesión').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();
				let token = localStorage.getItem('token_soporte');
				this.apiLogin.logout(token).subscribe(
					respuesta => {
						localStorage.removeItem('token_soporte');
						localStorage.removeItem('permisos_soporte');
						this.router.navigate(['/login']);
						this.mensajes.mensajeGenerico(respuesta.mensaje, 'info');
					},
		
					error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	protected prueba(): void {
		this.dataService.claseSidebar = this.dataService.claseSidebar == '' ? 'toggle-sidebar' : '';
	}

	protected detalleSolicitud(solicitud: any): void {
		const dataModal = {
			solicitud: solicitud
		};

		switch (solicitud.actividad) {
			case 'actualizar':
				this.modal.abrirModalConComponente(ActualizacionOrdenComponent, dataModal, 'modal-xxl');
			break;
			default:
				this.modal.abrirModalConComponente(CambioStatusOrdenComponent, dataModal, 'lg-modal');
			break;
		}
	}

	ngOnDestroy(): void {
		clearInterval(this.intervalo);
	}
}