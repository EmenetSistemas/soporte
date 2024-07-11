import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatbotService } from 'src/app/admin/services/api/chatbot/chatbot.service';
import { PdfsService } from 'src/app/admin/services/api/pdfs/pdfs.service';
import { MensajesService } from 'src/app/admin/services/mensajes/mensajes.service';
import { ModalService } from 'src/app/admin/services/modal/modal.service';

@Component({
	selector: 'app-modal-orden-pdf',
	templateUrl: './modal-orden-pdf.component.html',
	styleUrls: ['./modal-orden-pdf.component.css']
})
export class ModalOrdenPdfComponent implements OnInit{
	@Input() pkOrden: number = 0;

	protected src: any;

	private telefono: string = '';
	private pdf64: string = '';

	constructor (
		private mensajes: MensajesService,
		private apiPdfs: PdfsService,
		private modal: ModalService,
		private sanitizer: DomSanitizer,
		private apiChatbot: ChatbotService
	) {}

	ngOnInit(): void {
		this.mensajes.mensajeEsperar();
		this.generarPdfOrdenServicio();
	}

	private generarPdfOrdenServicio(): void {
		this.apiPdfs.generarPdfOrdenServicio(this.pkOrden).subscribe(
			respuesta => {
				this.telefono = respuesta.telefono;
				this.pdf64 = 'data:application/pdf;base64,'+respuesta.pdf;
				this.src = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,'+respuesta.pdf);
				this.mensajes.cerrarMensajes();
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected enviarPdfCliente(): void {
		this.mensajes.mensajeConfirmacionCustom('¿Estás seguro de reenviar el PDF al cliente?', 'question', 'Reenviar PDF').then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();
				this.apiChatbot.enviarMediaOnline(this.telefono, this.pdf64);
			}
		);
	}

	protected cerrarModal(): void {
		this.modal.cerrarModal();
	}
}