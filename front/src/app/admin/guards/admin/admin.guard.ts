import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationStart, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MensajesService } from '../../services/mensajes/mensajes.service';
import { LoginService } from 'src/app/auth/services/login/login.service';

@Injectable({
	providedIn: 'root'
})
export class AdminGuard implements CanActivate {
	constructor(
		private router: Router,
		private mensajes: MensajesService,
		private apiLogin: LoginService
	) {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.validarToken(event.url);
			}
		});
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const url = state.url;
		return this.validarToken(url);
	}

	validarToken(url: string): any {
		if (url === '/login') {
			return true;
		}

		const token = localStorage.getItem('token_soporte');

		if (token == undefined || token == null) {
			localStorage.removeItem('token_soporte');
			localStorage.removeItem('permisos_soporte');
			this.router.navigate(['/login']);
			this.mensajes.mensajeGenerico('Para navegar dentro de SCOSM es necesario inicar sesión', 'warning');
			return false;
		}

		if (!this.validarPermisos(url)) {
			this.router.navigate(['/']);
			this.mensajes.mensajeGenerico('Al parecer no tienes permitido realizar esta acción', 'error');
			return false;
		}

		this.apiLogin.auth(token).subscribe(
			status => {
				if (status) {
					return true;
				} else {
					localStorage.removeItem('token_soporte');
					localStorage.removeItem('permisos_soporte');
					this.router.navigate(['/login']);
					this.mensajes.mensajeGenerico('Al parecer su sesión expiró, necesita volver a iniciar sesión', 'error');
					return false;
				}
			},
			error => {
				localStorage.removeItem('token_soporte');
				localStorage.removeItem('permisos_soporte');
				this.router.navigate(['/login']);
				this.mensajes.mensajeGenerico('error', 'error');
				return false;
			}
		);
	}

	private validarPermisos(url: string, retorno: boolean = true): boolean {
		const permisos: any = JSON.parse(localStorage.getItem('permisos_soporte')+'');

		if (url === '/orden' && permisos.generarOrden !== 1) {
			retorno = false;
		}

		if (url.includes('/detalle-orden/') && permisos.detalleOrden !== 1) {
			retorno = false;
		}

		return retorno;
	}
}