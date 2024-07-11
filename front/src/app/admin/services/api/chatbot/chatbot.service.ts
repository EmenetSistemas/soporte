import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_bot } from 'src/environments/environment';
import { MensajesService } from '../../mensajes/mensajes.service';
import Swal from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class ChatbotService {
	constructor(
		private http: HttpClient,
		private mensajes: MensajesService
	) { }

	public enviarMensajeTexto(telefono: string, mensaje: string): Promise<any> {
		const data = {
			telefono: telefono.replace(/\s+/g, ''),
			mensaje
		};

		return this.apiChatbot(data).toPromise().then(
			respuesta => {
				this.mensajes.mensajeGenerico('Se envió el mensaje con éxito', 'success');
			}, error => {
				this.mensajes.mensajeGenerico('El servicio de mensajería no se encuentra disponible', 'warning');
			}
		);
	}

	public enviarMediaOnline(telefono: string, media: string): Promise<any> {
		const data = {
			telefono: telefono.replace(/\s+/g, ''),
			media
		};

		return this.apiChatbotMedia(data).toPromise().then(
			respuesta => {
				this.mensajes.mensajeGenerico('Se envió el archivo con éxito', 'success');
			}, error => {
				this.mensajes.mensajeGenerico('El servicio de mensajería no se encuentra disponible', 'warning');
			}
		);
	}

	public enviarMensajeTextoConfirmacion(telefono: string, mensaje: string, title: string, extra: any): any {
		Swal.fire({
			title,
			html: extra,
			icon: 'question',
			input: 'textarea',
			inputLabel: 'Mensaje a enviar',
			inputPlaceholder: 'Mensaje a enviar',
			inputValue: mensaje,
			showCancelButton: true,
			confirmButtonText: 'Enviar',
			cancelButtonText: 'Cancelar',
			buttonsStyling: false,
			allowOutsideClick: false,
			customClass: {
				confirmButton: 'order-1 btn btn-primary me-2',
				cancelButton: 'order-2 btn btn-danger',
				denyButton: 'order-3'
			},
			allowEscapeKey: false,
			inputValidator: (value): any => {
				if (!value) {
					return 'Es necesario colocar un mensaje para poder envíar'
				}
			}
		}).then((result: any) => {
			if (!result.isConfirmed) return;

			this.mensajes.mensajeEsperar();

			const data = {
				telefono: telefono.replace(/\s+/g, '').trim(),
				mensaje: result.value
			};
			
			this.apiChatbot(data).subscribe(
				respuesta => {
					this.mensajes.mensajeGenerico('Se envió el mensaje con éxito', 'success');
				}, error => {
					this.mensajes.mensajeGenerico('El servicio de mensajería no se encuentra disponible', 'warning');
				}
			);
		});
	}

	public apiChatbot(dataMensaje: any): Observable<any> {
		return this.http.post<any>(`${api_bot}/enviarMensajeTexto`, dataMensaje);
	}

	public apiChatbotMedia(dataMensaje: any): Observable<any> {
		return this.http.post<any>(`${api_bot}/enviarMediaOnline`, dataMensaje);
	}
}
