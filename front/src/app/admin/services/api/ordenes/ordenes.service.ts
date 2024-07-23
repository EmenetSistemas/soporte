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

	public cambioStatusServicio(cambioStatus: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/cambioStatusServicio`, cambioStatus);
	}

	public cancelarOrdenServicio(dataCancelacion: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/cancelarOrdenServicio`, dataCancelacion);
	}

	public retomarOrdenServicio(pkOrden: number): Observable<any> {
		return this.http.get<any>(`${api}/ordenes/retomarOrdenServicio/${pkOrden}`);
	}

	public concluirOrdenServicio(dataConclucion: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/concluirOrdenServicio`, dataConclucion);
	}

	public eliminarEquipoOrden(dataEliminacion: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/eliminarEquipoOrden`, dataEliminacion);
	}

	public entregarEquiposOrden(dataEntregar: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/entregarEquiposOrden`, dataEntregar);
	}

	public registrarSolicitudOrden(dataSolicitud: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/registrarSolicitudOrden`, dataSolicitud);
	}

	public obtenerSolicitudesOrdenes(status: number): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/obtenerSolicitudesOrdenes`, {status});
	}

	public obtenerMisSolicitudesOrdenes(status: number, token: any): Observable<any> {
		return this.http.post<any>(`${api}/ordenes/obtenerMisSolicitudesOrdenes`, {status, token});
	}

	public aprobarSolicitudOrden(pkSolicitud: number): Observable<any> {
		return this.http.get<any>(`${api}/ordenes/aprobarSolicitudOrden/${pkSolicitud}`);
	}

	public eliminarSolicitudOrden(pkSolicitud: number): Observable<any> {
		return this.http.get<any>(`${api}/ordenes/eliminarSolicitudOrden/${pkSolicitud}`);
	}
}