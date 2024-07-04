import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class GenericoService {
	constructor(
		private http: HttpClient
	) { }

	public obtenerEstadisticas(): Observable<any> {
		return this.http.get<any>(`${api}/estadisticas/obtenerEstadisticas`);
	}
}