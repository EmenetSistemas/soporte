import { Component } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { Router } from '@angular/router';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { LoginService } from 'src/app/auth/services/login/login.service';
import { UsuariosService } from 'src/app/auth/services/usuarios/usuarios.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
	protected informacionUsuario : any = [];
	
	constructor(
		private dataService: DataService,
		private apiUsuarios: UsuariosService,
		private router: Router,
		private mensajes: MensajesService,
		private apiLogin: LoginService
	) { }

	async ngOnInit(): Promise<void> {
		await this.obtenerDatosUsuarios();
	}

	obtenerDatosUsuarios(): void {
		let token = localStorage.getItem('token_soporte');
		if (token != undefined) {
			this.apiUsuarios.obtenerInformacionUsuarioPorToken(token).subscribe(
				respuesta => {
					this.informacionUsuario = respuesta[0];
				}, error => {
					localStorage.removeItem('token_soporte');
					localStorage.removeItem('permisos_soporte');
					this.router.navigate(['/login']);
					this.mensajes.mensajeGenerico('Al parecer su sesión expiró, necesita volver a iniciar sesión', 'error');
				}
			)
		}
	}

	logout(): void {
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

	prueba(): void {
		this.dataService.claseSidebar = this.dataService.claseSidebar == '' ? 'toggle-sidebar' : '';
	}
}