import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class OrdenesService {
	constructor(
		private http: HttpClient
	) { }

	public registrarOrdenServicio(orden: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/registrarOrdenServicio`, orden);
	}
	
	public obtenerOrdenesServicio(status: number): Observable<any> {
		return this.http.get<any>(`${api}/ordenes/obtenerOrdenesServicio/${status}`);
	}
	
	public obtenerDetalleOrdenServicio(status: number): Observable<any> {
		return this.http.get<any>(`${api}/ordenes/obtenerDetalleOrdenServicio/${status}`);
	}

	public actualizarOrdenServicio(orden: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/actualizarOrdenServicio`, orden);
	}
}