import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/admin/services/mensajes/mensajes.service';
import { LoginService } from 'src/app/auth/services/login/login.service';

@Component({
	selector: 'app-invalid-route',
	templateUrl: './invalid-route.component.html',
	styleUrls: ['./invalid-route.component.css']
})
export class InvalidRouteComponent implements AfterViewInit {
	constructor(
		private mensajes: MensajesService,
		private apiLogin: LoginService,
		private router: Router
	) { }

	ngAfterViewInit(): void {
		this.mensajes.mensajeEsperar();
		let token = localStorage.getItem('token_soporte');
		if (token != undefined) {
			this.apiLogin.auth(token).subscribe(
				status => {
					if (status) {
						this.router.navigate(['/']);
					} else {
						localStorage.removeItem('token_soporte');
						localStorage.removeItem('permisos_soporte');
						this.router.navigate(['/login']);
					}
				},

				error => {
					this.router.navigate(['/login']);
				}
			);

		} else {
			this.router.navigate(['/']);
		}

		this.mensajes.mensajeGenerico('No deberías intentar eso .-.', 'error');
	}
}