import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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

	constructor (
		private mensajes: MensajesService,
		private apiPdfs: PdfsService,
		private modal: ModalService,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit(): void {
		this.mensajes.mensajeEsperar();
		this.generarPdfOrdenServicio();
	}

	private generarPdfOrdenServicio(): void {
		this.apiPdfs.generarPdfOrdenServicio(this.pkOrden).subscribe(
			respuesta => {
				this.src = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,'+respuesta.pdf);
				this.mensajes.cerrarMensajes();
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected cerrarModal(): void {
		this.modal.cerrarModal();
	}
}