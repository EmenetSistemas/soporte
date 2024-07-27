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

	public obtenerInformacionUsuarioPorToken(token: any): Observable<any> {
		return this.http.post<any>(api + '/usuarios/obtenerInformacionUsuarioPorToken', { token });
	}

	public obtenerInformacionUsuarioPorPk(pkUsuario: number): Observable<any> {
		return this.http.get<any>(api + `/usuarios/obtenerInformacionUsuarioPorPk/${pkUsuario}`);
	}
}