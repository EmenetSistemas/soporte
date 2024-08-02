import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { MensajesService } from 'src/app/admin/services/mensajes/mensajes.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	public formLogin!: FormGroup;
	public hide: boolean = true;

	constructor(
		private fb: FormBuilder,
		private mensajes: MensajesService,
		private apiLogin: LoginService,
		private router: Router
	) {
	}

	ngOnInit(): void {
		this.crearFormLogin();

		let token = localStorage.getItem('token_soporte');
		if (token != undefined) {
			this.mensajes.mensajeEsperar();
			this.apiLogin.auth(token).toPromise().then(
				status => {
					if (status) {
						this.router.navigate(['/']);
						this.mensajes.mensajeGenerico('Al parecer ya tienes una sesión activa, si desea ingresar con otra cuenta, es necesario cerrar la sesión actual', 'info');
					} else {
						this.mensajes.cerrarMensajes();
					}
				}, error => {
					this.mensajes.mensajeGenerico('error', 'error');
				}
			)
		}
	}

	crearFormLogin(): void {
		this.formLogin = this.fb.group({
			correo: ['', [Validators.email, Validators.required]],
			password: ['', [Validators.required]]
		})
	}

	login(): void {
		this.mensajes.mensajeEsperar();

		if (this.formLogin.invalid) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta', 'info');
			return;
		}

		this.apiLogin.login(this.formLogin.value).subscribe(
			respuesta => {
				if (respuesta.status != 200) {
					this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning', respuesta.title ?? '');
					return;
				}

				localStorage.setItem('token_soporte', respuesta.data.token);
				localStorage.setItem('permisos_soporte', JSON.stringify(respuesta.data.permisos));
				this.router.navigate(['/']);
				this.mensajes.cerrarMensajes();
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

}