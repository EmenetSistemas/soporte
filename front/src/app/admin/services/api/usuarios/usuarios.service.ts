import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UsuariosService {
	constructor(
		private http: HttpClient
	) { }

	public obtenerListaUsuarios(status: number, tipo: string): Observable<any> {
		return this.http.get<any>(`${api}/usuarios/obtenerListaUsuarios/${status}/${tipo}`);
	}

	public modificarUsuario(datosUsuarioModificacion: any): Observable<any> {
		return this.http.post<any>(api + '/usuarios/modificarUsuario', datosUsuarioModificacion);
	}

	public validarContraseniaActual(credenciales: any): Observable<any> {
		return this.http.post<any>(api + '/usuarios/validarContraseniaActual', credenciales);
	}

	public cambiarStatusSesion(pkUsuario: number): Observable<any> {
		return this.http.get<any>(api + `/usuarios/cambiarStatusSesion/${pkUsuario}`);
	}
}