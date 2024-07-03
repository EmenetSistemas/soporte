import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PdfsService {
	constructor(private http: HttpClient) { }

	public generarPdfOrdenServicio(pkOrden: number): Observable<any> {
		return this.http.get<any>(`${api}/pdfs/generarPdfOrdenServicio/${pkOrden}`);
	}
}