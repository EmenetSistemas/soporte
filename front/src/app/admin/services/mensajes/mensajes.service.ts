import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class MensajesService {

	private mensajeError500: string = 'Al parecer ocurrió un error interno, por favor contactarse con el DTIC de GALA';

	mensajeEsperar(): void {
		Swal.fire({
			allowOutsideClick: false,
			text: 'Espere un momento...',
			icon: 'info',
			confirmButtonText: 'Cool',
			keyboard: false,
			allowEscapeKey: false
		} as any);
		Swal.showLoading();

		document.body.style.paddingRight = '';
	}


	cerrarMensajes(): void {
		Swal.close();
	}

	mensajeGenerico(mensaje: string, tipo: string, title: string = '', html = null): void {
		mensaje = mensaje == 'error' ? this.mensajeError500 : mensaje;
		let data: any = {
			title,
			allowOutsideClick: false,
			icon: tipo,
			html: mensaje,
			confirmButtonText: 'Continuar',
			buttonsStyling: false,
			customClass: {
				confirmButton: 'btn btn-primary'
			},
			keyboard: false,
			allowEscapeKey: false
		};
		if (html) {
			data['html'] = html;
		}
		Swal.fire(data);

		document.body.style.paddingRight = '';
	}

	mensajeGenericoToast(mensaje: string, tipo: string, tiempo: number = 3000) {
		let Toast: any = Swal.mixin({
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			timer: tiempo,
			timerProgressBar: true,
			willOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer)
				toast.addEventListener('mouseleave', Swal.resumeTimer)
				toast.addEventListener('click', Swal.stopTimer);
			}
		});

		Toast.fire({
			icon: tipo,
			title: mensaje
		});

		document.body.style.paddingRight = '';
	}

	mensajeConfirmacionCustom(mensaje: string, tipo: any, titulo: string = '', btnConfirmar = 'Continuar', btnCancelar = 'Cancelar', btnDenegado = 'Denegar', showDeny = false) {
		return Swal.fire({
			title: titulo,
			html: mensaje,
			icon: tipo,
			showDenyButton: showDeny,
			showCancelButton: true,
			confirmButtonText: btnConfirmar,
			cancelButtonText: btnCancelar,
			denyButtonText: btnDenegado,
			buttonsStyling: false,
			allowOutsideClick: false,
			customClass: {
				confirmButton: 'order-1 btn btn-primary me-2',
				cancelButton: 'order-2 btn btn-danger',
				denyButton: 'order-3'
			},
			allowEscapeKey: false
		});

		document.body.style.paddingRight = '';
	}
}