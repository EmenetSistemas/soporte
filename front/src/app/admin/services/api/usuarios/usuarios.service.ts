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

	public obtenerListaUsuarios(status: number): Observable<any> {
		return this.http.get<any>(`${api}/usuarios/obtenerListaUsuarios/${status}`);
	}
}
